'use strict'

const bcrypt = require('bcrypt');
const User = require('../models/user')

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

/**
* Authorization middleware.
*/ 

const authorize = () => {
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
        ctx.session.userid = undefined;
    	ctx.session.authorized = false;
        await next();
    }
}

module.exports = {
    authorize,
    register,
    logout
}