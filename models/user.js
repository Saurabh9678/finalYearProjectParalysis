const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    unique:true,
    required: [true, "Please Enter your email"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    select: false,
  },
  dob:{
    type:String,
    default:"NA"
  },
  blood_group: {
    type: String,
    default: "NA"
  },
  phone_number: {
    type: String,
    default: "0"
  },
  gender: {
    type: String,
    default:"NA"
  },
  deviceId:{
    type:String,
    default:"NA"
  },
  fcmToken:{
    type:String,
    default:"NA"
  },
});




module.exports = mongoose.model("User", userSchema);