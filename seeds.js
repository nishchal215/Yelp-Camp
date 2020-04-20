var mongoose=require("mongoose"),
    Campground=require("./models/campground"),
    Comment=require("./models/comment");

var data=[
    {
        name:"Camp 1",
        image:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.hipcamp.com%2Fimage%2Fupload%2Fc_limit%2Cf_auto%2Ch_1200%2Cq_60%2Cw_1920%2Fv1442119564%2Fcampground-photos%2Ftpuq8pxul7brg4ucec7x.jpg&f=1&nofb=1",
        description: "Camp 1"
    },{
        name:"Camp 2",
        image:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkoa.com%2Fcontent%2Fcampgrounds%2Fport-angeles%2Fbackgrounds%2F47128backgroundddd266fb-4e9f-48f3-8868-c13418638bb3.jpg&f=1&nofb=1",
        description: "Camp 2"
    },{
        name:"Camp 3",
        image:"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.outdoorproject.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fodp_header_adaptive%2Fpublic%2Ffeatures%2Fdsc_0535.jpg%3Fitok%3DRPvMRnKB&f=1&nofb=1",
        description: "Camp 3"
    }
];

function seedDB(){
    // Remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted succesfully");
        }

        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a campground");
                    // create a comment
                    Comment.create({
                        text:"Great",
                        author:"Nishchal"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    })
                }
            });
        });

    });

}

module.exports=seedDB;