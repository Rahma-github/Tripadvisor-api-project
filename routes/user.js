const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middlewares/isAuth");

router.get("/", isAuth, userController.viewProfile);
router.patch("/", isAuth, userController.editProfileData);
router.post("/follow/:id", isAuth, userController.followUser);
router.post("/unfollow/:id", isAuth, userController.unfollowUser);

module.exports = router;
