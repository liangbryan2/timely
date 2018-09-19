// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyBrbP1WCO-E8ep4MKJZ9elEygpMHSomzck",
//     authDomain: "timely-a38bb.firebaseapp.com",
//     databaseURL: "https://timely-a38bb.firebaseio.com",
//     projectId: "timely-a38bb",
//     storageBucket: "timely-a38bb.appspot.com",
//     messagingSenderId: "695316003795"
// };
// firebase.initializeApp(config);

// var auth = firebase.auth();
// $(document).ready(function () {

//     $("#logIn").on("click", function (e) {

//         e.preventDefault();
//         firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
//             var email = $("#email").val().trim();
//             var password = $("#password").val().trim();
//             auth.signInWithEmailAndPassword(email, password).catch(function (error) {
//                 console.log(error.code);
//             })
//         })
//     });

//     $("#signUp").on("click", function (e) {
//         e.preventDefault();
//         firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {
//             var email = $("#email").val().trim();
//             var password = $("#password").val().trim();
//             auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
//                 console.log(error.code);
//             })
//         })
//     });

//     $("#logOut").on("click", function (e) {
//         auth.signOut();
//         $("#logOut").addClass('hide');
//         $(".hideMe").removeClass('hide');
//         $('#currentUser').addClass('hide');

//     })
//     auth.onAuthStateChanged(function (firebaseUser) {
//         if (firebaseUser) {
//             console.log(firebaseUser);
//             // var uid = firebaseUser.uid;
//             // var newUser = {
//             //     userName: $("#")
//             // }
//             // $.ajax("/api/users/" + uid, {
//             //     type: "POST",
//             //     data: newUser
//             // }).then(function () {
//             //     console.log("new user");
//             // })
//         } else {
//             console.log("not logged in");
//         }
//     })
// })