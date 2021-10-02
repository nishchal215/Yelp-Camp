var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    Campground=require("./models/campground"),  // "./" points to current directory the file is in and then we can search
    Comment=require("./models/comment"),
    User=require("./models/user")
    seedDB=require("./seeds"),
    passport=require("passport");
    LocalStrategy=require("passport-local"),
    methodOverride=require("method-override");

// requiring routes
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes=require("./routes/index");

//  seedDB();    // seed the database
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:    true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

// test comment


// passport configuration
app.use(require("express-session")({
    // it is the string used to hash the password with
    secret: "secret key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));


// comes from passport-local-mongoose
// login route uses this method when authenticating user with a middleware
passport.use(new LocalStrategy(User.authenticate()));

// to serialize and deserialize user from passport-local-mogoose package
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make a middleware for passing currentUser data to every template
app.use(function(req,res,next){
    // whatever we put inside res.locals is available inside our templates so req.user will be passed as currentUser
    // in locals which can be accessed by all templates wth this middleware
    res.locals.currentUser=req.user;
    next();     // necessary to move after providing this middleware
})


app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);      // adds /campgrounds before all the routes in campgroundRoutes
                                                // so /new becomes /campgrounds/new
app.use(indexRoutes);


app.listen(3000,function(req,res){
    console.log("Server started");
});