const mongoose = require('mongoose');
const dbConfig = require("../config/db.config.js");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.picture = require("./picture.model");
db.comment = require("./comment.model");
db.ROLES = ["user", "admin"];
db.url = dbConfig.url;

module.exports = db;