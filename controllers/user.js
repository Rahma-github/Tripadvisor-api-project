const user = require("../models/user");
const userService = require("../services/user");
const followUser = async (req, res) => {
  try {
    const currentUser = req.userId;
    const targetUserId = req.params.id;
    const response = await userService.followUser(currentUser, targetUserId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.id;
    const response = await userService.unfollowUser(
      currentUserId,
      targetUserId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editProfileData = async (req, res) => {
  try {
    const userId = req.userId;
    const updatedUser = await userService.editProfileData(userId, req.body);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userService.viewProfile(userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { followUser, unfollowUser, editProfileData, viewProfile };
