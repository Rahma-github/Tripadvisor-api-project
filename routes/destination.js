const express = require("express");

const upload = require("../middlewares/upload");
const {
  postDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} = require("../controllers/destination");


const router = express.Router();

router.post("/",upload.array("images", 5), postDestination);

router.get("/", getAllDestinations);

router.get("/:id", getDestinationById);

router.patch("/:id", updateDestination);

router.delete("/:id", deleteDestination);

module.exports = router;
