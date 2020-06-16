'use strict'

const db = require('../db');
const Track = require('./track')

class Taste {
    constructor({classical = 0, rock = 0, pop = 0,
                hiphop = 0, rnb = 0, country = 0,
                jazz = 0, electronic = 0, latin = 0,
                folk = 0, blues = 0} = {}, userid){
        this['classical'] = classical;
        this['rock'] = rock;
        this['pop'] = pop;
        this['hiphop'] = hiphop;
        this['rnb'] = rnb;
        this['country'] = country;
        this['jazz'] = jazz;
        this['electronic'] = electronic;
        this['latin'] = latin;
        this['folk'] = folk;
        this['blues'] = blues;  
        if(userid){
            this.userid = userid;
        }

    }

    add(other){
        for (const key in other) {
            if(key != 'userid') this[key] += other[key];
        }
        return this;
    }

    normalize(){
        let sum = 0;
        for (const key in this) {
            if(key != 'userid') sum += this[key];
        }
        if(sum === 0) return this;
        for (const key in this) {
            if(key != 'userid'){
                this[key] /= sum;
                this[key] = this[key] * 100;
            }
        }
        return this;
    }

    static async update(username, data) {
        (await db.query(db.sql`
        update "Taste"
        $set${data}
        where username=${username}
        returning *
        `))
    }

    static async calculateTaste(plays) {
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

    static calculateStats(plays) {
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

    getTopGenres(eps){
        return Object.keys(this)
        .sort((a, b) => this[b] - this[a])
        .splice(0, 3)
        .reduce((prev, cur) => [...prev, cur, this[cur] - eps, this[cur] + eps], []);
    }

}

module.exports = Taste;