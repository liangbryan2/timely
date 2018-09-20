var express = require("express");
var db = require("../models");
var router = express.Router();
var TVMaze = require('tvmaze');
var tvm = new TVMaze();

// // Game API
var hltb = require('howlongtobeat');
var hltbService = new hltb.HowLongToBeatService();

//Books API
var books = require('google-books-search');

// //Movie API
var omdbApi = require('omdb-client');
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

function convertTime(minutes) {
    var days;
    var hours;
    var minutes;
    var timeString;
    if (minutes >= 1440) {
        days = Math.floor(minutes / 1440);
        hours = Math.floor((minutes / 60) % 24);
        minutes = minutes % 60;
        timeString = days + "d " + hours + "h " + minutes + "m"
        return timeString
    } else {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        timeString = hours + "h " + minutes + "m"
        return timeString
    }

}


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
router.get("/login", function (req, res) {
    res.render("signin");
    return;
})
router.post("/login", function (req, res) {
    auth.signInWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
        console.log(error.code)
    });
    res.send("");
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
router.get("/dashboard/", function (req, res) {
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
        var movieMin = 0;
        var movieArr = [];
        if (result.Movies[0]) {
            for (var i = 0; i < result.Movies.length; i++) {
                movieMin += result.Movies[i].runtime

                var movie = {
                    id: result.Movies[i].id,
                    name: result.Movies[i].name,
                    imgUrl: result.Movies[i].imgUrl,
                    minutes: convertTime(result.Movies[i].runtime),
                    inProgress: result.Movies[i].UsersMovies.inProgress,
                    type: "movies"
                }
                movieArr.push(movie);
            }

        }
        var gameMin = 0;
        var gameArr = [];
        if (result.Games[0]) {
            for (var i = 0; i < result.Games.length; i++) {
                var addMin = parseInt(result.Games[i].mainMinutes)
                gameMin += addMin

                var game = {
                    id: result.Games[i].id,
                    name: result.Games[i].name,
                    imgUrl: result.Games[i].imgUrl,
                    minutes: convertTime(result.Games[i].minutes),
                    inProgress: result.Games[i].UsersGames.inProgress,
                    type: "games"
                }
                gameArr.push(game);
            }
        }

        var bookMin = 0;
        var bookArr = [];
        if (result.Books[0]) {
            for (var i = 0; i < result.Books.length; i++) {
                bookMin += result.Books[i].minutes

                var book = {
                    id: result.Books[i].id,
                    name: result.Books[i].name,
                    imgUrl: result.Books[i].imgUrl,
                    minutes: convertTime(result.Books[i].minutes),
                    inProgress: result.Books[i].UsersBooks.inProgress,
                    type: "shows"
                }
                bookArr.push(book);
            }

        }
        var showMin = 0;
        var showArr = [];
        if (result.Shows[0]) {
            for (var i = 0; i < result.Shows.length; i++) {
                showMin += result.Shows[i].minutes

                var show = {
                    id: result.Shows[i].id,
                    name: result.Shows[i].name,
                    imgUrl: result.Shows[i].imgUrl,
                    minutes: convertTime(result.Shows[i].minutes),
                    inProgress: result.Shows[i].UsersShows.inProgress,
                    type: "books"
                }
                showArr.push(show);

            }
        }
        var totalMin = gameMin + showMin + movieMin + bookMin;
        var backlogArr = [];
        var inProgressArr = [];
        for (var i = 0; i < 10; i++) {
            if (movieArr[i] && movieArr[i].inProgress === false) {
                backlogArr.push(movieArr[i]);
            } else if (movieArr[i]) {
                inProgressArr.push(movieArr[i])
            }
            if (gameArr[i] && gameArr[i].inProgress === false) {
                backlogArr.push(gameArr[i]);
            } else if (gameArr[i]) {
                inProgressArr.push(gameArr[i])
            }
            if (showArr[i] && showArr[i].inProgress === false) {
                backlogArr.push(showArr[i]);
            } else if (showArr[i]) {
                inProgressArr.push(showArr[i])
            }
            if (bookArr[i] && bookArr[i].inProgress === false) {
                backlogArr.push(bookArr[i]);
            } else if (bookArr[i]) {
                inProgressArr.push(bookArr[i])
            }
        }
        var object = {
            name: result.name,
            gameMin: gameMin,
            movieMin: movieMin,
            showMin: showMin,
            bookMin: bookMin,
            totalMin: totalMin,
            movies: movieArr,
            games: gameArr,
            books: bookArr,
            shows: showArr,
            backlog: backlogArr,
            inProgress: inProgressArr
        }
        res.render("dashboard", object);
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
    var conditional;
    var model;
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
    return [conditional, model]
}


// update game as complete
router.put("/api/:model/:mediaid/complete", function (req, res) {
    var array = modelSwitch(req.params.model, req.params.mediaid);
    var conditional = array[0];
    var model = array[1];
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
    var array = modelSwitch(req.params.model, req.params.mediaid);
    var conditional = array[0];
    var model = array[1];
    model.update({
        inProgress: true
    }, {
        where: conditional
    }).then(function (result) {
        res.json(result)
    })
});

// delete game from backlog
router.delete("/api/:model/:mediaid/delete", function (req, res) {
    var array = modelSwitch(req.params.model, req.params.mediaid);
    var conditional = array[0];
    var model = array[1];
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
    switch (modelName) {
        case "games":
            model = db.Games;
            conditional = {
                hltbID: body.hltbID
            }
            break;
        case "books":
            model = db.Books;
            conditional = {
                gBooksID: body.gBooksID
            }
            break;
        case "movies":
            model = db.Movies;
            conditional = {
                imdbID: body.imdbID
            }
            break;
        case "shows":
            model = db.Shows;
            conditional = {
                tvMazeID: body.tvMazeID
            }
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

// ==================
// ==================


// ==================
// ==================
module.exports = router;