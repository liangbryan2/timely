# Timely

## About
Timely is a time-focused media manager that allows media-centric consumers to 
efficiently allocate their time and achieve effective leisure. Users are able to 
search for video games, books, or movies/shows and add desired media to their 
backlog. We calculate the time of completion for the various media and display 
that information to the user. 


## Deployed Link
[Timely App](https://timely382.herokuapp.com/)

## Application Preview

### Signed-In Page
![Time.ly-SignIn](/screenShots/signIn)

### Search Page
![Time.ly-Search](/screenShots/searchPage)

### Search Results
![Time.ly-Search](/screenShots/searchResults)

### User Dashboard
![Time.ly-DashBoard](/screenShots/signIn)

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
2. Clone the Lyricly respository.
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

## code snippets
<!-- put snippets of code inside ``` ``` so it will look like code -->
<!-- if you want to put blockquotes use a > -->
<!------------Azzy--------------------------------->
```javascript


```
## Explanation of code

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
```javascript
    

```
## Explanation of code


<!----------------------------End Jason-------------------------------------------->

<!------------Kevin--------------------------------->
```javascript

```
## Explanation of code

<!----------------------------End Kevin-------------------------------------------->


## Learning points
<!-- Learning points where you would write what you thought was helpful -->
1. Cookies and user authentication
  * A server can send a cookie with a unique id to the client
  * Set up the server to only operate on items attached to the unique id stored on the cookie that the client sends back to the server
2. 
  * 
  * 
  * 
3. 

## Authors
<!-- make a link to the deployed site and have your name as the link -->
* [Azfar Haq](https://aehaq.github.io/Portfolio/)

* [Bryan Liang](https://liangbryan2.github.io/Portfolio/)

* [Jason P. Sutliff](https://jsutliff.github.io/Basic-Portfolio/)

* [Kevin Macaraeg](https://github.com/everysf)

## License
Standard MIT License
