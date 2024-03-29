const Action = require("../models/action");
const History = require("../models/history");
const { apiError, apiResponse, getAction } = require("../utils/helper");

// @desc    Get all actions
// @route   GET /api/v1/action
// @access  Private
exports.getActions = async (req, res) => {
  try {
    const userActions = await Action.findOne({ user: req.user._id });
    if (!userActions) {
      await Action.create({
        user: req.user._id,
        deviceId: req.user.deviceId
      });
      return apiResponse(res, 200, "No Actions found", []);
    }
    if (userActions.actions.length === 0) {
      return apiResponse(res, 200, "No actions found", []);
    }
    return apiResponse(res, 200, "All actions", userActions.actions);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    Add action
// @route   POST /api/v1/action
// @access  Private

exports.addAction = async (req, res) => {
  const { direction, action } = req.body;
  try {
    const userAction = await Action.findOne({ user: req.user._id });
    if (!userAction) {
      const newAction = await Action.create({
        user: req.user._id,
        deviceId: req.user.deviceId,
        actions: [{ direction, action }],
      });
      return apiResponse(res, 200, "Action added", newAction);
    }
    const actionIndex = userAction.actions.findIndex(
      (act) => act.direction.toLowerCase() === direction.toLowerCase()
    );
    if (actionIndex !== -1) {
      userAction.actions[actionIndex].action = action;
    } else {
      userAction.actions.push({ direction, action });
    }
    await userAction.save({ validateBeforeSave: false });
    return apiResponse(res, 201, "Action added", actions);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    trigger action
// @route   POST /api/v1/action/trigger
// @access  Private

exports.triggerAction = async (req, res) => {
  const { motion_code } = req.body;
  try {
    const userAction = await Action.findOne({ user: req.user._id });
    if (!userAction) {
      return apiError(res, 404, "No action found");
    }
    const direction = getAction(motion_code);
    const action = userAction.actions.find(
      (act) => act.direction.toLowerCase() === direction.toLowerCase()
    );
    if (!action) {
      return apiError(res, 404, "Action not found");
    }
    await History.create({
      user: req.user._id,
      direction: action.direction,
      action: action.action,
    });
    return apiResponse(res, 200, "Action triggered", action);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};

// @desc    Get all history
// @route   GET /api/v1/action/history
// @access  Private

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id });
    if (history.length === 0) {
      return apiResponse(res, 200, "No history found", []);
    }
    return apiResponse(res, 200, "All history", history);
  } catch (error) {
    return apiError(res, 500, String(error.message));
  }
};
