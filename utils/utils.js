const constants = require("../constants/constants");
exports.calculateDateRecallByInterval = function (treatmentDate, interval) {
  const intervalValue = interval.split(/\D/).filter((n) => n !== "");
  const numberOfDay =
    Number.parseInt(intervalValue[0]) * 365 +
    Number.parseInt(intervalValue[1] * 30) +
    Number.parseInt(intervalValue[2]) * 7 +
    Number.parseInt(intervalValue[3]);
  const date = new Date(treatmentDate);
  return new Date(date.setDate(date.getDate() + numberOfDay));
};
exports.formatMoney = (amount, lang) => {
  let format = "en-US";
  if (lang == constants.USER.LANGUAGE.VIETNAMESE) {
    format = "vi-VN";
  }
  return new Intl.NumberFormat(format).format(Number.parseInt(amount));
};
exports.getFormatRegion = (lang) => {
  let format = "en-US";
  if (lang == constants.USER.LANGUAGE.VIETNAMESE) {
    format = "vi-VN";
  }
  return format;
};
exports.formatReadableDate = (date) => {
  const dateValue = new Date(date);
  return (
    dateValue.getDate().toString().padStart(2, "0") +
    "/" +
    (dateValue.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    dateValue.getFullYear()
  );
};
exports.toNumber = (number) => {
  const numeric_string = number ? new String(number).replace(/\D/g, "") : null;
  return numeric_string ? parseInt(numeric_string) : 0;
};
exports.calculateAge = (birthday) => {
  if (birthday == null || birthday == undefined) {
    return 20;
  }
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
exports.formatPhone = (phoneNumberString) => {
  if (phoneNumberString == "" || phoneNumberString == null) return "";
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
};
