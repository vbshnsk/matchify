const Taste = require('../models/taste');
const Track = require('../models/track');
const User = require('../models/user');

const getUserClosestMatches = () => {
    return async (ctx, next) => {
        const eps = 5;
        const taste = new Taste(ctx.state.profile.taste);
        const topGenres = taste.getTopGenres(eps);
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
            match.topGenres = Taste.calculateStats(plays).genres.slice(0, 10);
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
    getUserClosestMatches,
    getUserMatches,
    addMatch,
    addDitch
};