require('dotenv').config();
require('./api/database/db');
const routes = require('./api/routes');

const express = require('express');

const app = express();

app.use("/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", routes);

const server = app.listen(process.env.PORT, () => {
    console.log(process.env.LISTEN_TO_PORT_MSG, server.address().port);
});
