const mongoose = require("mongoose");

const DrugSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    refill: String,
    dispensed: String,
    quantity: String,
    note: String,
  },
  {
    timestamps: true,
    collection: "drugs",
  }
);

const DrugModel = (module.exports = mongoose.model("drug", DrugSchema));

module.exports.insert = async function (drugInfo) {
  let drug = new DrugModel();
  drug.name = drugInfo.name ? drugInfo.name : null;
  drug.description = drugInfo.description ? drugInfo.description : null;
  drug.refill = drugInfo.refill ? drugInfo.refill : null;
  drug.dispensed = drugInfo.dispensed ? drugInfo.dispensed : null;
  drug.quantity = drugInfo.quantity ? drugInfo.quantity : null;
  drug.note = drugInfo.note ? drugInfo.note : null;
  return await drug.save();
};
module.exports.updateDrug = async function (drug, drugInfo) {
  drug.name = drugInfo.name ? drugInfo.name : drug.name;
  drug.description = drugInfo.description
    ? drugInfo.description
    : drug.description;
  drug.refill = drugInfo.refill ? drugInfo.refill : drug.refill;
  drug.dispensed = drugInfo.dispensed ? drugInfo.dispensed : drug.dispensed;
  drug.quantity = drugInfo.quantity ? drugInfo.quantity : drug.quantity;
  drug.note = drugInfo.note ? drugInfo.note : drug.note;
  return await drug.save();
};
