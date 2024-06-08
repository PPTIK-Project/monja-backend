const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./src/routes/routes');
const database = require('./src/configs/database');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// setting headers for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//  Load env variables
if (dotenv.error) {
  console.error('Error loading .env file:', dotenv.error);
} else {
  console.log('.env file loaded successfully');
}

// Connect to MongoDB
database.ConnectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const _version = 'v1';
app.use(`/api/${_version}`, routes);

module.exports = app;
