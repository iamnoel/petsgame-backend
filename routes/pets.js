const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pet = require('../models/pets');

router.get('/', async (req, res, next) => {
  try {
    const pets = await Pet.find();
    console.log(pets);
    res.status(200).json({pets});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'An error was encountered trying to get all pets',
      error: error,
    });
  }
});

router.get('/:petID', async (req, res, next) => {
  try {
    const id = req.params.petID;
    console.log(id);
    const petData = await getPetById(id);
    if (petData.code == 200) {
      res.status(200).json({pet: petData.pet});
    } else if ( petData.code == 404) {
      res.status(404).json({
        message: `There were 0 results returned for id: ${id}`,
      });
    } else {
      res.status(500).json({
        message: `Anz error was encountered trying to get pet id: ${id}`,
        error: error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `An error was encountered trying to get pet id: ${req.params.petID}`,
      error: error,
    });
  }
});

const getPetById = async (id) => {
  let code;
  try {
    const pet = await Pet.findById(id);
    console.log(`Received from the db: ${pet}`);

    if (pet) {
      code = 200;
    } else {
      code = 404;
    }
    return ({pet, code});
  } catch (error) {
    console.log(`An error was encountered trying to get pet id: ${id}`);
    code = 500;
    return (code);
  }
};

router.get('/:petID/feed', async (req, res, next) => {
  try {
    const id = req.params.petID;
    const pet = await Pet.findById(id);
    pet.health++;
    await pet.save();
    console.log(`Fed pet: ${pet}`);
    if (pet) {
      res.status(200).json({pet});
    } else {
      res.status(404).json({
        message: `There were 0 results returned for id: ${id}`,
        pet,
      });
    }
  } catch (error) {
    console.log(`An error was encountered trying to get pet id: ${id}`);
    res.status(500).json({
      message: `An error was encountered trying to get pet id: ${id}`,
      error: error,
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const pet = new Pet({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      type: req.body.type,
      health: req.body.health,
    });
    const addPet = await pet.save();
    if (addPet) {
      res.status(201).json({
        message: 'Pet was created',
        addPet,
      });
    }
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to create pet: ${name}`,
      error: error,
    });
  }
});

router.patch('/:petID', async (req, res, next) => {
  try {
    const id = req.params.petID;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    const updatePet = await Pet.updateOne({_id: id}, {$set: updateOps});
    if (updatePet) {
      if (updatePet.n > 0) {
        if (updatePet.nModified > 0) {
          res.status(200).json({
            message: 'Pet successfully updated',
            updatePet,
          });
        } else {
          res.status(200).json({
            message: 'No changes made',
            updatePet,
          });
        }
      } else {
        res.status(404).json({
          message: `No pets were found matching id: ${id}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: `An error was encountered trying to update pet id: ${id}.`,
      error: error,
    });
  }
});

router.delete('/:petID', async (req, res, next) => {
  try {
    const id = req.params.petID;
    const deletePet = await Pet.deleteOne({_id: id});
    if (deletePet) {
      if (deletePet.deletedCount > 0) {
        console.log('Deleted!');
        res.status(200).json({
          message: `Pet was successfully deleted (id: ${id})`,
          deletePet,
        });
      } else {
        res.status(404).json({
          message: 'No records were deleted',
          deletePet,
        });
      }
    }
  } catch (error) {
    console.log('Error');
    res.status(500).json({
      message: `An error was encountered trying to delete pet id: ${id}.`,
      error: error,
    });
  }
});

module.exports = router;
