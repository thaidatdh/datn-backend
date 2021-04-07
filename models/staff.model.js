const mongoose = require("mongoose");
const constants = require("../constants/constants");
require("./specialty.model");
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
    specialty: {
      type: mongoose.Types.ObjectId,
      ref: "specialty",
    },
    access_group: {
      type: mongoose.Types.ObjectId,
      ref: "access_group",
    },
    start_date: { type: Date, default: Date.now() },
    npi: String,
    biography: String,
    notify_staff_msg: Boolean,
    notify_patient_msg: Boolean,
    notify_meeting: Boolean,
    staff_photo: String,
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
  staff.user = mongoose.Types.ObjectId(user_id);
  staff.display_id = staffInfo.display_id ? staffInfo.display_id : "";
  staff.is_active =
    staffInfo.is_active != undefined
      ? staffInfo.is_active
      : constants.STAFF.DEFAULT_IS_ACTIVE;
  staff.provider_color = staffInfo.provider_color
    ? staffInfo.provider_color
    : constants.RANDOM_COLOR();
  staff.staff_type = staffInfo.staff_type
    ? staffInfo.staff_type
    : constants.STAFF.DEFAULT_STAFF_TYPE;
  staff.drug_lic = staffInfo.drug_lic ? staffInfo.drug_lic : null;
  staff.specialty = staffInfo.specialty
    ? mongoose.Types.ObjectId(staffInfo.specialty)
    : null;
  staff.access_group = staffInfo.access_group
    ? mongoose.Types.ObjectId(staffInfo.access_group)
    : null;
  staff.start_date = staffInfo.start_date
    ? Date.parse(staffInfo.start_date)
    : Date.now();
  staff.npi = staffInfo.npi ? staffInfo.npi : null;
  staff.biography = staffInfo.biography ? staffInfo.biography : null;
  staff.staff_photo = staffInfo.staff_photo ? staffInfo.staff_photo : null;
  staff.notify_staff_msg =
    staffInfo.notify_staff_msg != undefined
      ? staffInfo.notify_staff_msg
      : false;
  staff.notify_patient_msg =
    staffInfo.notify_patient_msg != undefined
      ? staffInfo.notify_patient_msg
      : false;
  staff.notify_meeting =
    staffInfo.notify_meeting != undefined ? staffInfo.notify_meeting : false;
  const insertedStaff = await staff.save();
  const result = await Object.assign({}, insertedStaff._doc);
  result.user = await Object.assign({}, insertedUser._doc);
  return result;
};
module.exports.updateStaff = async function (staff, staffInfo) {
  staffInfo.user_type =
    staffInfo.staff_type !== undefined
      ? staffInfo.staff_type
      : staff.staff_type;
  const updatedUser = await User.updateUser(staff.user._id, staffInfo);
  staff.display_id =
    staffInfo.display_id !== undefined
      ? staffInfo.display_id
      : staff.display_id;
  staff.is_active =
    staffInfo.is_active != undefined ? staffInfo.is_active : staff.is_active;
  staff.provider_color =
    staffInfo.provider_color !== undefined
      ? staffInfo.provider_color
      : staff.provider_color;
  staff.staff_type =
    staffInfo.staff_type !== undefined
      ? staffInfo.staff_type
      : staff.staff_type;
  staff.drug_lic =
    staffInfo.drug_lic !== undefined ? staffInfo.drug_lic : staff.drug_lic;
  staff.specialty = staffInfo.specialty
    ? mongoose.Types.ObjectId(staffInfo.specialty)
    : staff.specialty;
  staff.access_group = staffInfo.access_group
    ? mongoose.Types.ObjectId(staffInfo.access_group)
    : staff.access_group;
  staff.start_date = staffInfo.start_date
    ? Date.parse(staffInfo.start_date)
    : staff.start_date;
  staff.npi = staffInfo.npi !== undefined ? staffInfo.npi : staffInfo.npi;
  staff.biography =
    staffInfo.biography !== undefined ? staffInfo.biography : staff.biography;
  staff.staff_photo =
    staffInfo.staff_photo !== undefined
      ? staffInfo.staff_photo
      : staff.staff_photo;
  staff.notify_staff_msg =
    staffInfo.notify_staff_msg != undefined
      ? staffInfo.notify_staff_msg
      : staff.notify_staff_msg;
  staff.notify_patient_msg =
    staffInfo.notify_patient_msg != undefined
      ? staffInfo.notify_patient_msg
      : staff.notify_patient_msg;
  staff.notify_meeting =
    staffInfo.notify_meeting != undefined
      ? staffInfo.notify_meeting
      : staff.notify_meeting;
  const updatedStaff = await staff.save();
  const result = await Object.assign({}, updatedStaff._doc);
  result.user = await Object.assign({}, updatedUser._doc);
  return result;
};;
module.exports.get = async function (query, populateOptions) {
  populateOptions = populateOptions || {};
  const promise = StaffModel.find(query);
  promise.populate({
    path: "user",
    select: {
      _id: 1,
      first_name: 1,
      last_name: 1,
      fax: 1,
      mobile_phone: 1,
      home_phone: 1,
      facebook: 1,
      email: 1,
      username: 1,
      user_type: 1,
      theme: 1,
      language: 1,
    },
  });
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
  // Access group
  if (populateOptions.get_access_group) {
    promise.populate("access_group");
  }
  // Specialty
  if (populateOptions.get_specialty) {
    promise.populate("specialty");
  }
  const resultQuery = await promise.exec();
  return resultQuery;
};
