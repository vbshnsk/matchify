'use strict'

const Track = require('../models/track');
const Taste = require('../models/taste');
const User = require('../models/user');
const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Returns current request User's history of Plays
 * @param {Date} from 
 * @param {Date} to 
 */

const historyInRange = (from, to) => {
    return async (ctx, next) => {
        const username = ctx.state.profile.username;
        const plays = (await Track.getPlaysInRange(username, ctx.request.query.page)).rows;

        ctx.state.history = plays;
        await next();
    }
}

const updateTaste = (src) => {
    return async (ctx, next) => {
        let taste;
        if (src === 'spotify' || ctx.request.body.sync) {
            const plays = ctx.state.history;
            taste = await Taste.calculateTaste(plays)
        }
        else {
            taste = ctx.request.body.taste;
        }

        Taste.update(ctx.state.profile.username, taste);
        ctx.state.profile.taste = taste;
        await next();
    }
}

const statsFromHistory = () => {
    return async (ctx, next) => {
        const plays = ctx.state.history;
        ctx.state.profile.stats = Taste.calculateStats(plays);

        await next();
    }
}

/**
 * Existence of requested User's profile in database middleware.
 * if requested profile is own, checks if User is authorized else sends 401
 * if requested User does not exist, sends 404 
 */

const exists = () => {
    return async (username, ctx, next) => {
        if (username === 'me') {
            if (ctx.session.authorized) {
                ctx.state.profile = await User.getProfileInfo(ctx.session.username);
                const plays = (await Track.getPlaysInRange(ctx.session.username)).rows;
                ctx.state.profile.stats = Taste.calculateStats(plays);
                await next();
            }
            else {
                ctx.status = 401;
            }
        }
        else {
            const user = await User.selectOneByUsername(username)
            if (user) {
                ctx.state.profile = await User.getProfileInfo(user.username);
                await next();
            }
            else {
                ctx.status = 404;
            }
        }
    }
}

const isProtected = () => {
    return async (ctx, next) => {
        if (ctx.session.authorized && ctx.state.profile.username === ctx.session.username) {
            await next();
        }
        else {
            ctx.status = 401;
        }
    }
}

const uploadPhotos = () => {
    return async (ctx, next) => {
        const username = ctx.session.username;
        const toUpload = [].concat(ctx.request.files.photos);
        const s3 = new AWS.S3();
        let photos = ctx.state.profile.profilephotos || [];
        let n = photos.length;
        for (const photo of toUpload) {
            const rs = fs.createReadStream(photo.path);
            const name = "profile/" + username + '/photo' + n + '.png';
            await s3.upload({
                Bucket: 'matchify',
                Body: rs,
                Key: name,
            }).promise();
            photos = [...photos, name];
            await User.updateById(ctx.session.userid, { profilephotos: photos });
            n++;
        }
        await next();
    }
}

const updateProfile = () => {
    return async (ctx, next) => {
        const id = ctx.session.userid;
        await User.updateById(id, ctx.request.body);
        await next();
    }
}


module.exports = {
    historyInRange,
    statsFromHistory,
    updateTaste,
    exists,
    isProtected,
    uploadPhotos,
    updateProfile,
};