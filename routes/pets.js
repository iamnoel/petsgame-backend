const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pet = require('../models/pets');

router.get('/', (req, res, next) => {
  Pet.find()
      .exec()
      .then( (pets) => {
        console.log(pets);
        res.status(200).json({pets});
      })
      .catch( (err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});

router.get('/:petID', (req, res, next) => {
  const id = req.params.petID;
  Pet.findById(id)
      .exec()
      .then( (doc) => {
        console.log(`Database received: ${doc}`);
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({
            message: 'There were 0 results returned',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
      });
});

router.post('/', (req, res, next) => {
  const pet = new Pet({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    health: req.body.health,
  });

  pet.save().then((result) => {
    console.log(result);
    res.status(201).json({
      message: 'Pet was created',
      pet: result,
    });
  }).catch( (err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
});

router.patch('/:petID', (req, res, next) => {
  const id = req.params.petID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Pet.update({_id: id}, {$set: updateOps})
      .exec()
      .then( (result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch( (err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});

router.delete('/:petID', (req, res, next) => {
  const id = req.params.petID;
  Pet.deleteOne({_id: id})
      .exec()
      .then( (result) => {
        res.status(200).json({
          result,
        });
      })
      .catch( (err) => {
        console.log(err);
        res.status(500).json({error: err});
      });
});

module.exports = router;
