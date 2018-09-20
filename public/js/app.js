$(document).ready(function () {


    $("#signUp").on("click", function () {
        var newUser = {
            userName: $("#username").val().trim(),
            name: $("#name").val().trim(),
            email: $("#email").val().trim(),
            password: $("#password").val().trim()
        };
        $.ajax("/signup", {
            type: "POST",
            data: newUser
        }).then(function (result) {
            if (result) {
                setTimeout(function () {
                    window.location = "/dashboard"
                }, 1500);
            }
        })
    })

    $("#signIn").on("click", function () {
        console.log("test");
        $.ajax("/login", {
            type: "GET"
        }).then(function (result) {
            window.location.replace("/login");
        })
    })

    $("#returningSignIn").on("click", function () {
        var user = {
            email: $("#email").val().trim(),
            password: $("#password").val().trim()
        }
        $.ajax("/login", {
            type: "POST",
            data: user
        }).then(function (result) {
            console.log("front end result", result);
            if (result) {
                setTimeout(function () {
                    window.location = "/dashboard"
                }, 1500);
            }
        })
    })

    $("#logOut").on("click", function () {
        $.ajax("/logout", {
            type: "PUT"
        }).then(function (result) {
            console.log(result);
        })
    })



})