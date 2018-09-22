require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
var app = express();
var PORT = process.env.PORT || 3006;
var session = require('express-session');
var db = require("./models");
var exphbs = require("express-handlebars");
var routes = require("./controllers/controller.js")
var external = require("./controllers/externalAPI.js")

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'baba',
    cookie: {
        path: '/',
        domain: 'localhost:3006',
        resave: false,
        saveUninitialized: false
    }
}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars");

app.use("/", routes);
app.use("/search/", external);

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("Server listening on : http://localhost:" + PORT);
    })
})