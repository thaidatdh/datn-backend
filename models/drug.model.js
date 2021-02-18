const mongoose = require('mongoose');

const DrugSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    refill: String,
    dispensed: String,
    quantity: String,
  },
  {
    timestamps: true,
    collection: "drugs",
  }
);

const DrugModel = module.exports = mongoose.model('drug', DrugSchema);

module.exports.insert = async function (drugInfo) {
  let drug = new DrugModel();
  drug.name = drugInfo.name ? drugInfo.name : null;
  drug.description = drugInfo.description ? drugInfo.description : null;
  drug.refill = drugInfo.refill ? drugInfo.refill : null;
  drug.dispensed = drugInfo.dispensed ? drugInfo.dispensed : null;
  drug.quantity = drugInfo.quantity ? drugInfo.quantity : null;
  return await drug.save();
};