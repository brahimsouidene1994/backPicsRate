const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const {username, email,sexe, password, roles}= req.body;

    const user = new User({
      email: email,
      password: bcrypt.hashSync(password, 8),
      sexe : sexe
    });
  
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (roles) {
        Role.find(
          {
            name: { $in: roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
  
              
            //generate a token
            var token = jwt.sign({ id: user.id }, config.secret);    
            res.status(200).send({
              id: user._id,
              username: user.username,
              email: user.email,
              sexe: user.sexe,
              roles: user.roles,
              accessToken: token
            });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          user.roles = role._id;
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            
            //generate a token
            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400 // 24 hours
            });
      
            res.status(200).send({
              id: user._id,
              username: user.username,
              email: user.email,
              sexe: user.sexe,
              roles: user.roles,
              accessToken: token
            });
          });

        });
      }
    });
  };
  //for google account
  exports.signupGoogle = (req, res) => {
    const {email}= req.body;

    const user = new User({
      email: email
    });
  
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      if (roles) {
        Role.find(
          {
            name: { $in: roles }
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
  
              res.send({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          user.roles = [role._id];
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
  
            res.send({ message: "User was registered successfully!" });
          });
        });
      }
    });
  };
  
  exports.signin = (req, res) => {
    const {email, username, password } =req.body;
    User.findOne({
        email: email
		})
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
  
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        //compare the signin password with the retrived user's password
        var passwordIsValid = bcrypt.compareSync(
          password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        //generate a token
        var token = jwt.sign({ id: user.id }, config.secret);
  
        var authorities = [];
  
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          sexe: user.sexe,
          roles: authorities,
          accessToken: token
        });
      });
  };