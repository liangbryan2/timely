// Dependencies
// ============================================================

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
    res.render("searchresults", object);
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
  var query = req.params.query;
  var params = {
    apiKey: 'trilogy',
    title: query
  }
  omdbApi.get(params, function (err, data) {
    if (err) {
      res.status(500);
    } else {
      if (data.length) {
        var loopLength;
        if (data.length <= 10) {
          loopLength = data.length;
        } else if (data.length > 10) {
          loopLength = 10;
        }
        var object = {}
        var array = [];
        for (var i = 0; i < loopLength; i++) {
          var totalMin = parseInt(result[i].Runtime);
          var movieObj = {
            name: data[i].title,
            lengthAttr1: data[i].pageCount,
            lengthAttr2: '',
            imgUrl: data[i].thumbnail,
            apiId: data[i].id,
            time: totalMin,
            type: "movies"
          }
          array.push(movieObj);
        }
        object.items = array;
      }
      
      res.send("test");
      // res.render("searchresults", object);
      return;
    }
  })
})

// ======================================================
// end
// ======================================================

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

module.exports = router;