
const cors = require('cors');
const express = require('express');
const keycloak = require('./app/config/keycloak');

const port = process.env.PORT;

require('dotenv/config');

// Routes
const testRoutes = require('./menuItems');

const errorHandler = (error, req, res, next) => {
  const status = error.status || 422;
  res.status(status).send(error.message);
}

const app = express();

// Keycloak middleware
app.use(keycloak.middleware());
app.use(express.json());
app.use(cors());

// Register routes
app.use('/api', testRoutes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Welcome to bezkoder application." );
});
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});