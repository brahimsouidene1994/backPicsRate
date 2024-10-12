const mongoose = require("mongoose");

const Picture = mongoose.model(
  "Picture",
  new mongoose.Schema({
    category : {
      type: String,
      enum:['SOCIAL','BUSINESS','DATING']
    },
    contextPic : String,
    createdAt : Date,
    path : String,
    status : Boolean,
    commentsStatus :Boolean,
    owner : 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    voters : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }] ,
        
  })
);
module.exports = Picture;