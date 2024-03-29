const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const apiResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const apiError = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

const getAction = (num) => {
  if (num == 1) return "up";
  else if (num == 2) return "up";
  else if (num == 3) return "left";
  else if (num == 4) return "right";
  else return "Invalid action number";
};

module.exports = {
  hashPassword,
  comparePassword,
  apiResponse,
  apiError,
  getAction
};
