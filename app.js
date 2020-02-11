require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const petRoutes = require('./api/routes/pets');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Routes for request handling
app.use('/pets/', petRoutes);
app.use('/users/', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Checks routes that do not match
const root = path.join(__dirname, '/client/build');
app.use(express.static(root));
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html') && !req.is('json') && !req.path.includes('.')) {
    res.sendFile('index.html', { root });
  } else next();
});

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: 'Welcome to pets game',
//   });
// });

module.exports = app;
