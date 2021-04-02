let jwt = require("jsonwebtoken");
//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const patientModel = require("../models/patient.model");
User = require("../models/user.model");
const Staff = require("../models/staff.model");
//For index
exports.index = async function (req, res) {
  const users = await patientModel.get(
    {},
    { get_hohh: true, get_provider: true }
  );
  res.json({
    success: true,
    payload: users,
  });
};
exports.add = async function (req, res) {
  const staffinfo = {
    first_name: "as",
    last_name: "ba",
    username: "abcs",
    password: "test",
  };
  const rs = await patientModel.insert(staffinfo);
  return res.json({ payload: rs });
};
