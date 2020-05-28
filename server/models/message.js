const db = require('../db')

class Message {
    static async getChat(first, second){
        return (await db.query(db.sql`
            select * from "Message"
            where 
            (sender=${first} and receiver=${second}) or
            (sender=${second} and receiver=${first})
            order by senton desc
        `)).rows;
    }

    static async insert(message, sender, receiver){
        const senton = new Date();
        return (await db.query(db.sql`
            insert into "Message"(message, sender, receiver, senton)
            $values${ { message, sender, receiver, senton } } 
            returning *`)).rows[0];
    }
}

module.exports = Message;