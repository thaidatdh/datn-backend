const mongoose = require("mongoose");

const InsurerSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    fax: String,
    email: String,
    max_coverage: Number,
  },
  {
    timestamps: true,
    collection: "insurers",
  }
);

module.exports = mongoose.model("insurer", InsurerSchema);
