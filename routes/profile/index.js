'use strict'

const Router = require('koa-router');
const router = new Router();

const spotify = require('./spotify').routes();

router.prefix('/profile');

router.get('/', ctx => {
    ctx.body = "Imma be an actual profile real soon";
})

router.use(spotify);

module.exports = router;