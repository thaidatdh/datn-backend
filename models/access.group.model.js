const mongoose = require("mongoose");
const constants = require("../constants/constants");
const AccessGroupSchema = mongoose.Schema(
  {
    role: String,
    path: String,
    action: String,
    is_front_end: Boolean,
  },
  {
    timestamps: true,
    collection: "access_group",
  }
);

const AccessModel = (module.exports = mongoose.model(
  "access_group",
  AccessGroupSchema
));

module.exports.insert = async function (req) {
  let access = new AccessModel();
  access.role = req.role ? req.role : constants.USER.USER_TYPE_STAFF;
  access.path = req.path ? req.path : null;
  access.action = req.action
    ? req.action
    : constants.ACCESS_GROUP.ACTION_SETTING.DEFAULT;
  access.is_front_end =
    req.is_front_end !== undefined ? req.is_front_end : true;
  return await access.save();
};
module.exports.updateAccess = async function (access, req) {
  access.role = req.role ? req.role : access.role;
  access.path = req.path ? req.path : access.path;
  access.action = req.action ? req.action : access.action;
  access.is_front_end =
    req.is_front_end !== undefined ? req.is_front_end : access.is_front_end;
  return await access.save();
};
module.exports.isBackendAuthorized = async function (role, path, method) {
  const accessList = await AccessModel.find({
    role: role,
    is_front_end: false,
  }).sort({
    path: -1,
  });
  let pathValue = path;
  if (pathValue.includes("?")) {
    pathValue = pathValue.substring(0, path.indexOf("?"));
  }
  if (role == constants.USER.USER_TYPE_PATIENT && method == "GET") {
    return true;
  } else if (
    role == constants.USER.USER_TYPE_PATIENT &&
    method == "PATCH" &&
    pathValue.startsWith("/patient")
  ) {
    return false;
  } else if (role == constants.USER.USER_TYPE_PATIENT && method != "GET") {
    return false;
  }
  for (const model of accessList) {
    if (
      pathValue.startsWith(model.path) &&
      constants.ACCESS_GROUP.ACTION[model.action].includes(method)
    ) {
      return true;
    }
  }
  return false;
};
