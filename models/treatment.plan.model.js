const mongoose = require("mongoose");
const Treatment = require("./treatment.model");
const TreatmentPlanSchema = mongoose.Schema(
  {
    patient: mongoose.Types.ObjectId,
    name: String,
    description: String,
  },
  {
    timestamps: true,
    collection: "treatment_plans",
  }
);
TreatmentPlanSchema.virtual("treatments", {
  ref: "treatment",
  localField: "_id",
  foreignField: "treatment_plan",
  justOne: false,
});
module.exports = mongoose.model("treatment_plan", TreatmentPlanSchema);
