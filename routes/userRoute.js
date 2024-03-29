const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  storeToken,
  updateUserProfile,
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router
  .route("/profile")
  .get(isAuthenticatedUser, getUserProfile)
  .put(isAuthenticatedUser, updateUserProfile);

router.route("/storetoken").post(isAuthenticatedUser, storeToken);

module.exports = router;
