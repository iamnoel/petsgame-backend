require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('../passport-config');
initializePassport(passport,
    (email) => userz.find((user) => user.email == email),
    (id) => userz.find((user) => user._id == id),
);

const userz = [];

const User = require('../models/users');

router.use(flash());
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json({users});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'An error was encountered trying to get all users',
      error: error,
    });
  }
});

router.get('/:userID', async (req, res, next) => {
  try {
    const id = req.params.userID;
    console.log(id);
    const userData = await getUserByID(id);
    if (userData.code == 200) {
      res.status(200).json({user: userData.user});
    } else if ( userData.code == 404) {
      res.status(404).json({
        message: `There were 0 results returned for id: ${id}`,
      });
    } else {
      res.status(500).json({
        message: `An error was encountered trying to get user id: ${id}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `An error was encountered trying to get user id: ${req.params.petID}`,
      error: error,
    });
  }
});

const getUserByID = async (id) => {
  let code;
  try {
    const user = await User.findById(id);
    console.log(`Received from the db: ${user}`);

    if (user) {
      code = 200;
    } else {
      code = 404;
    }
    return ({user, code});
  } catch (error) {
    console.log(`An error was encountered trying to get pet id: ${id}`);
    code = 500;
    return (code);
  }
};

router.post('/login', passport.authenticate('local'), (req, res, next)=> {
  res.status(200).json({
    message: 'USER',
    user: req.body.name,
  });
});

router.post('/', async (req, res, next) => {
  try {
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

router.delete('/:userID', (req, res, next) => {
  res.status(200).json({
    message: 'User deleted',
    userID: req.params.userID,
  });
});

module.exports = router;
