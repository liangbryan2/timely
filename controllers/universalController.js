var express = require("express");
var db = require("../models");

var router = express.Router();



//////// Posting media to user ////////

// post a game
router.post("/api/:userid/games/add", function (req, res) {

    // verify if entry is already in database
    var newEntry;
    db.Games.findOne({
        where: {
            hltbID: req.body.hltbID
        }
    }).then(function (result) {
        if (result) {
            newEntry = false;
        } else {
            newEntry = true;
        }
    })

    if (newEntry) {
        // Create game with association
        db.Games.create(req.body).then(function (game) {
            db.Users.findOne({
                where: {
                    id: req.params.userid
                }
            }).on('success', function (user) {
                game.setUsers([user]);
            });
        })

    } else {
        // Create association with game
        db.Games.findOne({
            where: {
                hltbID: req.body.hltbID
            }
        }).on('success', function (game) {
            db.Users.findOne({
                where: {
                    id: req.params.userid
                }
            }).on('success', function (user) {
                game.setUsers([user]);
            });
        });

    }
})

// post a book


// post a movie


// post a show



//////// Managing User Data Relations ////////

// modelSwitch 
function modelSwitch(modelName, userId, mediaId) {
    switch (modelName) {
        case "games":
            model = db.UsersGames;
            conditional = {
                GameId: mediaId,
                UserId: userId
            }
            break;
        case "books":
            model = db.UsersBooks;
            conditional = {
                BookId: mediaId,
                UserId: userId
            }
            break;
        case "movies":
            model = db.UsersMovies;
            conditional = {
                MovieId: mediaId,
                UserId: userId
            }
            break;
        case "shows":
            model = db.UsersShows;
            conditional = {
                ShowId: mediaId,
                UserId: userId
            }
            break;
    }
}

// update media item as complete
router.put("/api/:userid/:model/:mediaid/complete", function (req, res) {

    var conditional;
    var model;

    modelSwitch(req.params.model, req.params.userid, req.params.mediaid);

    model.update({
        complete: true,
        inProgress: false
    }, {
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});

// update media item as in progress
router.put("/api/:userid/:model/:mediaid/progress", function (req, res) {

    var conditional;
    var model;

    modelSwitch(req.params.model, req.params.userid, req.params.mediaid);

    model.update({
        inProgress: true
    }, {
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});

// remove media item from user's profile
router.delete("/api/:userid/:model/:mediaid/delete", function (req, res) {

    var conditional;
    var model;

    modelSwitch(req.params.model, req.params.userid, req.params.mediaid);

    model.destroy({
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});