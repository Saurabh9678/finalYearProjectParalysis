const jwt = require("jsonwebtoken");
const keys = require("./constants");

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, keys.JWT_SECRET, {
    expiresIn: keys.JWT_EXPIRE,
  });
  const { _id, name, email } = user;
  return res.status(statusCode).json({
    success: true,
    token,
    user: { _id, name, email },
  });
};

module.exports = { sendToken };
