const jwt = require("jsonwebtoken");
const config = {
  secret: "secret-backend",
};
exports.verifyUser = async (request, response, next) => {
  let token = request.header("Authorization");
  if (!token)
    token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"];
  if (!token)
    return response
      .status(403)
      .send({
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
    next();
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
