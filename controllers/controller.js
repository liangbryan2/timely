var express = require("express");
var db = require("../models");

var router = express.Router();


router.get("/", function (req, res) {
    res.render("index");
})

// create user
// router.post("/api/users/:id", function (req, res) {
//     db.User.create({

//     })
// })

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
router.get("/dashboard/:id", function (req, res) {
    db.User.findAll({
        where: {
            firebaseId: req.params.id
        },
        include: [{
            model: db.Games
        }]
    }).then(function (result) {
        res.render("dashboard", result)
    })
})

// update game as complete
router.put("/api/games/:gameid/:userid", function (req, res) {
    db.UsersGames.update(
        req.body, {
            where: {
                GameId: req.params.gameid,
                UserId: req.params.userid 
            }
        }
    )
})

// update game as inProgress

// delete game from backlog

module.exports = router;