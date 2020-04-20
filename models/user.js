var mongoose = require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");

var UserSchema= new mongoose.Schema({
    username:String,
    password:String
});

// add methods to userSchema for passport
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);