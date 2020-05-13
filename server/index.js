'use strict'

const PORT = process.env.PORT || 3000;
const Koa = require("koa");
const logger = require("koa-logger");
const session = require('koa-session');
const addRoutes = require("./routes");

const app = new Koa();

app.keys = ['test'];
const storeOptions = require('./db').storeOptions;

app.use(session({ maxAge: 3600000, rolling: true, store: storeOptions, httpOnly: false, }, app));
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', process.env.CLIENT);
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    await next();
})

app.use(logger());
addRoutes(app);

app.listen(PORT, () => console.log("Server is up on port", PORT));