'use strict'

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const Koa = require("koa");
const logger = require("koa-logger");
const session = require('koa-session');
const addRoutes = require("./routes");

const app = new Koa();

app.keys = ['test'];
const storeOptions = require('./db').storeOptions;

app.use(session({ maxAge: 600000, rolling: true, store: storeOptions }, app));

app.use(logger());
addRoutes(app);

app.listen(PORT, () => console.log("Server is up on port", PORT));