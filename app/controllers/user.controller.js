const db = require("../models");
const User = db.user;

  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  exports.getAllAppUsers = async (req, res)=>{//only role = user
      try{
          const appUsers = await User.find({"roles":{$in:"61113a7f101ad904ac0cde14"}});
          res.status(200).json(
            appUsers
          );
      }catch(err){
          res.json({message : err})
      }
  };