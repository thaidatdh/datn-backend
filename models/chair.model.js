const mongoose = require("mongoose");

const ChairSchema = mongoose.Schema(
  {
    name: String,
    order: String,
    color: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "chairs",
  }
);

module.exports = mongoose.model("chair", ChairSchema);
