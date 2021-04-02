const jwt = require("jsonwebtoken");
const config = {
  secret: "secret-backend",
};
const AccessModel = require("../models/access.group.model");
const translator = require("../utils/translator");
const constants = require("../constants/constants");
const nonSecurePaths = [
  "/",
  "/api",
  "/api/authorization/signin",
  "/api/authorization/refresh-token",
  "/api/authorization/patient/signin",
];

exports.verifyUser = async (request, response, next) => {
  if (
    process.env.DATABASE_DEBUG_SKIP_AUTHORIZATION == "true" ||
    nonSecurePaths.includes(request.path)
  ) {
    return next();
  }
  let token = request.header("Authorization");
  if (!token)
    token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];
  if (!token)
    return response.status(403).send({
      success: false,
      message: await translator.Translate(
        "No token provided. Access denied",
        request.query.lang
      ),
    });
  token = token.replace("Bearer ", "");

  try {
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
    request.decoded = decoded;
    const isAuthorized =
      decoded.user_type == constants.USER.USER_TYPE_ADMIN
        ? true
        : await AccessModel.isBackendAuthorized(
            decoded.user_type,
            request.originalUrl.replace("/api", ""),
            request.method
          );
    if (isAuthorized) {
      return next();
    } else {
      return response.status(401).send({
        success: false,
        message: await translator.Translate(
          "Unauthorized access. Access denied",
          request.query.lang
        ),
      });
    }
  } catch (err) {
    console.error(err);
    return response.status(401).send({
      success: false,
      message: await translator.Translate(
        "Unauthorized access. Access denied",
        request.query.lang
      ),
    });
  }
};
