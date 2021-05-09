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
    USER_TYPE_ADMIN: "ADMIN",
    USER_TYPE_STAFF: "STAFF",
    USER_TYPE_PROVIDER: "PROVIDER",
    USER_TYPE_PATIENT: "PATIENT",
    USER_TYPE_OTHER: "OTHER",
    DEFAULT_LANGUAGE: "en",
    LANGUAGE: {
      VIETNAMESE: "vi",
      ENGLISH: "en",
    },
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
    DEFAILT_LIMIT_AUTO_COMPLETE: 10,
  },
  STAFF: {
    STAFF_TYPES: ["PROVIDER", "STAFF", "ADMIN"],
    DEFAULT_STAFF_TYPE: "STAFF",
    STAFF_TYPE_PROVIDER: "PROVIDER",
    STAFF_TYPE_STAFF: "STAFF",
    DEFAULT_IS_ACTIVE: true,
  },
  NOTE_MACRO: {
    TYPE_MEDICAL_ALERT: "MEDICAL_ALERT",
    TYPE_TREATMENT: "TREATMENT",
    TYPE_BACKNOTE: "BACKNOTE",
  },
  SEARCH: {
    DEFAULT_AUTO_COMPLETE_PATIENT_TYPE: "name",
    AUTO_COMPLETE_PATIENT_TYPE: ["name", "id"],
    REGEX_NAME: "w+",
    AUTO_COMPLETE_TYPE_NAME: "name",
    DEFAILT_LIMIT_AUTO_COMPLETE: 10,
  },
  RECALL: {
    DEFAULT_INTERVAL: "0y|0m|0w|0d",
  },
  TRANSACTION: {
    TREATMENT_BALANCE_TYPE: "TREATMENT",
    TRANSACTION_BALANCE_TYPE: "TRANSACTION",
    DEFAULT_TRANSACTION_TYPE: "PAYMENT",
    TRANSACTION_TYPE_PAYMENT: "PAYMENT",
    UPDATE_TRANSACTION_TYPES: ["PAYMENT", "DISCOUNT"],
    INCREASE: "INCREASE",
    DECREASE: "DECREASE",
    TRANSACTION_TYPE_CREDIT: "CREDIT",
    TRANSACTION_TYPE_ADJUSTMENT: "ADJUSTMENT",
    TRANSACTION_TYPE_DISCOUNT: "DISCOUNT",
    TRANSACTION_TYPE_TRANSFER_CREDIT: "TRANSFER_CREDIT",
    TRANSACTION_TYPE_REFUND: "REFUND",
  },
  TREATMENT: {
    UPDATE_BALANCE_STATUS: ["EXISTING", "COMPLETED"],
  },
  TOOTH: {
    DEFAULT_TOOTH_TYPE: "ADULT",
    TOOTH_TYPE_CHILD: "CHILD",
    TOOTH_TYPE_ADULT: "ADULT",
    TOOTH_STATUS: [-1, 0, 1, 2, 3],
    DEFAULT_TOOTH_STATUS: -1,
  },
  PROVIDER_SCHEDULE: {
    MODE_MONTHLY: "MONTHLY",
    MODE_WEEKLY: "WEEKLY",
    MODE_AUTO: "AUTO",
    MODE: ["MONTHLY", "WEEKLY", "AUTO"]
  },
};
module.exports.RANDOM_COLOR = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.toString().toUpperCase();
};
