const express = require("express");

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Headers", "https");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,Authorization, X-Requested-With, Content-Type, Accept, x-api-key"
  );
  next();
});

//Route Imports
const userRoutes = require("./routes/userRoute");
const actionRoutes = require("./routes/actionRoute");

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/action", actionRoutes);

// MiddleWare for Error

module.exports = app;
