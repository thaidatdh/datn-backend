const mongoose = require("mongoose");
const Staff = require("./staff.model");
const PracticeSchema = mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    fax: String,
    default_provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
    },
  },
  {
    timestamps: true,
    collection: "practice",
  }
);

module.exports = mongoose.model("practice", PracticeSchema);
