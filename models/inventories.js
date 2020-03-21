const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  pets: Array,
});

module.exports = mongoose.model('Inventory', inventorySchema);
