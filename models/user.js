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

const validate = data => {
    if (usernameMatcher.test(data.username) &&
        passwordMatcher.test(data.password)) {
            return Object.assign({}, data);
    }
    else {
        throw new Error("Registration Error");
    }
}

const authorize = () => {
    return async function(ctx, next) {
        const data = ctx.request.body;
        const user = await selectOneByUsername(data.username);
        
        if (user === undefined) { throw new Error("Authorization Error"); }
        const passwordValidation = await bcrypt.compare(data.password, user.password);
        if (!passwordValidation) { throw new Error("Authorization Error"); }

        console.log(1);
        ctx.session.userid = user.userid;

        await next()
    }
}

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
    }
}

const selectOneByID = async (userid, ...columns) => (await db.query(db.sql`select $raw${columns.length ? columns : '*'} from "User" where userid=${userid}`)).rows[0];

const selectOneByUsername = async (username, ...columns) => (await db.query(db.sql`select $raw${columns.length ? columns : '*'} from "User" where username=${username}`)).rows[0];

const updateById = async (id, data) => db.query(db.sql`update "User" $set${data} where userid=${id} returning *`);

module.exports = {
    selectOneByUsername,
    selectOneByID,
    updateById,
    register,
    authorize,
    logout,
}
 