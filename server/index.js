'use strict'

const PORT = process.env.PORT || 3000;
const Koa = require("koa");
const session = require('koa-session');
const routes = require("./routes");

const app = new Koa();

app.keys = ['test'];
const storeOptions = require('./db').storeOptions;

app.use(session({ maxAge: 3600000, rolling: true, store: storeOptions, httpOnly: false, }, app));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', process.env.CLIENT);
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    ctx.set('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
    await next();
})
if(process.env.NODE_ENV !== 'test'){
    const logger = require("koa-logger");
    app.use(logger());
}

routes.mountRoutes(app);

const newApp = routes.mountChat(app.listen(PORT, () => console.log("Server is up on port", PORT)));

module.exports = newApp;