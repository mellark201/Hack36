var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var findorcreate = require('mongoose-findorcreate');

var UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
    },
    name: {
        type: String,
    },
    io: {
        type:String
    },
    email: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
    linkedIn: {
        type:String,
    },
    twitter: {
        type: String,
    },
    other: {
        type: String,
    },
    password: {
        type: String,
    },
    token: {
        type:String
    },
    githubAvatar: {
        type:String
    },
    alreadyUsedRepos: [String],
    proposalId: [String],
    projectId: [String]
});

UserSchema.plugin(findorcreate);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);