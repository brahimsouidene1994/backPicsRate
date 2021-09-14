const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // sexe : String,
    sexe :
      {
        type: String,
        enum: ["MALE", "FEMALE"]
      },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);
module.exports = User;