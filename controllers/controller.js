var express = require("express");
var db = require("../models");
var router = express.Router();

// Initialize Firebase
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyBrbP1WCO-E8ep4MKJZ9elEygpMHSomzck",
    authDomain: "timely-a38bb.firebaseapp.com",
    databaseURL: "https://timely-a38bb.firebaseio.com",
    projectId: "timely-a38bb",
    storageBucket: "timely-a38bb.appspot.com",
    messagingSenderId: "695316003795"
};
firebase.initializeApp(config);

var auth = firebase.auth();

// Landing page
router.get("/", function (req, res) {
    res.render("index");
})

//===================================================================================
// User creation / login / authentication
//===================================================================================

router.post("/api/users", function (req, res) {
    db.Users.create(req.body).then(function (result) {
        res.json(result);
    })
})

router.post("/login", function (req, res) {
    auth.signInWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
        console.log(error.code)
    });
})

var newUser;
router.post("/signup", function (req, res) {
    auth.createUserWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
        console.log(error.code);
    })
    newUser = {
        userName: req.body.userName,
        name: req.body.name,
        imgUrl: req.body.imgUrl
    }
});

router.post("/logout", function (req, res) {
    auth.signOut();
    // res.send("logged out");
})

firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        db.Users.findOne({
            where: {
                firebaseId: firebaseUser.uid
            }
        }).then(function(result) {
            if (result.length === 0) {
                newUser.firebaseId = firebaseUser.uid;
                db.Users.create(newUser)
            }
            console.log(result.dataValues);
        })
    } else {
        console.log("not logged in");
    }
})
//===================================================================================
// end
//===================================================================================

// create game entry and attach to user
router.post("/api/games", function (req, res) {
    db.Games.create(req.body)
        .then(function (result) {
            res.json(result);
        })
})
/*  var game = {
    name: name,
    mainLength: mainLength,
    completionistLength: completionistionLEngth,
    imgUrl: imgUrl
 } 

 $.ajax("/api/games", {
    type: "POST",
    data: game
}).then(function () {
    console.log("added new game");
    location.reload();
})
 
 */


// read api search for games
// router.get

// read game details display (reviews) later

// read display dashboard
router.get("/dashboard/:userid", function (req, res) {
    db.Users.findAll({
        where: {
            firebaseId: req.params.userid
        },
        include: [{
            model: db.Games
        }]
    }).then(function (result) {
        console.log(result);
        res.render("dashboard", result)
    })
})

// update game as complete
router.put("/api/:userid/games/:gameid/complete", function (req, res) {
    db.UsersGames.update({
        complete: true,
        inProgress: false
    }, {
        where: {
            GameId: req.params.gameid,
            UserId: req.params.userid
        }
    }).then(function (result) {
        res.json(result)
    })
});

// update game as inProgress
router.put("/api/:userid/games/:gameid/progress", function (req, res) {
    db.UsersGames.update({
        inProgress: true
    }, {
        where: {
            GameId: req.params.gameid,
            UserId: req.params.userid
        }
    }).then(function (result) {
        res.json(result)
    })
});

// delete game from backlog
router.delete("api/:userid/games/:gameid/delete", function (req, res) {
    db.UsersGames.destroy({
        where: {
            GameID: req.params.gameid,
            UserId: req.params.userid
        }
    }).then(function (result) {
        res.json(result)
    })
})

module.exports = router;