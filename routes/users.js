const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  res.status(200).json({
    message: 'hi',
  });
});

module.exports = router;
