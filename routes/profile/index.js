'use strict'

const Router = require('koa-router');
const Profile = require('../../controllers/profile')
const router = new Router();

const spotify = require('./spotify').routes();

router.prefix('/profile');

router.get('/', ctx => {
    ctx.body = "Imma be an actual profile real soon";
})

router.get('/statistics', Profile.statisticsOver(7), ctx =>{
    ctx.body = {
        history: ctx.state.history,
        taste: ctx.session.taste, 
        genres: ctx.state.genres,
    };
})

router.use(spotify);

module.exports = router;