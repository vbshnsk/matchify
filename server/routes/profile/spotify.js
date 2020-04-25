'use strict'

const Spotify = require('../../controllers/spotify')
const Router = require('koa-router');

const router = new Router();


router.get('/spotify', Spotify.authorize());
router.get('/spotify_back', Spotify.login(), Spotify.startListening(), ctx =>{
    ctx.body = "Success";
});

module.exports = router;
