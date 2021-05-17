const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const authMiddleware = require("./middlewares/auth.middleware");
require("dotenv").config();
global.XMLHttpRequest = require("xhr2");
const firebaseStorage = require("./utils/storage");
firebaseStorage.initialize();
global.atob = require("atob");
// create express app
const app = express();
app.use(cors());

//verify authentication middleware
app.use(authMiddleware.verifyUser);
// Configuring the database
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.set("useUnifiedTopology", true);
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
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "100mb" }));
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
const SERVER_PORT = process.env.PORT ? process.env.PORT : 3000;
app.listen(SERVER_PORT, (err) => {
  if (err) throw err;
  console.log("Server is listening on port " + SERVER_PORT);
});
