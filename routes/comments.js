var express=require("express"),
    router=express.Router({mergeParams: true}),
    Campground=require("../models/campground"),
    Comment=require("../models/comment");

// 
// COMMENTS ROUTES
// 

// Comments new
router.get("/new", isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    })
});

// Comments create
router.post("/", isLoggedIn, function(req,res){

    // lookup campground using id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            // create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    // add username and id to comments
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            })

            // connect new comment to campground
            // redirect to show page
        }
    })

});

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports=router;