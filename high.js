var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const mysql = require('mysql');  
const port = 3003;

app
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(express.json({ extended: false }))
    .use(express.urlencoded({extended: true}))
    .use("/highdb", require("./routes/api"))
    .listen(port, () => {console.log('Express is listening on port', port);})