const mongoose = require("mongoose");
const keys = require("../utils/constants");

const connectDataBase = () => {
  mongoose
    .connect(keys.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDataBase;
