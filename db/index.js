'use strict'

const { Pool } = require('pg');
const pool = new Pool({ database: "user_data" });

module.exports = {
    query: (text, params) => pool.query(text, params),
  }