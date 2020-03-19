const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /pets',
  });
});

router.post('/', (req, res, next) => {
  const pet = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: 'Pet was created',
    pet: pet,
  });
});

router.get('/:petID', (req, res, next) => {
  const id = req.params.petID;

  if (id == '0015') {
    res.status(200).json({
      message: `The unique pet ID ${id} was found!`,
      id: id,
      name: 'Dragon Pet',
      type: 'Dragon',
      health: 10,
    });
  } else if (id == '0014') {
    res.status(200).json({
      message: `The unique pet ID ${id} was found!`,
      id: id,
      name: 'Tiger Pet',
      type: 'Tiger',
      health: 10,
    });
  } else if (id == '0013') {
    res.status(200).json({
      message: `The unique pet ID ${id} was found!`,
      id: id,
      name: 'Angel Pet',
      type: 'Angel',
      health: 10,
    });
  } else if (id == '0012') {
    res.status(200).json({
      message: `The unique pet ID ${id} was found!`,
      id: id,
      name: 'Demon Pet',
      type: 'Demon',
      health: 10,
    });
  } else {
    res.status(200).json({
      message: `You entered id ${id}`,
      id: id,
    });
  }
});

router.patch('/:petID', (req, res, next) => {
  res.status(200).json({
    message: 'Updated pet',
    id: req.params.petID,
  });
});

router.delete('/:petID', (req, res, next) => {
  res.status(200).json({
    message: `Deleted pet`,
    id: req.params.petID,
  });
});

module.exports = router;
