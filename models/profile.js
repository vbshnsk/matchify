'use strict'

const Track = require('./track');
const db = require('../db');

class Taste{
    constructor(classical = 0, rock = 0, pop = 0,
                hiphop = 0, rnb = 0, country = 0,
                jazz = 0, electronic = 0, latin = 0,
                folk = 0, blues = 0){

        this['classical'] = classical;
        this['rock'] = rock;
        this['pop'] = pop;
        this['hip hop'] = hiphop;
        this['r&b'] = rnb;
        this['country'] = country;
        this['jazz'] = jazz;
        this['electronic'] = electronic;
        this['latin'] = latin;
        this['folk'] = folk;
        this['blues'] = blues;

    }

    add(other){
        for (const key in other) {
            this[key] += other[key];
        }
        return this;
    }

    normalize(){
        let sum = 0;
        for (const key in this) {
            sum += this[key];
        }
        if(sum === 0) return this;
        for (const key in this) {
            this[key] /= sum;
            this[key] = this[key].toPrecision(3);
        }
        return this;
    }
}

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
 * 
 * @param {number} days
 * 
 */

const statisticsOver = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return async (ctx, next) =>{
        const userid = ctx.session.userid;
        const plays = (await Track.getPlaysInRange(userid, {from: date})).rows;


        ctx.session.taste = await calculateTaste(plays);
        ctx.state.genres = calculateGenrePlays(plays);
        ctx.state.history = plays;
        await next();
    }
}

module.exports = { statisticsOver };