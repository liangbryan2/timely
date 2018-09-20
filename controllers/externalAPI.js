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
var omdb = require("omdb");
const MovieDb = require('moviedb-promise')
const moviedb = new MovieDb('91433a6303c384292937cb016af9c4cd');

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

// router.get("/movies/:query", function (req, res) {

//   moviedb.searchMovie({
//     query: req.params.query
//   }).then(result => {
//     res.json(result)
//   }).catch(console.error)
// })

// var loopLength;
// if (data.length <= 10) {
//   loopLength = data.length;
// } else if (data.length > 10) {
//   loopLength = 10;
// }
//   var object = {}
//   var array = [];
//   for (var i = 0; i < loopLength; i++) {
//     var totalMin = parseInt(data[i].Runtime);
//     var movieObj = {
//       name: data[i].title,
//       lengthAttr1: data[i].pageCount,
//       lengthAttr2: '',
//       imgUrl: data[i].thumbnail,
//       apiId: data[i].id,
//       time: totalMin,
//       type: "movies"
//     }
//     array.push(movieObj);
//   }
//   object.items = array;

// res.render("searchresults", object);

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
      ids.push(results[i]);                              
    }
    for (var i = 0; i < )
  })
})


// ==========================================================
// end
// ==========================================================



// =============== md-movie-utils ==============================



let movieDBClients = require('md-movie-utils').clients;
let omdbClient = movieDBClients.OMDBClient.getInstance('trilogy');




var response = {
  success: function (res) {
    return function (movie) {
      if (movie) {
        return res.status(200).json(movie);
      } else {
        return res.status(404);
      }
    };
  },
  failure: function (res) {
    return function (err) {
      return res.status(500).json({
        message: err.message
      });
    }
  }
};

app.get("/movies/:query", function (req, res) {
  omdbClient.search({query: req.params.query})
    .then(response.success(res), response.failure(res));
});




// http: //localhost:3000/omdb/search?q=Batman
// req.query.q = batman
// /omdb/movie/getByTitleAndYear?title=Saw&year=2004




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
    key: "AIzaSyAgrzMs1uWe7UxhyOHG1lH0u7at5J8C-ic",
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
        var bookObj = {
          name: result[i].title,
          lengthAttr1: result[i].pageCount,
          lengthAttr2: '',
          imgUrl: result[i].thumbnail,
          apiId: result[i].id,
          time: totalMin,
          type: "books"
        };
        array.push(bookObj);
      }
      object.items = array;
    } else {
      console.log(error)
    }
    res.render("searchresults", object);
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

module.exports = router;