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
    dateValue.getFullYear().toString().padStart(4, "0")
  );
};
exports.toNumber = (number) => {
  const numeric_string = number ? new String(number).replace(/\D/g, "") : null;
  return numeric_string ? parseInt(numeric_string) : 0;
};
exports.getDates = (date, time, duration) => {
  const timeString = time.toString().padStart(4, "0");
  const hour = parseInt(timeString.substring(0, 2));
  const minute = parseInt(timeString.substring(2));
  let startDate = new Date(date);
  startDate.setHours(hour, minute);
  const durationInt = parseInt(duration);
  const endDate = new Date(startDate.getTime() + durationInt * 60 * 1000);
  return {
    start: startDate,
    end: endDate,
  };
};

const isOverLap3Start = (current, before, after) => {
  const beforeDate = new Date(before);
  const afterDate = new Date(after);
  const currentDate = new Date(current);
  return beforeDate <= currentDate && currentDate < afterDate;
};
const isOverLap3End = (current, before, after) => {
  const beforeDate = new Date(before);
  const afterDate = new Date(after);
  const currentDate = new Date(current);
  return beforeDate < currentDate && currentDate <= afterDate;
};
exports.isOverlap = (before1, after1, before2, after2) => {
  return (
    isOverLap3Start(before1, before2, after2) ||
    isOverLap3End(after1, before2, after2)
  );
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
  return cleaned;
};
