const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  direction: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("History", historySchema);
