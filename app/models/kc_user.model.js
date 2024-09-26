const mongoose = require("mongoose");
const KCUser = mongoose.model(
  "KCUser",
  new mongoose.Schema({
    id: String,
    username: String
  })
);
module.exports = KCUser;