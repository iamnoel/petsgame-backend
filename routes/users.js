require('dotenv').config();
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const User = require('../models/users');

router.post('/', async (req, res, next) => {
  // try {
  //   hashedPass = await bcrypt.hash(req.body.password, 10);
  //   const user = new User({
  //     _id: new mongoose.Types.ObjectId(),
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: hashedPass,
  //   });

  //   const addUser = await user.save();

  //   if (addUser) {
  //     res.status(201).json({
  //       message: 'User was created',
  //       user,
  //     });
  //   }
  // } catch (error) {
  //   console.log('Error: ', error);
  //   res.status(500).json({
  //     message: `An error was encountered trying to user pet: ${user.name}`,
  //     error: error,
  //   });
  // }
  res.status(200).json({
    message: 'hi',
  });
});

module.exports = router;
