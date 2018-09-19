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

// userId is associated with currently logged in user
var userId;


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
    res.send("logged in");
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
    res.send("user created");
});

router.put("/logout", function (req, res) {
    auth.signOut();
    res.send("logged out");
})

firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        db.Users.findOne({
            where: {
                firebaseId: firebaseUser.uid
            }
        }).then(function (result) {
            if (!result) {
                newUser.firebaseId = firebaseUser.uid;
                db.Users.create(newUser).then(function (result) {
                    userId = result.id
                    console.log("new user userId = ", userId);
                    return;
                })
            } else {
                userId = result.id
                console.log("existing user userId = ", userId);
                return;
            }
        })
    } else {
        console.log("not logged in");
    }
})
//===================================================================================
// end
//===================================================================================


//===================================================================================
// display dashboard
//===================================================================================
router.get("/dashboard/:media?", function (req, res) {
    db.Users.findOne({
        where: {
            id: userId
        },
        include: [{
            model: db.Games
        }, {
            model: db.Movies
        }, {
            model: db.Books
        }, {
            model: db.Shows
        }]
    }).then(function (result) {
        // console.log(result);
        // res.render("dashboard", result)
        res.json(result);
        return;
    })
})
//===================================================================================
// end
//===================================================================================


//===================================================================================
// Updating media that's already associated with a user
//===================================================================================

// Switch case to see what type of media we are going to update
function modelSwitch(modelName, mediaId) {
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


// update game as complete
router.put("/api/:model/:mediaid/complete", function (req, res) {
    var conditional;
    var model;
    modelSwitch(req.params.model, req.params.mediaid);
    model.update({
        complete: true,
        inProgress: false
    }, {
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});

// update game as inProgress
router.put("/api/:model/:mediaid/progress", function (req, res) {
    var conditional;
    var model;
    modelSwitch(req.params.model, req.params.mediaid);
    model.update({
        inProgress: true
    }, {
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});

// delete game from backlog
router.delete("api/:model/:mediaid/delete", function (req, res) {
    var conditional;
    var model;
    modelSwitch(req.params.model, req.params.mediaid);
    model.destroy({
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
})
//===================================================================================
// end
//===================================================================================


//===================================================================================
// Add media to user and database
//===================================================================================

// Switch case function to see which media user is adding
function postModelSwitch(modelName, body) {
    var conditional;
    var model;
    switch(modelName) {
        case "games":
            model = db.Games;
            conditional = {hltbID: body.hltbID}
            break;
        case "books":
            model = db.Books;
            conditional = {gBooksID: body.gBooksID}
            break;
        case "movies":
            model = db.Movies;
            conditional = {imdbID: body.imdbID}
            break;
        case "shows":
            model = db.Shows;
            conditional = {tvMazeID: body.tvMazeID}
            break;
    }
    return [conditional, model]
}

router.post("/api/:model/add", function (req, res) {

    var array = postModelSwitch(req.params.model, req.body);
    var conditional = array[0];
    var model = array[1];

    model.findOne({
        where: conditional
    }).then(function (result) {
        if (result) {

            db.Users.findOne({
                where: {
                    id: userId
                }
            }).then(function (user) {
                result.setUsers([user]);
            });

        } else {

            model.create(req.body).then(function (media) {
                db.Users.findOne({
                    where: {
                        id: userId
                    }
                }).then(function (user) {
                    media.setUsers([user]);
                });
            })

        }
    })
    res.send("added model");
})
//===================================================================================
// end
//===================================================================================


module.exports = router;