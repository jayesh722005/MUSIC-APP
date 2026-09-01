const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const authroute = require("./route/auth.route.js");
const musicroute = require("./route/music.routs.js");

const app = express();
require('dotenv').config();

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());

app.use('/api/auth', authroute);
app.use('/api/music', musicroute);

module.exports = app;