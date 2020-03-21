const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Inventory = require('../models/inventories');
const Pet = require('../models/pets');

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

router.get('/:inventoryID/pets', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const inventory = await Inventory.findById(id);
    console.log(`Received from the db: ${inventory}`);
    if (inventory) {
      const pets = [];
      for (p of inventory.pets) {
        const pet = await Pet.findById(p.id);
        pets.push(pet);
      }
      res.status(200).json({pets});
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

router.post('/:inventoryID/pets/:petID', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const pet = {id: req.params.petID};
    const getInventoryPet = await Inventory.findById(id);
    getInventoryPet.pets.push(pet);
    await getInventoryPet.save();
    res.status(200).json({
      message: `Pet ${pet.id} was added to inventory ${id}`,
    });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to add a pet to inventory: ${id}`,
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

router.delete('/:inventoryID/pets/:petID', async (req, res, next) => {
  try {
    const id = req.params.inventoryID;
    const pet = req.params.petID;
    const getInventoryPet = await Inventory.findById(id);
    const result = getInventoryPet.pets.find( ({id}) => id == pet );
    const index = getInventoryPet.pets.indexOf(result);
    getInventoryPet.pets.splice(index, 1);
    await getInventoryPet.save();
    res.status(200).json({
      message: `Pet ${pet} was removed from inventory ${id}`,
    });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({
      message: `An error was encountered trying to add a pet to inventory: ${id}`,
      error: error,
    });
  }
});


module.exports = router;
