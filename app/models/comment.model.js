const mongoose = require("mongoose");

const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    picture :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Picture"
    },
    voter : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: String,
    voteOne:Number,
    voteTwo:Number,
    voteThree:Number,
    createdAt : Date   
  })
);
module.exports = Comment;