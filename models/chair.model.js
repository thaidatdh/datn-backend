const mongoose = require("mongoose");
const constants = require("../constants/constants");

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
ChairSchema.set("toJSON", { virtuals: true });
ChairSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("chair", ChairSchema);
