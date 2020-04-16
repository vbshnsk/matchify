'use strict'

const Track = require('./track');
const User = require('./user');
const SpotifyApi = require('spotify-web-api-node');
const credentials = {
    redirectUri: 'http://localhost:3000/profile/spotify_back',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}

/**
 * Generate Spotify authorization link and redirect user.
 */

const authorize = () => {
    return async ctx => {
        const auth = new SpotifyApi(credentials);
        const scopes = ['user-read-private', 'user-read-playback-state'];
        const authURL = auth.createAuthorizeURL(scopes, 'something');
        ctx.redirect(authURL);
    }
}

/**
 * Add user's Spotify auth tokens to DB.
 */

const login = () => {
    return async (ctx, next) => {
        const code = ctx.query.code;
        const spotify = new SpotifyApi(credentials);
        const data = await spotify.authorizationCodeGrant(code);
        const tokens = { access: data.body.access_token, refresh: data.body.refresh_token };
        const userid = ctx.session.userid;
        await User.updateById(userid, { spotify: tokens });
        await next();
    }
}

/**
 * Refresh tokens
 * @param {SpotifyApi} spotify 
 */

const refreshCredentials = async (spotify, userid) => {
    const data = (await spotify.refreshAccessToken()).body;
    const tokens = { access: data.access_token, refresh: spotify.getRefreshToken() };
    spotify.setAccessToken(tokens.access);
    await User.updateById(userid, { spotify: tokens });
}

/**
 * Get current playing track data.
 * @param {SpotifyApi} spotify 
 */

const getCurrentTrack = async (spotify) => {
    const fetch = (await spotify.getMyCurrentPlayingTrack()).body;  
    if (!fetch.item) return undefined;
    const track = {
        artists: fetch.item.artists.map(val => val.name),
        name: fetch.item.name,
        genres: [],
        spotifyid: fetch.item.id, 
    }
    return {
        track, 
        timestamp: fetch.timestamp,
    }
}

/**
 * Send request to Spotify Web Api every ... seconds and gather listening data.
 * @param {SpotifyApi} spotify 
 * @param {string} userid 
 */

const listenToStreams = (spotify, userid) => {
    setInterval(async function(){
        try {
            const trackInfo = await getCurrentTrack(spotify);
            if (trackInfo === undefined) return;
            const track = trackInfo.track;
            //if currently playing track is not the same as before (accounting the repeat)
            if(this.current != trackInfo.timestamp){
                this.current = trackInfo.timestamp;
                //get track id from DB 
                let trackid = await Track.getID(track.name, track.artists);
                //add track to DB if it isn't there
                if(!trackid){
                    trackid = await Track.insert(track);
                }
                //add play to DB
                await Track.insertPlay(trackid, userid);
            }
        } catch (error) {
            if (error.message === 'Unauthorized'){
                refreshCredentials(spotify, userid);
            }
        }
    }, 30000);
};

/**
 * Start listening to user's streams middleware.
 */

const startListening = () => {
    return async (ctx, next) => {
        const userid = ctx.session.userid;
        const tokens = (await User.selectOneByID(userid, "spotify")).spotify;
        const spotify = new SpotifyApi(credentials);
        spotify.setRefreshToken(tokens.refresh);
        spotify.setAccessToken(tokens.access);

        listenToStreams(spotify, userid);
        await next();
    }
}

module.exports = {
    authorize,
    login,
    startListening,
}