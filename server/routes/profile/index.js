'use strict'

const Router = require('koa-router');
const router = new Router();

const Profile = require('../../controllers/profile')

const statistics = require('./statistics').routes();
const spotify = require('./spotify').routes();
const matching = require('./matching').routes();
const chat = require('./chat');

const bodyParser = require('koa-body');

router.prefix('/profile/:username');

router.param('username', Profile.exists());

router.get('/', (ctx, next) => {
    ctx.body = ctx.state;
})

router.put('/', bodyParser(), Profile.isProtected(), Profile.updateProfile(), ctx => {
    ctx.status = 200;
})

router.get('/photos', ctx => {
    ctx.body = ctx.state.profile.photos;
})

router.post('/photos', bodyParser({multipart: true}), Profile.isProtected(), Profile.uploadPhotos(), ctx => {
    ctx.status = 200;
});

router.use(statistics, spotify, matching, chat.router.routes());

module.exports = {
    Profile: router,
    WSChat: chat.WSChat, 
};