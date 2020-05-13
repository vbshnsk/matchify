'use strict'

const Profile = require('../../controllers/profile');
const Router = require('koa-router');

const router = new Router();

router.get('/statistics', Profile.historyInRange(), Profile.genresFromHistory(), ctx => {
    ctx.body = {
        taste: ctx.state.profile.taste,
        genres: ctx.state.profile.genres,
    }
});

router.put('/statistics', Profile.historyInRange(), Profile.updateTaste(), ctx => {
    ctx.body = {taste: ctx.state.profile.taste };
});

router.get('/history', Profile.historyInRange(), ctx => {
    ctx.body = {
        history: ctx.state.history,
    }
})

module.exports = router;
