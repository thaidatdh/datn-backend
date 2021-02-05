const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./specialist.model");
require("./access.group.model");
const User = require("./user.model");
const StaffSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    display_id: String,
    is_active: Boolean,
    provider_color: {
      type: String,
      default: "#FFFFFF",
    },
    staff_type: {
      type: String,
      default: "STAFF", //STAFF, PROVIDER
    },
    drug_lic: String,
    specialist: {
      type: mongoose.Types.ObjectId,
      ref: "specialist",
    },
    access_group: {
      type: mongoose.Types.ObjectId,
      ref: "access_group",
    },
    start_date: { type: Date, default: Date.now() },
    npi: String,
  },
  {
    timestamps: true,
    collection: "staffs",
  }
);
const StaffModel = (module.exports = mongoose.model("staff", StaffSchema));
module.exports.insert = async function (staffInfo) {
  staffInfo.user_type = staffInfo.staff_type
    ? staffInfo.staff_type
    : constants.USER.USER_TYPE_STAFF;
  const insertedUser = await User.insert(staffInfo);
  const user_id = insertedUser._id;
  let staff = new StaffModel();
  staff.user = user_id;
  staff.display_id = staffInfo.display_id
    ? staffInfo.display_id
    : '';
  staff.is_active =
    staffInfo.is_active != undefined ? staffInfo.is_active : constants.STAFF.DEFAULT_IS_ACTIVE;
  staff.provider_color = staffInfo.provider_color
    ? staffInfo.provider_color
    : constants.RANDOM_COLOR();
  staff.staff_type = staffInfo.staff_type
    ? staffInfo.staff_type
    : constants.STAFF.DEFAULT_STAFF_TYPE;
  staff.drug_lic = staffInfo.drug_lic ? staffInfo.drug_lic : null;
  staff.specialist = staffInfo.specialist
    ? staffInfo.specialist
    : null;
  staff.access_group = staffInfo.access_group
    ? staffInfo.access_group
    : null;
  staff.start_date = staffInfo.start_date
    ? staffInfo.start_date
    : Date.now();
  staff.npi = staffInfo.npi ? staffInfo.npi : null;
  const insertedStaff = await staff.save();
  const result = await Object.assign({}, insertedStaff._doc);
  result.user = await Object.assign({}, insertedUser._doc);
  return result;
};

module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = StaffModel.find(query);
  promise.populate("user");
  // Limit
  if (populateOptions.limit) {
    promise.limit(limit);
  }
  // Access group
  if (populateOptions.get_access_group) {
    promise.populate("access_group");
  }
  // Specialist
  if (populateOptions.get_specialist) {
    promise.populate("specialist");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
