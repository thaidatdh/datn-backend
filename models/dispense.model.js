const mongoose = require("mongoose");

const DispenseSchema = mongoose.Schema(
  {
    drug: {
      type: mongoose.Types.ObjectId,
      ref: "drug",
      required: true,
    },
    refill: String,
    dispensed: String,
    quantity: String,
    is_macro: { type: Boolean, default: false },
    note: String,
  },
  {
    timestamps: true,
    collection: "dispense",
  }
);

module.exports = mongoose.model("dispense", DispenseSchema);
