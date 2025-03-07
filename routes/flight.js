const express = require("express");

const router = express.Router();

const flightController = require("../controllers/flight");
const flightValidators = require("../middlewares/validators/flight");
const isAuth = require("../middlewares/isAuth");

router.post("/", isAuth, flightController.addFlight);
router.get("/filter", flightController.filterFlights);
router.get("/:id", flightController.getFlight);
router.delete("/:id", isAuth, flightController.deleteFlight);
router.put("/:id", isAuth, flightController.editFlight);
router.get(
  "/:id/chickAvailability",
  flightValidators.chickIfAvailable,
  flightController.chickAvailability
);

module.exports = router;
