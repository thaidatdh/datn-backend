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
exports.formatReadableDate = (date, lang) => {
  const dateValue = new Date(date);
  return (
    dateValue.getDate() +
    "/" +
    (dateValue.getMonth() + 1) +
    "/" +
    dateValue.getFullYear()
  );
};
