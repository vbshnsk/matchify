'use strict'

const Spotify = require('../../controllers/spotify')
const Profile = require('../../controllers/profile')
const Router = require('koa-router');

const router = new Router();

router.get('/spotify', Spotify.authorize());

router.get('/spotify_login', Spotify.login(), Spotify.getRecentData(), Profile.historyInRange(), Profile.updateTaste(), Spotify.startListening(), ctx =>{
    ctx.body = "Success";
});

module.exports = router;
