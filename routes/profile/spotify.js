'use strict'

const SpotifyApi = require('spotify-web-api-node');
const Router = require('koa-router');

const spotify = new SpotifyApi({
    redirectUri: 'http://localhost:3000/profile/spotify',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

const router = new Router();

router.get('/spotify', async ctx => {
    const code = ctx.request.query.code;
    if(code){
        const data = await spotify.authorizationCodeGrant(code);
        ctx.redirect('/profile');
        spotify.setAccessToken(data.body.access_token);
        spotify.setRefreshToken(data.body.access_token);
    }
    else {
        const scopes = ['user-read-private', 'user-read-playback-state'];
        const authURL = spotify.createAuthorizeURL(scopes, 'something');
        ctx.redirect(authURL);
    }
});


module.exports = router;
