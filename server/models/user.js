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

    static async getProfileInfo(username){
        const profile = (await db.query(db.sql`
        select username, displayname, email, bio, gender, city, profilephotos, birthdate, preference
        from "User"
        where username=${username}`)).rows[0];
        profile['taste'] = (await db.query(db.sql`
        select classical, rock, pop, "r&b", "hip hop", country, jazz, electronic, latin, folk, blues
        from "Taste"
        where username=${profile.username}
        `)).rows[0];
        return profile;
    }

    static async getClosestMatches(username, genresAndRange, dateAgeFrom, dateAgeTo, preference){
        const preferenceQuery = preference === "anyone" ? "" : preference === "men" ? "gender <> 'female'" : "gender <> 'male'";
        const matches = (await db.query(db.sql`
        select "User".username, displayname, profilephotos, bio, city
        from "Taste"
        join "User"
        on "User".username = "Taste".username
        where 
        $raw${genresAndRange[0]} between ${genresAndRange[1]} and ${genresAndRange[2]} and
        $raw${genresAndRange[3]} between ${genresAndRange[4]} and ${genresAndRange[5]} and
        $raw${genresAndRange[6]} between ${genresAndRange[7]} and ${genresAndRange[8]} and
        $raw${preferenceQuery} and
        "User".username not in (
            select match
            from "Match"
            where username = ${username}
        ) and
        "User".username <> ${username}
        order by $raw${genresAndRange[0]}, $raw${genresAndRange[3]}, $raw${genresAndRange[6]} desc`)).rows;
        return matches;
    }

    static async getMatches(username) {
        const matches = (await db.query(db.sql`
        select "Match".match 
        from "Match"
        join "Match" M
        on
        "Match".username = M.match and
        "Match".match = M.username
        where "Match".username = ${username}
        `)).rows;
        return matches;
    }

    static async addMatch(username, match) {
        const isAMatch = (await db.query(`
        select *
        from "Match"
        where 
        username = $1 and 
        match = $2`, [match, username])).rowCount > 0;
        db.query(`
        insert into 
        "Match"(username, match) 
        values ($1, $2)`, [username, match]);
        return isAMatch;
    }

}

module.exports = User;
 