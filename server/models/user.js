'use strict'

const db = require('../db');

class User {

    constructor({userid, username, password, email, spotify}){
        this.userid = userid;
        this.username = username;
        this.password = password;
        this.email = email;
        this.spotify = spotify;
    }
    
	/**
 	* 
 	* @param {String} userid 
 	* @param  {...String} [columns] 
 	*
 	*/
    
    static async selectOneByID(userid, ...columns) { 
        try {
            return new User((await db.query(db.sql`
            select $raw${columns.length ? columns : '*'} 
            from "User" 
            where userid=${userid}`)).rows[0]);
        } catch (error) {
            return undefined;
        }
    }

    /**
 	* 
	* @param {String} username 
 	* @param  {...String} [columns] 
 	*  
 	*/

    static async selectOneByUsername(username, ...columns) {
        try {
            return new User((await db.query(db.sql`
            select $raw${columns.length ? columns : '*'} 
            from "User" where 
            username=${username}`)).rows[0]);
        } catch (error) {
            return undefined;
        }
    }

    /**
 	* 
 	* @param {String} id
 	* @param  {User} data
 	*
 	*/

    static async updateById(id, data){
        try {
            return new User((await db.query(db.sql`
            update "User" 
            $set${data} 
            where userid=${id} 
            returning *`)).rows[0]);
        } catch (error) {
            return undefined;
        }
    }

    static async insert(data){
        return db.query(db.sql.insert("User", data));
    }

}

module.exports = User;
 