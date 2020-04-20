var express=require("express"),
    router=express.Router({mergeParams: true}),
    passport=require("passport"),
    User=require("../models/user");


// Route route
router.get("/",function(req,res){
    res.render("landing");
});



// AUTH ROUTES

// show register form
router.get("/register",function(req,res){
    res.render("register");
})

// handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        // local specifies the type of authentication/strategy we are doing instead of local it can be google, facebook etc.
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })

        // in register logic first a user is created and then it is authenticated but in login we just authenticate
        // the received user and see if it exists

    })
})


// show login form
router.get("/login",function(req,res){
    res.render("login")
})

// handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){

        // in register logic first a user is created and then it is authenticated but in login we just authenticate
        // the received user and see if it exists
});

// logout route
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
})


// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports=router;