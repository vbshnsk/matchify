'use strict'

const db = require('../db');

class Taste {
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

module.exports = Taste;