'use strict'

const { Pool } = require('pg');
const pool = new Pool({ database: "user_data" });

const setSession = async (key, sess, maxAge, { rolling, changed }) => {
  console.log(rolling, changed)
  if (changed) {
    pool.query(
      `insert into 
      sessions("SessionID", "SessionData") 
      values($1, $2)`, [key, sess]);
  }
  else if (rolling) {
    pool.query(
      `update 
      sessions
      set "SessionData"=$2
      where "SessionID"=$1`, [key, sess]);
  }
}

const getSession = async (key, maxAge, { rolling }) => (await pool.query(`select * from sessions where "SessionID"=$1`, [key])).rows[0]["SessionData"];

const destroySession = async key => pool.query(`delete from sessions where "SessionID"=$1`, [key]);

module.exports = {
    query: (text, params) => pool.query(text, params),
    storeOptions: {
      get: getSession,
      set: setSession,
      destroy: destroySession,
    },
  }