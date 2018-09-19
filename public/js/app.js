$(document).ready(function () {


    $("#signUp").on("click", function () {
        var newUser = {
            userName: $("#userName").val().trim(),
            name: $("#name").val().trim(),
            imgUrl: $("#imgUrl").val().trim(),
            email: $("#email").val().trim(),
            password: $("#password").val().trim()
        };
        $.ajax("/signup", {
            type: "POST",
            data: newUser
        }).then(function (result) {
            console.log(result);
        })
    })


    $("#logIn").on("click", function() {
        var user = {
            email: $("#email").val().trim(),
            password: $("#password").val().trim()
        }
        $.ajax("/login", {
            type: "POST",
            data: user
        }).then(function (result) {
            console.log(result);
        })
    })

    $("#logOut").on("click", function() {
        $.ajax("/logout", {
            type: "PUT"
        }).then(function(result) {
            console.log(result);
        })
    })



})