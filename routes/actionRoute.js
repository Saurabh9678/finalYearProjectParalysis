const express = require("express");
const router = express.Router();

const {
  addAction,
  getActions,
  getHistory,
  triggerAction,
} = require("../controllers/actionController");

const {
  isAuthenticatedUser,
  isAuthenticatedDevice,
} = require("../middleware/auth");

router
  .route("/")
  .post(isAuthenticatedUser, addAction)
  .get(isAuthenticatedUser, getActions);


router.route("/trigger").post(isAuthenticatedDevice, triggerAction);

router.route("/history").get(isAuthenticatedUser, getHistory);

module.exports = router;