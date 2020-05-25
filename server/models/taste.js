'use strict'

const db = require('../db');

class Taste {
    constructor(classical = 0, rock = 0, pop = 0,
                hiphop = 0, rnb = 0, country = 0,
                jazz = 0, electronic = 0, latin = 0,
                folk = 0, blues = 0, userid){

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
}

module.exports = Taste;