'use strict'

const Spotify = require('../../controllers/spotify')
const Router = require('koa-router');

const router = new Router();

router.get('/spotify', Spotify.authorize());

router.post('/spotify', Spotify.login(), Spotify.getRecentData(), Spotify.startListening(), ctx =>{
    ctx.body = "Success";
});

module.exports = router;
