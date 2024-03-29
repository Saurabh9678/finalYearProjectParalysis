const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { apiError } = require("../utils/helper");
const keys = require("../utils/constants");

exports.isAuthenticatedUser = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  let token;
  if (headerToken) {
    const splited_token = headerToken.toString().split(" ");
    if (splited_token[0] === "Bearer") {
      splited_token.map(async (inside_token) => {
        if (inside_token !== "Bearer") {
          token = inside_token;
        }
      });
    } else {
      return apiError(res, 401, "Please login to access the resource");
    }
    if (!token) {
      return apiError(res, 401, "Please login to access the resource");
    }
  } else {
    return apiError(res, 401, "Please login to access the resource");
  }

  try {
    const decodedData = jwt.verify(token, keys.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    if (!req.user || req.user === null) {
      return apiError(res, 401, "Please login to access the resource");
    }
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return apiError(res, 401, "Invalid token");
    }
    // Handle other errors if needed
    return apiError(res, 401, "Please login to access the resource");
  }
};

exports.isAuthenticatedDevice = async (req, res, next) => {
  const deviceId = req.headers.deviceid;
  if (!deviceId) {
    return apiError(res, 401, "Please send device id");
  }
  try {
    req.user = await User.findOne({ deviceId });
    if (!req.user || req.user === null) {
      return apiError(res, 401, "Please send valid device id");
    }
    next();
  } catch (error) {
    return apiError(res, 401, String(error.message));
  }
};
