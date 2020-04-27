'use strict'

const Profile = require('../../controllers/profile');
const Router = require('koa-router');

const router = new Router();

router.get('/statistics', Profile.historyInRange(), Profile.statisticsFromHistory(), ctx => {
    ctx.body = {
        taste: ctx.state.taste,
        genres: ctx.state.genres,
    }
});

router.put('/statistics', Profile.historyInRange(), Profile.statisticsFromHistory(), ctx => {
    ctx.body = 'Statistics updated';
})

router.get('/history', Profile.historyInRange(), ctx => {
    ctx.body = {
        history: ctx.state.history,
    }
})

module.exports = router;
