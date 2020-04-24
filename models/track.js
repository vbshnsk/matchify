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
    * @param {Object} options 
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
        return db.query(db.sql.insert("Play", {trackid, userid, listenedon: new Date()}));
    };

    static async validGenres(genres){
        const res = (await db.query(db.sql`select distinct name from "Genre" $where${{name: genres}}`)).rows;
        return res.map(val => val.name);
    }

    /**
     * 
     * @param {String} userid 
     * @param {Object} range
     * @param {Date} [range.from]
     * @param {Date} [range.to]
     */

    static async getPlaysInRange(userid, {from, to}){
        if(to === undefined) to = new Date();
        if(from === undefined) from = from.setDate(to.getDate() - 7);
        return await db.query(`
        select "Track".* from "Play" 
        join "Track" on "Play".trackid = "Track".trackid
        where userid=$1 and (listenedon>$2 and listenedon<$3)`, [userid, from, to]);
    }

    static async getMainGenres(genres){
        const res = await db.query(db.sql`
        select distinct maingenre from "Genre"
        $where${{name: genres}}
        `);
        return res.rows.reduce((accum, val) => [...accum, val.maingenre], []);
    }
}

module.exports = Track;