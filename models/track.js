'use strict'

const db = require('../db');

/**
 * 
 * @param {{}} data 
 */

const insert = async (data) => (await db.query(db.sql`insert into "Track" $keys${Object.keys(data)} $values${data} returning trackid`)).rows[0]['trackid'];

/**
 * 
 * @param {String} name 
 * @param {[String]} artists 
 * 
 */

const getID = async (name, artists) => {
    let res = (await db.query(db.sql`select trackid from "Track" where name=${name} and artists=${artists}`)).rows[0];
    if(res !== undefined){
        res = res.trackid;
    }
    return res;
};

/**
 * 
 * @param {String} trackid 
 * @param {String} userid 
 * 
 */

const insertPlay = async (trackid, userid) => db.query(db.sql.insert("Play", {trackid, userid}));


module.exports = {
    insert,
    insertPlay,
    getID,
 }