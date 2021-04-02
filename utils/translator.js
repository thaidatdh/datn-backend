const translatte = require("translatte");
const languages = require("translatte/languages");
const constants = require("../constants/constants");
const getValidLanguage = (module.exports.validLanguage = (lang) => {
  let language = lang;
  if (!language || !languages.isSupported(lang)) {
    language = constants.USER.DEFAULT_LANGUAGE;
  }
  return language;
});
const Translate = (module.exports.Translate = async (text, lang) => {
  try {
    if (lang == null || constants.USER.DEFAULT_LANGUAGE == lang) {
      return text;
    }
    const result = await translatte(text, {
      from: constants.USER.DEFAULT_LANGUAGE,
      to: getValidLanguage(lang),
    });
    return result.text;
  } catch (err) {
    return text;
  }
});
module.exports.FailedMessage = async (action, object, lang) => {
  const elements = [action, object, constants.MESSAGES.FAILED];
  return await Translate(elements.join(" "), lang);
};
module.exports.NotFoundMessage = async (object, lang) => {
  const elements = [object, constants.MESSAGES.NOT_FOUND];
  return await Translate(elements.join(" "), lang);
};
module.exports.DeleteMessage = async (lang) => {
  return await Translate("Delete Successfully", lang);
};

