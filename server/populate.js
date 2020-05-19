const db = require('./db')
const Taste = require('./models/taste')

async function f() {
    for (let i = 0; i < 10000; i++) {
        await db.query(`insert into "User"(username, password, email, gender, birthdate) values($1, $2, $3, $4, $5)`, [i, i, i, i, "2001-06-18"]);
        const randArr = Array(11).fill().map(() => Math.floor(Math.random() * 100));
        const taste = new Taste(...randArr).normalize();
        Taste.update(i, taste);
    }
}

module.exports = f;