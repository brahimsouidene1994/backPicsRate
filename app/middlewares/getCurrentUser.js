const jwt = require("jsonwebtoken");
const db = require("../models");
const KCUser = db.kcuser;
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await KCUser.findOne({id:`${req.tokenData.sub}`});    
    req.currentUser = user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = getCurrentUser;