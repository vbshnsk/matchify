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

const authorize = () => {
    return async function(ctx, next) {
        const data = ctx.request.body;
        const user = await selectOneByUsername(data.username);
        if (user === undefined) { throw new Error("Authorization Error"); }
        const passwordValidation = await bcrypt.compare(data.password, user.Password);
        if (!passwordValidation) { throw new Error("Authorization Error"); }

        ctx.session.userid = user.UserID;
        
        await next()
    }
}

const validate = async data => {
    if (usernameMatcher.test(data.username) &&
        passwordMatcher.test(data.password) &&
        dateMatcher.test(data.birthdate)) {
            return [data.username, await hashPassword(data.password), data.email, data.birthdate];
    }
    else {
        throw new Error("Registration Error");
    }
}

const selectOneByID = async userid => (db.query('select * from "User" where "UserID"=$1', [userid])).rows[0];

const selectOneByUsername = async username => (await db.query('select * from "User" where "Username"=$1', [username])).rows[0];

const insertUser = async userData => db.query('insert into "User"("Username", "Password", "Email", "BirthDate") values($1, $2, $3, $4) returning *', await validate(userData));

module.exports = {
    insertUser,
    selectOneByUsername,
    selectOneByID,
    authorize,
}
