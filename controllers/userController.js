const User = require("../models/user");
const {
  hashPassword,
  comparePassword,
  apiResponse,
  apiError,
} = require("../utils/helper");
const { sendToken } = require("../utils/jwtToken");

// @desc    Register a new user
// @route   POST /api/v1/user/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, deviceId } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return apiError(res, 400, "User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      deviceId,
    });
    return sendToken(user, 201, res);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    Login user
// @route   POST /api/v1/user/login
// @access  Public

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return apiError(res, 400, "Invalid credentials");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return apiError(res, 400, "Invalid credentials");
    }
    return sendToken(user, 200, res);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiError(res, 404, "User not found");
    }
    return apiResponse(res, 200, "User Profile", user);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/user/profile
// @access  Private

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiError(res, 404, "User not found");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await hashPassword(req.body.password);
    }
    user.dob = req.body.dob || user.dob;
    user.blood_group = req.body.blood_group || user.blood_group;
    user.phone_number = req.body.phone_number || user.phone_number;
    user.gender = req.body.gender || user.gender;
    await user.save({ validateBeforeSave: false });
    return apiResponse(res, 200, "User Profile Updated", user);
  } catch (error) {
    return apiError(res, 500, String(error));
  }
};

// @desc    logout user
// @route   GET /api/v1/user/logout
// @access  Private

exports.logoutUser = async (req, res) => {
  try {
    return apiResponse(res, 200, "User Logged Out", {});
  } catch (error) {
    return apiError(res, 500, String(error));
  }
};

//@desc     Store FCM Token
//@route    POST /api/v1/user/storetoken
//@access   Private

exports.storeToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return apiError(res, 404, "User not found");
    }
    user.fcmToken = req.body.fcmToken;
    await user.save({ validateBeforeSave: false });
    return apiResponse(res, 200, "Token Stored", user);
  } catch (error) {
    return apiError(res, 500, String(error));
  }
};
