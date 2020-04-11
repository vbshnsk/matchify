'use strict'

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const Koa = require("koa");
const Logger = require("koa-logger");
const addRoutes = require("./routes");

const app = new Koa();

app.use(Logger());
addRoutes(app);

app.listen(PORT, () => console.log("Server is up on port", PORT));