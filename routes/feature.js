const express = require("express");

const router = express.Router();

const { postFeature, getAllFeatures } = require("../controllers/feature");



router.post("/", postFeature);

router.get("/", getAllFeatures);

module.exports = router;