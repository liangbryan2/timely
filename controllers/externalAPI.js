// Dependencies
// ============================================================
require('dotenv').config();
var express = require("express");
var db = require("../models");

var router = express.Router();

//TV API
var TVMaze = require('tvmaze');
var tvm = new TVMaze();

// // Game API
var hltb = require('howlongtobeat');
var hltbService = new hltb.HowLongToBeatService();

//Books API
var books = require('google-books-search');

// //Movie API
var omdbApi = require('omdb-client');
var omdb = require("omdb");
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb(process.env.MOVIEDB_API);

// ======================================================
// general search
// ======================================================
router.get("/", function (req, res) {
  res.render("search");
})
// ======================================================
// search for games
// ======================================================



// ======================================================
// search for games
// ======================================================
router.get("/games/:query", function (req, res) {
  var query = req.params.query;
  hltbService.search(query).then(function (result) {
    var object = {};
    var array = [];
    if (result.length) {
      var loopLength;
      if (result.length <= 10) {
        loopLength = result.length;
      } else if (result.length > 10) {
        loopLength = 10;
      }
      for (var i = 0; i < loopLength; i++) {
        var totalMin = result[i].gameplayMain * 60;
        var gameObj = {
          name: result[i].name,
          imgUrl: result[i].imageUrl,
          lengthAttr1: result[i].gameplayMain,
          lengthAttr2: result[i].gameplayCompletionist,
          apiId: result[i].id,
          time: totalMin,
          type: "games"
        }
        array.push(gameObj);
      }
      object.items = array;
    }
    res.render("searchResults", object);
    return;
  });
})

// ======================================================
// end
// ======================================================


// ======================================================
// search for movies
// ======================================================
router.get("/movies/:query", function (req, res) {
  moviedb.searchMovie({
    query: req.params.query
  }).then(function (data) {
    var results = data.results;
    var loopLength;
    if (results.length <= 10) {
      loopLength = results.length;
    } else if (results.length > 10) {
      loopLength = 10;
    }
    var ids = [];
    for (var i = 0; i < loopLength; i++) {
      ids.push(results[i].id);
    }
    var array = [];
    var object = {};
    for (var i = 0; i < ids.length; i++) {
      moviedb.movieInfo({
        id: ids[i]
      }).then(function (movie) {
        var convertedTime = convertTime(movie.runtime);
        var movieObj = {
          name: movie.original_title,
          lengthAttr1: movie.runtime,
          lengthAttr2: '',
          apiId: movie.id,
          time: movie.runtime,
          type: "movies",
          displayTime: convertedTime,
          imgUrl: "http://image.tmdb.org/t/p/w500/" + movie.poster_path
        };
        array.push(movieObj);
        object.items = array;
        if (object.items.length === loopLength) {
          res.render("searchResults", object);
          return;
        }
      }).catch(console.error)
    }
  }).catch(console.error)
})


// ======================================================
// end
// ======================================================




//===========================================================
// tv shows
// ==========================================================
router.get("/shows/:query", function (req, res) {
  moviedb.searchTv({
    query: req.params.query
  }).then(function (data) {
    var results = data.results;
    var loopLength;
    if (results.length <= 10) {
      loopLength = results.length;
    } else if (results.length > 10) {
      loopLength = 10;
    }
    var ids = [];
    for (var i = 0; i < loopLength; i++) {
      ids.push(results[i].id);
    }
    var array = [];
    var object = {};
    for (var i = 0; i < ids.length; i++) {
      moviedb.tvInfo({
        id: ids[i]
      }).then(function (show) {
        var totalMin = parseInt(show.number_of_episodes) * parseInt(show.episode_run_time);
        var convertedTime = convertTime(totalMin);
        var showObj = {
          name: show.name,
          lengthAttr1: show.number_of_episodes,
          lengthAttr2: show.episode_run_time,
          apiId: show.id,
          time: totalMin,
          type: "shows",
          displayTime: convertedTime,
          imgUrl: "http://image.tmdb.org/t/p/w500/" + show.poster_path
        };
        array.push(showObj);
        object.items = array;
        if (object.items.length === loopLength) {
          res.render("searchResults", object)
          return;
        }
      }).catch(console.error)
    }
  }).catch(console.error)
})


// ==========================================================
// end
// ==========================================================



// ======================================================
// end
// ======================================================


// =====================================


// var resultsArr = [];

// function whatever(array, res) {
//   var handlebarsObject = {
//     items: array
//   }
//   res.render("searchResults", handlebarsObject);
//   return;
// }
// router.post("/search/shows/:query", function(req, res) {
//   var param = req.params.query;
//   resultsArr = [];
//   tvm.findShow(param).then(function(shows) {

//     var loopLength;
//     if (shows.length <= 10) {
//       loopLength = shows.length;
//     } else if (shows.length > 10) {
//       loopLength = 10;
//     }

