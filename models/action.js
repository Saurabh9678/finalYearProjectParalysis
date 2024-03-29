const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  deviceId: {
    type: String,
    required: true,
  },
  actions: [
    {
      direction: {
        type: String,
        required: true,
      },
      action: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Action", actionSchema);
