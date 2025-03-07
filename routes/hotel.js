const express = require("express");


const upload = require("../middlewares/upload");
const {
  postHotel,
  filterHotels,
  checkHotelAvailability,
  getHotelsByDestination,
  getHotelById,
  getNearbyHotels,
} = require("../controllers/hotel");
const router = express.Router();

router.post("/",upload.array("images", 5), postHotel);


router.get("/:hotelId/availability", checkHotelAvailability);

router.get("/nearby", getNearbyHotels);
router.get("/filter", filterHotels);


router.get("/destination", getHotelsByDestination);
router.get("/:hotelId", getHotelById);




module.exports = router;
