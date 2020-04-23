'use strict'

const db = require('../db');

class Track {
    constructor({trackid, name, artists, genres, spotifyid}){
        this.trackid = trackid;
        this.name = name;
        this.artists = artists;
        this.genres = genres;
        this.spotifyid = spotifyid;
    }

    /**
    * 
    * @param {Track} data 
    * 
    */

    static async insert(data){
        return (await db.query(db.sql`insert into "Track" $keys${Object.keys(data)} $values${data} returning trackid`)).rows[0];
    }

    /**
    * 
    * @param {{}} options 
    * 
    */

    static async getID(options){
        let res = (await db.query(db.sql`select trackid from "Track" $where${options}`)).rows[0];
        if(res !== undefined){
            res = res.trackid;
        }
        return res;
    }

    /**
    * 
    * @param {String} trackid 
    * @param {String} userid 
    * 
    */

    static async insertPlay(trackid, userid){
        return db.query(db.sql.insert("Play", {trackid, userid}));
    };

    static async validGenres(genres){
        const res = (await db.query(db.sql`select name from "Genre" $where${{name: genres}}`)).rows;
        return res.map(val => val.name);
    }
}



module.exports = Track;