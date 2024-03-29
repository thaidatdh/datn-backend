const { fa } = require("translatte/languages");
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
const getSurface = (exports.getSurface = (toothData) => {
  let surfaceData = "";
  if (toothData.mesial == true || toothData.mesial == "true") {
    surfaceData = surfaceData + "M";
  }
  if (toothData.insial == true || toothData.insial == "true") {
    surfaceData = surfaceData + "I";
  }
  if (toothData.occlusal == true || toothData.occlusal == "true") {
    surfaceData = surfaceData + "O";
  }
  if (toothData.top == true || toothData.top == "true") {
    surfaceData = surfaceData + "T";
  }
  if (toothData.distal == true || toothData.distal == "true") {
    surfaceData = surfaceData + "D";
  }
  if (toothData.lingual == true || toothData.lingual == "true") {
    surfaceData = surfaceData + "L";
  }
  if (toothData.buccal == true || toothData.buccal == "true") {
    surfaceData = surfaceData + "B";
  }
  if (toothData.facial == true || toothData.facial == "true") {
    surfaceData = surfaceData + "F";
  }
  if (toothData.root == true || toothData.root == "true") {
    surfaceData = surfaceData + "R";
  }
  return surfaceData;
});
const isContinuousIntArray = (exports.isContinuousIntArray = (intArray) => {
  if (!Array.isArray(intArray)) return false;
  for (let indexValue = 0; indexValue < intArray.length - 1; indexValue++) {
    const nextInt = parseInt(intArray[indexValue + 1]);
    const expectedNextInt = parseInt(intArray[indexValue]) + 1;
    if (expectedNextInt != nextInt) {
      return false;
    }
  }
  return true;
});
const GetSurfaceString = (surfaceArray) => {
  let map = [];
  for (const data of surfaceArray) {
    const dataSplit = data.split(/[\[\]]/g).filter((n) => n != "");
    const dataMapIndex = map.findIndex((n) => n.key == dataSplit[1]);
    if (dataMapIndex == -1) {
      let dataArray = [];
      dataArray.push(dataSplit[0]);
      map.push({ key: dataSplit[1], value: dataArray });
    } else {
      let dataMap = Object.assign({}, map[dataMapIndex]);
      let dataArray = dataMap.value.slice();
      dataArray.push(dataSplit[0]);
      dataMap.value = dataArray;
      map[dataMapIndex] = dataMap;
    }
  }
  let resultArray = [];
  for (const data of map) {
    const surface = data.key;
    const tooth = data.value ? data.value.join(",") : "";
    const surfaceString = (tooth != "" ? "[" + tooth + "]" : "") + surface;
    resultArray.push(surfaceString);
  }
  return resultArray.join(";");
};
exports.getToothSurface = (rawRequestData) => {
  if (rawRequestData == null) {
    return {
      tooth: null,
      surface: null,
    };
  }
  let tooth = "";
  let surface = "";
  const data = [...rawRequestData].sort((a, b) => {
    return parseInt(a.toothNumber) - parseInt(b.toothNumber);
  });
  let toothArray = [];
  let surfaceArray = [];
  for (const toothData of data) {
    if (toothData.isSelected == true || toothData.isSelected == "true") {
      toothArray.push(toothData.toothNumber);
      let surfaceData = getSurface(toothData);
      if (surfaceData != "" && surfaceData != null) {
        surfaceData = "[" + toothData.toothNumber + "]" + surfaceData;
        surfaceArray.push(surfaceData);
      }
    }
  }
  tooth = toothArray.length > 0 && isContinuousIntArray(toothArray)
    ? toothArray[0] + "-" + toothArray[toothArray.length - 1]
    : toothArray.join(",");
  surface = GetSurfaceString(surfaceArray);
  const tempUndefined = undefined;
  const undefinedToothValue = tempUndefined + "-" + tempUndefined;
  if (tooth == undefinedToothValue) tooth = null;
  return {
    tooth: tooth,
    surface: surface,
  };
};
