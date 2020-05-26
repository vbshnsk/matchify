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

const calculateStats = (plays) => {
    const stats = {
        genres: [],
        artists: [],
        tracks: [],
    };
    plays.forEach(val => {
        stats.genres = [...stats.genres, ...val.genres];
        stats.artists = [...stats.artists, ...val.artists];
        stats.tracks = [...stats.tracks, val.name];
    });
    for (const key in stats) {
        const count = stats[key].reduce((accum, val) => {
            if (!accum[val]) accum[val] = 0;
            accum[val]++;
            return accum;
        }, {});
        stats[key] = Object.entries(count).sort((a, b) => {
            if (a[1] > b[1]) return -1;
            return 1;
        });
    }
    return stats;
}

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
            taste = await calculateTaste(plays)
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
        ctx.state.profile.stats = calculateStats(plays);

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
                ctx.state.profile.stats = calculateStats(plays);
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

const getTopGenres = (taste, eps) => Object.keys(taste)
    .sort((a, b) => taste[b] - taste[a])
    .splice(0, 3)
    .reduce((prev, cur) => [...prev, cur, taste[cur] - eps, taste[cur] + eps], []);

const getUserClosestMatches = () => {
    return async (ctx, next) => {
        const eps = 0.5;
        const topGenres = getTopGenres(ctx.state.profile.taste, eps);
        const preference = ctx.state.profile.preference;
        const matches = await User.getClosestMatches(ctx.state.profile.username, topGenres, null, null, preference, eps);
        for (const match of matches) {
            const taste = {}
            for (const key in match) {
                const genresArr = ['classical', 'rock', 'pop', 'hiphop', 'rnb', 'country', 'jazz', 'electronic', 'latin', 'folk', 'blues'];
                if (genresArr.some(val => key === val)) {
                    taste[key] = match[key];
                    match[key] = undefined;
                }
            }
            match.taste = taste;
            const plays = (await Track.getPlaysInRange(match.username)).rows;
            match.plays = plays.slice(0, 5).map(val => { return { artists: val.artists, track: val.name } });
            match.topGenres = calculateStats(plays).genres.slice(0, 10);
        }
        ctx.state.matches = matches;
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

const addDitch = () => {
    return async (ctx, next) => {
        const ditch = ctx.request.body.ditch;
        const username = ctx.state.profile.username;
        await User.addDitch(username, ditch);
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
    getUserClosestMatches,
    getUserMatches,
    addMatch,
    addDitch,
};