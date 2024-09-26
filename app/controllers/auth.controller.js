const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const KCUser = db.kcuser;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.createUser = (req, res, next)=>{
  const event = req.body;
  
  // Check if it's a registration event
  if (event.type === 'LOGIN' || event.type === 'REGISTER') {
    // Extract user data from the event
    const userId = event.userId;
    const email = event.details.email;
    const username = event.details.username;

    // Save the user data to your database
    console.log(`New user registered: ${username}, Email: ${email}, UserID: ${userId}`);

    KCUser.findOne({ id: userId },(err, user) => {
      if (user) {
        console.log('User already exists:', user);
        res.json({ err:true,message: "User Already Exist" });
      }
      else {
        const user = new KCUser({
          id: userId,
          username: username
        });
        user.save((err, user) => {
          if (err) {
            console.error('Error while inserting user:', err);
            res.json({ err:true,message: err });
          }
          else {
            console.log('New user inserted:', user);
            res.status(200).json({
              err: false,
              message: "New User Added Successfully",
              object: user
          });
          }
        });
      }
    })
  }
}
exports.signup = (req, res) => {
    const {username, email,sexe, password, roles}= req.body;
    console.log("auth: signup(): ", email)
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
    console.log("auth: signin(): ", email)
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