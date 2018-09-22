$(document).ready(function () {
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    })

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
                if (result === "good") {
                    $(".landingWrap").css("animation", "1s fadeOut forwards")
                    setTimeout(function () {
                        window.location = "/search"
                    }, 500);
                } else {
                    alert(result);
                }
            }
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
            if (result) {
                if (result === "good") {
                    $(".landingWrap").css("animation", "1s fadeOut forwards")
                    setTimeout(function () {
                        window.location = "/dashboard"
                    }, 500);
                } else if (result === "Invalid User") {
                    window.location = "/"
                } else {
                    alert(result);
                }
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