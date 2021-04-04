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