//     for (var i = 0; i < loopLength; i++) {
//       var resp = shows[i].show.id;
//       // console.log('Hey this is response: ', shows)
//       tvm.getShow(resp, ['episodes']).then( function (result) {
//         // console.log(result['_embedded'].episodes);
//         var totalMin = result.runtime * result['_embedded'].episodes.length;
//         var showObj = {
//           name: result.name,
//           lengthAttr1: result['_embedded'].episodes.length,
//           lengthAttr2: result.runtime,
//           apiId: result.id,
//           time: totalMin,
//           type: "shows"
//         };
//         if (result.image) {
//           showObj.imgUrl = result.image.original;
//         } else {
//           showObj.imgUrl = 'No image';
//         }
//         resultsArr.push(showObj);
//       });
//     }
//   });
//   return whatever(resultsArr, res);
// })


// router.post("/search/games/:query", function(req, res) {
//   var param = req.params.query;
//   resultsArr = [];

//   hltbService.search(param).then(function (result){

//     var loopLength;
//     if (result.length <= 10) {
//       loopLength = result.length;
//     } else if (shows.length > 10) {
//       loopLength = 10;
//     }

//     for (let i = 0; i < loopLength; i++) {
//       var totalMin = result[i].gameplayMain * 60;
//         var gameObj = {
//         name: result[i].name,
//         imgUrl: result[i].imageUrl,
//         lengthAttr1: result[i].gameplayMain,
//         lengthAttr2: result[i].gameplayCompletionist,
//         apiId: result[i].id,
//         time: totalMin,
//         type: "games"
//       };
//       resultsArr.push(gameObj);
//     }
//   });
//   return whatever(resultsArr);
// })

router.get("/books/:query", function (req, res) {

  var param = req.params.query;
  var options = {
    key: process.env.GOOGLEBOOKS_API,
    field: 'title',
    offset: 0,
    limit: 10,
    type: 'books',
    order: 'relevance',
    lang: 'en'
  }

  books.search(param, options, function (error, result) {
    if (!error) {

      var object = {};
      var array = [];

      if (result.length) {

        var loopLength;
        if (result.length <= 10) {
          loopLength = result.length;
        } else if (result.length > 10) {
          loopLength = 10;
        }

      }

      for (let i = 0; i < loopLength; i++) {

        var totalMin = result[i].pageCount * 2;
        var convertedTime = convertTime(totalMin)
        var bookObj = {
          name: result[i].title,
          lengthAttr1: result[i].pageCount,
          lengthAttr2: '',
          imgUrl: result[i].thumbnail,
          apiId: result[i].id,
          time: totalMin,
          type: "books",
          displayTime: convertedTime
        };
        array.push(bookObj);
      }
      object.items = array;
    } else {
      console.log(error)
    }
    res.render("searchResults", object);
    return;
  })
})

// router.post("/search/books/:query", function(req, res) {
//   var param = req.params.query;
//   resultsArr = [];

//   var options = {
//     key: "AIzaSyAgrzMs1uWe7UxhyOHG1lH0u7at5J8C-ic",
//     field: 'title',
//     offset: 0,
//     limit: 10,
//     type: 'books',
//     order: 'relevance',
//     lang: 'en'
//   };

//   books.search(param, options, function(error, result) {
//     if ( ! error ) {
//       var loopLength;
//       if (result.length <= 10) {
//         loopLength = result.length;
//       } else if (shows.length > 10) {
//         loopLength = 10;
//       }

//       for (let i = 0; i < loopLength; i++) {
//         var totalMin = result[i].pageCount * 2;
//           var bookObj = {
//             name: result[i].title,
//             lengthAttr1: result[i].pageCount,
//             lengthAttr2: '',
//             imgUrl: result[i].thumbnail,
//             apiId: result[i].id,
//             time: totalMin,
//             type: "books"
//         };
//         resultsArr.push(bookObj);
//       }
//     } else {
//         console.log(error);
//     }
// })
// return whatever(resultsArr);
// })

// router.post("/search/movies/:query", function(req, res) {
//   resultsArr = [];

//   var params = {
//     apiKey: 'trilogy',
//     title: req.params.query
//   }

//   omdbApi.get(params, function(err, data) {
//       var loopLength;
//       if (result.length <= 10) {
//         loopLength = result.length;
//       } else if (shows.length > 10) {
//         loopLength = 10;
//       }

//       for (let i = 0; i < loopLength; i++) {
//         var totalMin = parseInt(result[i].Runtime);
//           var movieObj = {
//             name: result[i].title,
//             lengthAttr1: result[i].pageCount,
//             lengthAttr2: '',
//             imgUrl: result[i].thumbnail,
//             apiId: result[i].id,
//             time: totalMin,
//             type: "movies"
//         };
//         resultsArr.push(movieObj);
//       }
//   })
//   return whatever(resultsArr);
// })

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

module.exports = router;