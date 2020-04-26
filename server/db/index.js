'use strict'

const { Pool } = require('pg');
const sql = require('sql-template');
const pool = new Pool();

const setSession = async (key, sess, maxAge) => {
  await pool.query(`
  insert into session(sessionid, maxage, session) values($1, $2, $3) 
  on conflict (sessionid) do
  update set maxage=$2, session=$3`, [key, maxAge, sess]);
}

const getSession = async key => (await pool.query(`select * from session where "sessionid"=$1`, [key])).rows[0].session;

const destroySession = async key => await pool.query(`delete from session where "sessionid"=$1`, [key]);

module.exports = {
    query: (text, params) => pool.query(text, params),
    sql,
    storeOptions: {
      get: getSession,
      set: setSession,
      destroy: destroySession,
    },
  }