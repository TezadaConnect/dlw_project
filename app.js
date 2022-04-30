const express = require("express");
const morgan = require("morgan");
const ROUTE = require("./src/routes/api_route");
const app = express();
const port = 4000;
const cors = require("cors");
const { corsOptions } = require("./src/config/cors_config");

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", ROUTE);

app.listen(port, () => {
  console.log("Node Server is listening to port " + port);
});
