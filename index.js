const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const authMiddleware = require("./middlewares/auth.middleware");
require("dotenv").config();
// create express app
const app = express();
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
//verify authentication middleware
app.use(authMiddleware.verifyUser);
// Configuring the database
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the mongo database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to  application.",
  });
});
let routes = require("./routes/index");
app.use("/api", routes);
//swagger
var options = {
  explorer: true,
};
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
// listen for requests
const SERVER_PORT = process.env.SERVER_PORT ? process.env.SERVER_PORT : 3000;
app.listen(SERVER_PORT, () => {
  console.log("Server is listening on port " + SERVER_PORT);
});
