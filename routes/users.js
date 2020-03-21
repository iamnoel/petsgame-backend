const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/users');

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Users were fetched',
  });
});

router.get('/:userID', (req, res, next) => {
  res.status(200).json({
    message: 'User details',
    userID: req.params.userID,
  });
});

router.post('/', async (req, res, next) => {
  try {
    hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });
    const addUser = await user.save();
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
