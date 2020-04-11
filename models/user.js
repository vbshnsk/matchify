'use strict'

const db = require('../db');
const bcrypt = require('bcrypt');

const usernameMatcher =  /^[a-z0-9_-]{3,16}$/;
const passwordMatcher = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
const emailMatcher = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const dateMatcher = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

const hashPassword = password => {
    const salt = 10;
    const hash = bcrypt.hash(password, salt);
    return hash;
}

const validate = async data => {
    if (usernameMatcher.test(data.username) &&
        passwordMatcher.test(data.password) &&
        emailMatcher.test(data.email) &&
        dateMatcher.test(data.birthdate)) {
            return [data.username, await hashPassword(data.password), data.email, data.birthdate];
    }
    else {
        throw new Error("Registration Error");
    };
}

module.exports = {
    insertUser: async userData => db.query('insert into "User"("Username", "Password", "Email", "BirthDate") values($1, $2, $3, $4)', await validate(userData)),
}
