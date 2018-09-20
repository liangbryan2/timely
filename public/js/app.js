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


                if (result === "auth/invalid-email") {
                    $(".modalError").css("display", "flex");
                } else {
                    $(".landingWrap").css("animation", "1s fadeOut forwards")
                    setTimeout(function () {
                        window.location = "/search"
                    }, 500);
                }
            } 
            console.log("app")
            console.log(result)
        })
    })

    $("#signIn").on("click", function () {
        console.log("test");
        $.ajax("/login", {
            type: "GET"
        }).then(function (result) {
            $(".landingWrap").css("animation", "1s fadeOut forwards")
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
                $(".landingWrap").css("animation", "1s fadeOut forwards")
                setTimeout(function () {
                    window.location = "/dashboard"
                }, 50);
            } else {
                $(".modalError").css("display","flex")
                alert("error")
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