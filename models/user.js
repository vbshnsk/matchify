'use strict'

const db = require('../db');
const bcrypt = require('bcrypt');

const usernameMatcher =  /^[a-z0-9_-]{3,16}$/;
const passwordMatcher = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
const dateMatcher = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const hashPassword = password => {
    const salt = 10;
    const hash = bcrypt.hash(password, salt);
    return hash;
}

/**
 *  Validate user data before register.
 * @param {{username: String, password: String, email: String }} data 
 */

const validate = data => {
    if (usernameMatcher.test(data.username) &&
        passwordMatcher.test(data.password)) {
            return Object.assign({}, data);
    }
    else {
        throw new Error("Registration Error");
    }
}

/**
 * Authorization middleware.
 */

const authorize = () => {
    return async function(ctx, next) {
        const data = ctx.request.body;
        const user = await selectOneByUsername(data.username);
        
        if (user === undefined) { throw new Error("Authorization Error"); }
        const passwordValidation = await bcrypt.compare(data.password, user.password);
        if (!passwordValidation) { throw new Error("Authorization Error"); }

        ctx.session.userid = user.userid;

        await next()
    }
}
/**
 * Registration middleware.
 */

const register = () => { 
    return async (ctx, next) => {
        const data = validate(ctx.request.body);
        data.password = await hashPassword(data.password); 
        await db.query(db.sql.insert("User", data));
        await next();
    } 
}

/**
 * Logout middleware.
 */

const logout = () => {
    return async (ctx, next) => {
        ctx.session = null;
        await next();
    }       
}

/**
 * 
 * @param {String} userid 
 * @param  {...String} [columns] 
 *
 */

const selectOneByID = async (userid, ...columns) => (await db.query(db.sql`select $raw${columns.length ? columns : '*'} from "User" where userid=${userid}`)).rows[0];

/**
 * 
 * @param {String} username 
 * @param  {...String} [columns] 
 *  
 */

const selectOneByUsername = async (username, ...columns) => (await db.query(db.sql`select $raw${columns.length ? columns : '*'} from "User" where username=${username}`)).rows[0];

/**
 * 
 * @param {String} id
 * @param  {{}} data
 *
 */

const updateById = async (id, data) => db.query(db.sql`update "User" $set${data} where userid=${id}`);

module.exports = {
    selectOneByUsername,
    selectOneByID,
    updateById,
    register,
    authorize,
    logout,
}
 