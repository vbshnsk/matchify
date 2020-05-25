'use strict'

const Track = require('../models/track');
const User = require('../models/user');
const SpotifyApi = require('spotify-web-api-node');
const credentials = {
    redirectUri: process.env.CLIENT + '/profile/spotify',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}
const http = require('http');   

/**
 * Generate Spotify authorization link.
 */

const authorize = () => {
    return async ctx => {
        const user = await User.selectOneByID(ctx.session.userid);
        const auth = new SpotifyApi(credentials);
        const scopes = ['user-read-private', 'user-read-playback-state', 'user-read-recently-played'];
        const authURL = auth.createAuthorizeURL(scopes, 'something');
        if(user.spotify) ctx.body = 'authorized'
        else ctx.body = authURL;
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
 * Returns a SpotifyAPI instance with current user's credentials from the database
 * @param {String} userid 
 */

const getSpotifyInstance = async (userid) => {
    const tokens = (await User.selectOneByID(userid, "spotify")).spotify;
    const spotify = new SpotifyApi();
    spotify.setRefreshToken(tokens.refresh);
    spotify.setAccessToken(tokens.access);
    spotify.setClientId(process.env.CLIENT_ID);
    spotify.setClientSecret(process.env.CLIENT_SECRET);
    return spotify;
}

/**
 * Inserts User's Play into the DB
 * @param {String} userid 
 * @param {Track} track 
 * @param {Date} timestamp
 */

const insertPlay = async (userid, track, timestamp) => {
    let trackid = await Track.getID({spotifyid: track.spotifyid});
    if(!trackid){
        track.genres = await setGenres(track);
        trackid = (await Track.insert(track)).trackid;
    }
    await Track.insertPlay(trackid, userid, timestamp);
}

/**
 * Returns the most recent 50 tracks User has played.
 */

const getRecentData = () => {
    return async (ctx, next) => {
        const userid = ctx.session.userid;
        const spotify = await getSpotifyInstance(userid);
        await refreshCredentials(spotify, userid);

        const history = (await spotify.getMyRecentlyPlayedTracks({limit: 50})).body.items
        .map(val => 
        [
            {   
                artists: val.track.artists.map(info => info.name),
                name: val.track.name,
                spotifyid: val.track.id
            },
            new Date(val.played_at)
        ]);

        for (const track of history) {
            await insertPlay(userid, ...track);
        }
        
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
    const track ={
        artists: fetch.item.artists.map(val => val.name),
        name: fetch.item.name,
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
    let current;
    setInterval(async function(spotify){
        try {
            const trackInfo = await getCurrentTrack(spotify);
            if (trackInfo === undefined) return;
            const track = trackInfo.track;
            if(current !== trackInfo.timestamp){
                current = trackInfo.timestamp;
                await insertPlay(userid, track, new Date(trackInfo.timestamp));
            }
        } catch (error) {
            console.log(error);
            if (error.message === 'Unauthorized'){
                await refreshCredentials(spotify, userid);
            }
        }
    }, 30000, spotify);
};


/**
 * Start listening to user's streams middleware.
 */

const startListening = () => {
    return async (ctx, next) => {
        const userid = ctx.session.userid;
        const spotify = await getSpotifyInstance(userid);

        listenToStreams(spotify, userid);
        await next();
    }
}

/**
 * Fetch tags from Last.fm
 * @param {String} query
 */

const fetchTags = (query) => new Promise((resolve, reject) =>{
    http.get(query, res => {
        res.setEncoding('utf8');
        let buffer = "";
        res.on("data", chunk => {
            buffer += chunk;
        })
        res.on("end", () => {
            const res = JSON.parse(buffer).toptags;
            if(res === undefined) resolve([]);
            const tags = res.tag.slice(0, 5).map(tag => tag.name.toLowerCase());
            if (tags.length === 0) resolve([]);                
            resolve(Track.validGenres(tags));
        })
        res.on("error", (err) =>{
            resolve([]);
        })
    });   
})

const setGenres = async (track) => {
    const name = encodeURIComponent(track.name);
    const artist = encodeURIComponent(track.artists[0]);
    const trackQuery = `http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist=${artist}&track=${name}&api_key=${process.env.LAST_API}&format=json`;
    const artistQuery = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artist}&api_key=${process.env.LAST_API}&format=json`;

    try {
        let genres = await fetchTags(trackQuery);
        if(genres.length === 0) genres = await fetchTags(artistQuery);
        return genres;
    } catch (error) {
        console.log(error);
        return [];
    }
}

module.exports = {
    authorize,
    login,
    startListening,
    getRecentData,
}