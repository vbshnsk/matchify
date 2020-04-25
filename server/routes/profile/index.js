'use strict'

const Router = require('koa-router');
const router = new Router();

const statistics = require('./statistics').routes();
const spotify = require('./spotify').routes();

router.prefix('/profile');

router.get('/', ctx => {
    ctx.body = "Imma be an actual profile real soon";
})

router.use(spotify, statistics);

module.exports = router;