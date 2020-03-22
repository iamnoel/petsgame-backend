// require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const passport = require('passport');
// const flash = require('express-flash');
// const session = require('express-session');

// const initializePassport = require('../passport-config');
// initializePassport(passport,
//     (email) => userz.find((user) => user.email == email),
//     (id) => userz.find((user) => user._id == id),
// );

const userz = [];

const User = require('../models/users');

// router.use(flash());
// router.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// router.use(passport.initialize());
// router.use(passport.session());


router.post('/', async (req, res, next) => {
  try {
    // hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    userz.push(user);
    console.log(user);
    const addUser = await user.save();
    console.log(userz);
    if (addUser) {
      res.status(201).json({
        message: 'User was created',
        user,
      });
    }
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to user pet: ${user.name}`,
      error: error,
    });
  }
});

module.exports = router;
