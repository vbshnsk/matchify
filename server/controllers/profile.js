'use strict'

const Track = require('../models/track');
const Taste = require('../models/taste');
const User = require('../models/user');
const AWS = require('aws-sdk');
const fs = require('fs');

/**
 * Calculate the Taste based on what User has played
 * @param {[Track]} plays 
 * 
 */

const calculateTaste = async (plays) => {
    const stats = new Taste();
    const maingenres = await Promise.all(plays.map(val => Track.getMainGenres(val.genres)));

    maingenres.map(val => 
        val.reduce((accum, val) => {
            accum[val]++;
            return accum;
    }, new Taste()))
    .forEach(val => stats.add(val));
    return stats.normalize();
}

/**
 * Claculate the number of different genres the User has played
 * @param {[Track]} plays 
 * 
 */

const calculateGenrePlays = (plays) => {
    const genres = plays.map(val => val.genres).flat();
    const count = genres.reduce((accum, val) => {
        if(!accum[val]) accum[val] = 0;
        accum[val]++;
        return accum;
    }, []);
    let top = Object.entries(count).sort((a, b) => {
        if(a[1] > b[1]) return -1;
        return 1;
    });
    return top;
}

/**
 * Returns current request User's history of Plays
 * @param {Date} from 
 * @param {Date} to 
 */

const historyInRange = (from, to) => {
    return async (ctx, next) => {
        const username = ctx.state.profile.username;
        const plays = (await Track.getPlaysInRange(username, {from, to})).rows;

        ctx.state.history = plays;
        await next();
    }
}

const updateTaste = () => {
    return async (ctx, next) => {
        const plays = ctx.state.history;
        const taste = await calculateTaste(plays)

        Taste.update(ctx.state.profile.username, taste);
        ctx.state.profile.taste = taste;
        await next();
    }
}

const genresFromHistory = () => {
    return async (ctx, next) => {
        const plays = ctx.state.history;
        ctx.state.profile.genres = calculateGenrePlays(plays);
        
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
        if(username === 'me'){
            if(ctx.session.authorized){
                ctx.state.profile = await User.getProfileInfo(ctx.session.username);
                await next();
            }
            else {
                ctx.status = 401;
             }
        }
        else {
            const user = await User.selectOneByUsername(username)
            if(user){
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
        for(const photo of toUpload){
            const rs = fs.createReadStream(photo.path); 
            const name = "profile/" + username + '/photo'+ n + '.png';
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

const getTopGenres = taste => Object.keys(taste)
    .sort((a, b) => taste[b] - taste[a])
    .splice(0, 3)
    .reduce((prev, cur) => [...prev, cur, taste[cur] - 0.1, taste[cur] + 0.1], []);

const getUserClosestMatches = () => {
    return async (ctx, next) => {
        const topGenres = getTopGenres(ctx.state.profile.taste);
        const preference = ctx.state.profile.preference;
        ctx.state.matches = await User.getClosestMatches(ctx.state.profile.username, topGenres, null, null, preference);
        await next();
    }
}

const getUserMatches = () => {
    return async (ctx, next) => {
        ctx.state.matches = await User.getMatches(ctx.state.profile.username);
        await next();
    } 
}

const addMatch = () => {
    return async (ctx, next) => {
        const match = ctx.request.body.match;
        const username = ctx.state.profile.username;
        ctx.state.isAMatch = await User.addMatch(username, match);
        await next();
    }
}

module.exports = { 
    historyInRange,
    genresFromHistory,
    updateTaste,
    exists,
    isProtected,
    uploadPhotos,
    updateProfile,
    getUserClosestMatches,
    getUserMatches,
    addMatch,
 };