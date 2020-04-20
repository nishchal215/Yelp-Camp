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

// COMMENT EDIT ROUTE
router.get("/:comments_id/edit", checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comments_id,function(err,foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});
        }
    })
})


// COMMENT UPDATE ROUTE
router.put("/:comments_id", checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

// COMMENT DELETE ROUTE
router.delete("/:comments_id", checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comments_id,function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        res.redirect("/campgrounds/"+req.params.id);
    })
})


function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){     // using .equals because first variable is an
                                                                        // object while other is string so == or ===
                                                                        // will not work
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}


// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports=router;