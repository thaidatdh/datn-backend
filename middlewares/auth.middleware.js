const jwt = require("jsonwebtoken");
const config = {
  secret: "secret-backend",
};
exports.verifyUser = (request, response, next) => {
  let token = request.header("Authorization");
  if (!token) return response.status(401).send("Access Denied");
  token = token.replace("Bearer ", "");

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        response.status(403).send({ message: "Access Denied" });
      } else {
        request.user = decoded;
        request.is_logged_in = true;
        next();
      }
    });
  } catch (err) {
    return response.status(401).send({ message: "Invalid Token" });
  }
};
