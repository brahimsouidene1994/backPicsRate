const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.picture = require("./picture.model");
db.comment = require("./comment.model");
db.ROLES = ["user", "admin"];

module.exports = db;