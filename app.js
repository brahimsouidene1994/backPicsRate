const express = require('express');
const cors = require('cors');
const app = express();
const keycloak = require('./app/config/keycloak');


require('dotenv/config');

const db = require("./app/models");
const Role = db.role;

console.log("starting.");

app.use(cors());
app.use('/uploads/userPictures', express.static('uploads/userPictures'))

//middleware
app.use(keycloak.middleware());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }))
app.get("/", (req, res) => {
    res.send("Welcome to bezkoder application." );
  });
console.log("build from jenkins");
console.log("build from protect");
console.log("url mong ->",db.url);

//connection to db
  db.mongoose
  .connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{ 
      console.log("Successfully connect to MongoDB.");
      initial();
})
  .catch(err => console.error("Connection error", err));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/picture.routes')(app);
require('./app/routes/comment.routes')(app);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
});


//initial() function helps us to create 3 important rows in roles collection.
const initial= () =>{
    Role.estimatedDocumentCount((err,count)=>{
        // console.log(count)
        if (!err && count === 0) {
            new Role({
              name: "user"
            }).save(err => {
              if (err) {
                console.log("error", err);
              }
      
              console.log("added 'user' to roles collection");
            });

            new Role({
                name: "admin"
              }).save(err => {
                if (err) {
                  console.log("error", err);
                }
        
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

