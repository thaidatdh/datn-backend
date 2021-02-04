const mongoose = require("mongoose");
const Staff = require("./staff.model");
const Chair = require("./chair.model");
const AppointmentBlockSchema = mongoose.Schema(
  {
    provider: {
      type: mongoose.Types.ObjectId,
      ref: "staff",
      required: true,
    },
    chair: {
      type: mongoose.Types.ObjectId,
      ref: "chair",
      required: true,
    },
    block_date: Date,
    block_time: String,
    duration: String,
    note: String,
    repeat_pattern: String,
    end_date: String,
    block_color: String,
  },
  {
    timestamps: true,
    collection: "appointment_blocks",
  }
);

module.exports = mongoose.model("appointment_block", AppointmentBlockSchema);
