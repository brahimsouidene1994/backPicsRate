const express = require('express');
const cors = require('cors');
const app = express();
const keycloak = require('./app/config/keycloak');
const db = require("./app/models");

const Role = db.role;
console.log("starting...");
console.log("mongo...",db.url);

// Use Keycloak middleware
app.use(
  cors({origin: true}),
  keycloak.middleware(),
);
// middleware
app.use('/uploads/userPictures', express.static('uploads/userPictures'))
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }))
app.get("/", (req, res) => {
    res.send("Welcome to PicsRate." );
  });


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
require('./app/routes/user.routes')(app,);
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

