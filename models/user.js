'use strict'

const db = require('../db');
const bcrypt = require('bcrypt');

/**
 *  Validate user data before register.
 * @param {{username: String, password: String, email: String }} data 
 */

const validate = data => {
    const usernameMatcher =  /^[a-z0-9_-]{3,16}$/;
    const passwordMatcher = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/; 
    if (usernameMatcher.test(data.username) &&
        passwordMatcher.test(data.password)) {
            return Object.assign({}, data);
    }
    else {
        throw new Error("Registration Error");
    }
}

const hashPassword = password => {
    const salt = 10;
    const hash = bcrypt.hash(password, salt);
    return hash;
}

class User {

    constructor({userid, username, password, email, spotify}){
        this.userid = userid;
        this.username = username;
        this.password = password;
        this.email = email;
        this.spotify = spotify;
    }

    /**
 	* Authorization middleware.
 	*/

    static authorize(){
        return async function(ctx, next) {
            const data = ctx.request.body;
            const user = await User.selectOneByUsername(data.username);

            if (user === undefined) { throw new Error("Authorization Error"); }
            const passwordValidation = await bcrypt.compare(data.password, user.password);
            if (!passwordValidation) { throw new Error("Authorization Error"); }
    
            ctx.session.userid = user.userid;
    		ctx.session.authorized = true;

            await next()
     	  }
	}
	
	/**
 	* Registration middleware.
	 */

    static register(){ 
        return async (ctx, next) => {
            const data = validate(ctx.request.body);
            data.password = await hashPassword(data.password); 
            await db.query(db.sql.insert("User", data));
            await next();
        }      
    }

<<<<<<< HEAD
const register = () => { 
    return async (ctx, next) => {
        const data = validate(ctx.request.body);
        data.password = await hashPassword(data.password); 
        await db.query(db.sql.insert("User", data));
        await next();
    } 
}

const logout = () => {
    return async (ctx, next) => {
        ctx.session = null;
        await next();
    /**
 	* Logout middleware.
 	*/

    static logout(){
        return async (ctx, next) => {
            ctx.session.userid = undefined;
        	ctx.session.authorized = false;
            await next();
        }
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

}

module.exports = User;
 