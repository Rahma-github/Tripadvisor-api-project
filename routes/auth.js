const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const userVaildation = require("../middlewares/validators/user");

router.post("/register", userVaildation.createUser, authController.register);
router.post("/login",userVaildation.loginUser, authController.login);
router.post('/google',authController.googlelogin)

module.exports = router;
