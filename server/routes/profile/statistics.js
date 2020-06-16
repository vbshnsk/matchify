'use strict'

const Profile = require('../../controllers/profile');
const Router = require('koa-router');
const bodyParser = require('koa-body');

const router = new Router();

router.get('/statistics', Profile.historyInRange(), Profile.statsFromHistory(), ctx => {
    ctx.body = {
        taste: ctx.state.profile.taste,
        genres: ctx.state.profile.genres,
    }
});

router.put('/statistics', bodyParser(), Profile.historyInRange(), Profile.updateTaste(), ctx => {
    ctx.body = { taste: ctx.state.profile.taste };
});

router.get('/history', Profile.historyInRange(), ctx => {
    ctx.body = {
        history: ctx.state.history,
    }
})

module.exports = router;
