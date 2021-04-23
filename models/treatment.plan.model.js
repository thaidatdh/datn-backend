const mongoose = require("mongoose");
const constants = require("../constants/constants");
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
TreatmentPlanSchema.set("toJSON", { virtuals: true });
TreatmentPlanSchema.set("toObject", { virtuals: true });
const TreatmentPlanModel = (module.exports = mongoose.model(
  "treatment_plan",
  TreatmentPlanSchema
));
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = TreatmentPlanModel.find(query);
  // Limit
  if (populateOptions.limit && populateOptions.page) {
    promise.skip(
      Number.parseInt(populateOptions.limit) *
        Number.parseInt(populateOptions.page)
    );
  }
  if (populateOptions.limit) {
    promise.limit(Number.parseInt(populateOptions.limit));
  }
  if (populateOptions.get_patient) {
    promise.populate({
      path: "patient",
      populate: {
        path: "user",
        select: {
          _id: 1,
          first_name: 1,
          last_name: 1,
        },
      },
    });
  }
  if (populateOptions.get_treatment) {
    promise.populate("treatments");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
module.exports.insert = async function (planInfo) {
  let plan = new TreatmentPlanModel();
  plan.patient = planInfo.patient ? planInfo.patient : null;
  plan.name = planInfo.name ? planInfo.name : null;
  plan.description = planInfo.description ? planInfo.description : null;
  return await plan.save();
};
module.exports.updatePlan = async function (plan, planInfo) {
  plan.patient = planInfo.patient ? planInfo.patient : plan.patient;
  plan.name = planInfo.name ? planInfo.name : plan.name;
  plan.description = planInfo.description
    ? planInfo.description
    : plan.description;
  return await plan.save();
};
