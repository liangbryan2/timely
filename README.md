# Timely

## About
Timely is a time-focused media manager that allows media-centric consumers to 
efficiently allocate their time and achieve effective leisure. Users are able to 
search for video games, books, or movies/shows and add desired media to their 
backlog. We calculate the time of completion for the various media and display 
that information to the user. 


## Deployed Link
[Timely App](https://timelymanager.herokuapp.com/)

## Application Preview

### Sign-Up Page
![Time.ly-SignIn](https://raw.githubusercontent.com/liangbryan2/timely/readme/public/img/signup.PNG)

### Search Page
![Time.ly-Search](https://raw.githubusercontent.com/liangbryan2/timely/readme/public/img/search.png)

### Search Results
![Time.ly-Search](https://raw.githubusercontent.com/liangbryan2/timely/readme/public/img/searchresults.png)

### User Dashboard
![Time.ly-DashBoard](https://raw.githubusercontent.com/liangbryan2/timely/readme/public/img/fullpage.png)

## Technologies used
1. HTML5
2. CSS3/Chart.js
3. jQuery
4. Node.js
5. Express.js
6. Sequelize with MySQL
7. Firebase Authenticator 

## Node Packages used
1. express
    * usage
    ```require("express")```
    * It is a fast, unopinionated, minimalist web framework for node.
    * For more information: [express](https://expressjs.com)

2. mySql
    * usage
    ```require("mysql")```
    * A node package that is used to connect to mysql server allowing queries on database tables; It also makes CRUD(Create, Read, Update, Delete) operations possible.
    * For more information: [mysql](https://www.npmjs.com/package/mysql)

3. body-parser
    * usage
    ```require("body-parser")```
    * Body parser is middleware that parses incoming request bodies
    * For more information: [body-parser](https://www.npmjs.com/package/body-parser)

4. sequelize
    * usage
    ```sequelize init:config```
    ```sequelize init:models```
    * It is a promise-based ORM for Node.js. This provides the configuration for 
    connecting to the database and interacting with models.
    * For more infromation: [sequelize](http://docs.sequelizejs.com)

## Execution steps on local machine
1. Install Node.js [Node Installation](http://blog.teamtreehouse.com/install-node-js-npm-mac) for instructions.
2. Clone the Timely respository.
3. In terminal, navigate to the timely folder and type npm install. This will 
install all the dependencies required to run the application contained in package.json.
4. Install/run mySql on the local/host server. 
5. Log into mysql workbench and run db/schema.sql from the repository. This will 
create the database on the server.
6. Open config.json and change development.user, development.password with your values.
7. Inside the Timely folder in terminal, type "node server.js" in terminal. This 
will start the server.
8. Open the browser and type "localhost:3006" in the address bar. This will initialize the 
client side of the application.

## Designing as a Team

We divided up the contributions to allow each of us to specialize in our technical fields. We played to our strengths and made the most of each other's talents. In the end, the whole became greater than the sum of its parts.

## Design Softwares

We used a combination of the following dor designing and editing the graphics, mockups, and layouts of the site:

- Adobe Illustrator
- Adobe InDesign
- Adobe Photoshop
- Sketch App

## Design Reflection

As a team, we worked very well together and created a product that was authentic to our interests from ideation to submission.

## Database Management via Sequelize
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->
<!------------Azzy--------------------------------->
```javascript
function modelSwitch(modelName, mediaId, userId) {

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
            // etc...
            // (Not pictured: Switch Case continues for each model)
    }
    return [conditional, model]
}

router.put("/api/:model/:mediaid/complete", function (req, res) {

   // ...
   // (Not pictured: Prepping data for insertion, including calling the above function)
   
   model.update({
            complete: true,
            inProgress: false
        }, {
            where: conditional
        }).then(function (result) {
            res.json(result)
        })
     //...
});
```
### Explanation of code
Alongside the Users model we used sequelize to creat a unique model for each type of media. The relationship between the users models and any given media model was 'many to many', meaning we needed to create models for relational tables to store userspecific data regarding specific media. These tables used names such as: "UsersGames", "UsersBooks", and so on.

As a result, our model count ended up rather large. So, in order to ensure this would not bloat our codebase for API routes, we opted to write dynamic routes that would call upon a switch case to ensure that a single call could remain flexible enough to handle more than a single generic object-format, allowing for us to pass in unique data appropriate to the media type.

<!----------------------------End Azzy-------------------------------------------->

<!------------Bryan--------------------------------->
## User Authentication
```javascript
router.post("/signup", function (req, res) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function () {
            return firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        })
        .then((user) => {
            let uid = user.user.uid;
            res.cookie('test', {
                uid: uid
            }, {
                httpOnly: false
            });
            var newUser = {
                userName: req.body.userName,
                name: req.body.name,
                firebaseId: uid
            }
            db.Users.create(newUser).then(function (result) {
                res.send('good');
            })
            return firebase.auth().signOut();
        })
        .catch((err) => {
            res.send(err.code);
        });
});

```
### Explanation of code
Here we have the server side code for user authentication. The client side sends a post call with the log in information and the server takes that information and creates a new user. The server then sends back a cookie with express-session. This allows us to access the currently logged in user.
<!----------------------------End Bryan-------------------------------------------->

<!------------Jason--------------------------------->
## External API Calls
```javascript
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


```
## Explanation of code
This code snipet makes a request to HLTB servers for information about a given video game. 
We create a game object to store the required information that we will use to
format our output to the user. 

<!----------------------------End Jason-------------------------------------------->

<!------------Kevin--------------------------------->


<!----------------------------End Kevin-------------------------------------------->


## Learning points
<!-- Learning points where you would write what you thought was helpful -->
1. Cookies and user authentication
  * A server can send a cookie with a unique id to the client
  * Set up the server to only operate on items attached to the unique id stored on the cookie that the client sends back to the server
2. Database Management
  * Using relational tables to handle user-specific data when a Many-To-Many relationship is involved.
  * Using Switch Cases in conjunction with variable routing to handle working with multiple SQL models at one time.
3. NPM Packages
  * Not all NPM packages are created equally. It is important to do your research 
  and test the response values. 

## Authors
<!-- make a link to the deployed site and have your name as the link -->
* [Azfar Haq](https://aehaq.github.io/Portfolio/)

* [Bryan Liang](https://liangbryan2.github.io/Portfolio/)

* [Jason P. Sutliff](https://jsutliff.github.io/Basic-Portfolio/)

* [Kevin Macaraeg](https://github.com/everysf)

## License
Standard MIT License
