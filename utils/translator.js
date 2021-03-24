const translatte = require("translatte");
const languages = require("translatte/languages");
const Dictionary = (module.exports = {
  en: {
    FAILED: "failed",
    INSERT: "Insert",
    UPDATE: "Update",
    DELETE: "Delete",
    DENIED: "denied",
    NOT_FOUND: "not found",
    GET: "Get",
    LIST: "list",
    GET_LIST: "Get list",
  },
  vi: {
    FAILED: "thất bại",
    INSERT: "Thêm mới",
    UPDATE: "Cập nhật",
    DELETE: "Xóa",
    DENIED: "bị từ chối",
    NOT_FOUND: "không được tìm thấy",
    GET: "Truy cập",
    LIST: "danh sách",
    GET_LIST: "Truy xuất danh sách",
  },
});
const SUPPORTED_LANGUAGES = ["en", "vi"];
const getValidLanguage = (module.exports.validLanguage = (lang) => {
  let language = lang;
  if (!language || !languages.isSupported(lang)) {
    language = "en";
  }
  return language;
});
module.exports.FailedMessage = (action, object, lang) => {
  const elements = [
    Dictionary[lang][action],
    object,
    Dictionary[lang]["FAILED"],
  ];
  return elements.join(" ");
};
module.exports.NotFoundMessage = (object, lang) => {
  const elements = [object, Dictionary[lang]["NOT_FOUND"]];
  return elements.join(" ");
};
module.exports.Translate = async (text, lang) => {
  try {
    const result = await translatte(text, { from: "en", to: getValidLanguage(lang) });
    return result.text;
  } catch (err) {
    console.log(err);
    return text;
  }
};
