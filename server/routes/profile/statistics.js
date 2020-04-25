'use strict'

const Profile = require('../../controllers/profile');
const Router = require('koa-router');

const router = new Router();

router.use(Profile.historyInRange());

router.get('/statistics', Profile.statisticsFromHistory(), ctx => {
    ctx.body = {
        taste: ctx.session.taste,
        genres: ctx.state.genres,
    }
});

router.get('/history', ctx => {
    ctx.body = {
        history: ctx.state.history,
    }
})

module.exports = router;
