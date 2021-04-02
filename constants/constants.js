module.exports = {
  ACTION: {
    GET: "Get",
    UPDATE: "Update",
    DELETE: "Delete",
    INSERT: "Insert",
  },
  MESSAGES: {
    NOT_FOUND: "not found",
    FAILED: "failed",
  },
  ACCESS_GROUP: {
    READ_ONLY_BACKEND_METHODS: ["GET"],
    FULL_ACTION_BACKEND_METHODS: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    ACTION: {
      NONE: [],
      READONLY: ["GET"],
      FULL: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
    ACTION_SETTING: {
      DEFAULT: "NONE",
      NONE: "NONE",
      READONLY: "READONLY",
      FULL: "FULL",
    },
  },
  USER: {
    DEFAULT_PASSWORD: "hello123",
    USER_TYPE_STAFF: "ADMIN",
    USER_TYPE_STAFF: "STAFF",
    USER_TYPE_PROVIDER: "PROVIDER",
    USER_TYPE_PATIENT: "PATIENT",
    USER_TYPE_OTHER: "OTHER",
    DEFAULT_LANGUAGE: "en",
  },
  PATIENT: {
    PATIENT_TYPE: ["NON_PATIENT", "PATIENT"],
    DEFAULT_PATIENT_TYPE: "NON_PATIENT",
    DEFAULT_IS_ACTIVE: true,
    DEFAULT_IS_NEW_PATIENT: true,
    DEFAULT_EMAIL_RECALL: false,
    DEFAULT_APPT_REMINDER: false,
    GENDER: ["NOT_SPECIFY", "MALE", "FEMALE"],
    DEFAULT_GENDER: "NOT_SPECIFY",
    DEFAULT_PATIENT_PHOTO_LINK: "",
    MARIRAL_STATUS: ["NOT_SPECIFY", "MARRIED", "DIVORCED", "SINGLE", "WIDOWED"],
    DEFAULT_MARIRAL_STATUS: "NOT_SPECIFY",
  },
  STAFF: {
    STAFF_TYPES: ["PROVIDER", "STAFF", "ADMIN"],
    DEFAULT_STAFF_TYPE: "STAFF",
    STAFF_TYPE_PROVIDER: "PROVIDER",
    STAFF_TYPE_STAFF: "STAFF",
    DEFAULT_IS_ACTIVE: true,
  },
};
module.exports.RANDOM_COLOR = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.toString().toUpperCase();
};
