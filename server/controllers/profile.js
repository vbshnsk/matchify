'use strict'

const Track = require('../models/track');
const Taste = require('../models/taste');

/**
 * 
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
 * 
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


const historyInRange = (from, to) => {
    return async (ctx, next) => {
        const username = ctx.state.username;
        const plays = (await Track.getPlaysInRange(username, {from, to})).rows;

        ctx.state.history = plays;
        await next();
    }
}

/**
 * 
 * @param {number} days
 * 
 */

const statisticsFromHistory = () => {
    return async (ctx, next) =>{
        const plays = ctx.state.history;

        ctx.session.taste = await calculateTaste(plays);
        ctx.state.genres = calculateGenrePlays(plays);
        
        await next();
    }
}

const isAuthorized = () => {
    return async (username, ctx, next) => {
        if(username === 'me'){
            if(ctx.session.authorized){
                ctx.state.username = ctx.session.username;
                await next();
            }
            else {
                ctx.status = 401;
             }
        }
        else {
            ctx.state.username = username;
            await next();
        }
    }
}

module.exports = { 
    historyInRange,
    statisticsFromHistory,
    isAuthorized,
 };