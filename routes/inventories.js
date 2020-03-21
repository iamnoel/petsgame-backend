const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Inventory = require('../models/inventories');

router.get('/', async (req, res, next) => {
  try {
    const inventories = await Inventory.find();
    console.log(inventories);
    res.status(200).json({inventories});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({
      message: 'An error was encountered trying to get all inventories',
      error: error,
    });
  }
});

router.get('/:inventoryID', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const inventory = await Inventory.findById(id);
    console.log(`Received from the db: ${inventory}`);
    if (inventory) {
      res.status(200).json({inventory});
    } else {
      res.status(404).json({
        message: `There were 0 results returned for id: ${id}`,
        inventory,
      });
    }
  } catch (error) {
    console.log(`An error was encountered trying to get inventory id: ${id}`);
    res.status(500).json({
      message: `An error was encountered trying to get inventory id: ${id}`,
      error: error,
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const inventory = new Inventory({
      _id: new mongoose.Types.ObjectId(),
      pets: req.body.pets,
    });
    const addInventory = await inventory.save();
    if (addInventory) {
      res.status(201).json({
        message: 'Inventory was created',
        inventory: addInventory,
      });
    }
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to create inventory`,
      error: error,
    });
  }
});

router.post('/:inventoryID/pets', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const pet = req.body.pet;
    const getInventoryPet = await inventory.findById(id);
    const inventoryPets = getInventoryPet.pets;
    inventoryPets.push(pet);
    // TODO: add a new pet to an existing inventory
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to create inventory`,
      error: error,
    });
  }
});

router.delete('/:inventoryID', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const deleteInventory = await Inventory.deleteOne({_id: id});
    if (deleteInventory) {
      if (deleteInventory.deletedCount > 0) {
        console.log('Deleted!');
        res.status(200).json({
          message: `Inventory was successfully deleted (id: ${id})`,
          deleteInventory,
        });
      } else {
        res.status(404).json({
          message: 'No records were deleted',
          deleteInventory,
        });
      }
    }
  } catch (error) {
    console.log('Error');
    res.status(500).json({
      message: `An error was encountered trying to delete inventory id: ${id}.`,
      error: error,
    });
  }
});

module.exports = router;
