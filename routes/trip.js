const express = require("express");
const tripController = require("../controllers/trip");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/", isAuth, tripController.createTrip);
router.get("/", isAuth, tripController.getAllTrips);
router.get("/sorted", isAuth, tripController.getSortedTrips);
router.get("/:id", isAuth, tripController.getTripById);
router.get("/share/:id", isAuth, tripController.shareTrip);
router.post("/join/:id", isAuth, tripController.joinTrip);
router.get("/users/:id", isAuth, tripController.getTripUsers);
router.patch("/:id", isAuth, tripController.updateTrip);
router.delete("/:id", isAuth, tripController.deleteTrip);
router.post("/duplicate/:id", isAuth, tripController.duplicateTrip);

module.exports = router;
