// Hello Iam Mahmoud!
const DestinationModel = require("../models/destination");
const FeatureModel = require("../models/feature");
const HotelModel = require("../models/hotel");

const postHotel = async (req, res) => {
  try {
    const {
      name,
      address,
      description,
      languagesSpoken,
      pricePerNight,
      emailHotel,
      contactHotel,
      HotelLink,
      location,
      hotelStyle,
      hotelClass,
      amenities,
      destinationId,
      rooms = "[]",
    } = req.body;

    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;

    //  if (
    //    !name ||
    //    !address ||
    //    !description ||
    //    !pricePerNight ||
    //    !parsedLocation ||
    //    !hotelClass ||
    //    !hotelStyle ||
    //    !destinationId ||
    //    !amenities ||
    //    (req.files && req.files.length === 0)
    //  ) {
    //    return res.status(400).json({ message: "Missing required fields" });
    //  }

    let missingFields = [];

    if (!name) missingFields.push("name");
    if (!address) missingFields.push("address");
    if (!description) missingFields.push("description");
    if (!pricePerNight) missingFields.push("pricePerNight");
    if (!parsedLocation) missingFields.push("location");
    if (!hotelClass) missingFields.push("hotelClass");
    if (!hotelStyle) missingFields.push("hotelStyle");
    if (!destinationId) missingFields.push("destinationId");
    if (!amenities) missingFields.push("amenities");
    if (req.files && req.files.length === 0) missingFields.push("images");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: missingFields,
      });
    }

    if (![1, 2, 3, 4, 5].includes(parseInt(hotelClass))) {
      return res
        .status(400)
        .json({ message: "Hotel class must be between 1 and 5 stars" });
    }

    if (!(await DestinationModel.findById(destinationId))) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const validAmenities = await FeatureModel.find({ _id: { $in: amenities } });
    if (validAmenities.length !== amenities.length) {
      return res
        .status(400)
        .json({ message: "One or more amenities are invalid" });
    }

    const port = process.env.PORT || 5000;
    const hostname = process.env.HOSTNAME || "http://localhost";
    const imageUrls = req.files.map(
      (file) => `${hostname}:${port}/uploads/${file.filename}`
    );

    const createdRooms = Array.isArray(rooms)
      ? rooms.map((room) => ({
          type: room.type,
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          bookedDates: room.bookedDates ?? [],
        }))
      : JSON.parse(rooms).map((room) => ({
          type: room.type,
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          bookedDates: room.bookedDates ?? [],
        }));

    const newHotel = await HotelModel.create({
      name,
      address,
      description,
      languagesSpoken,
      images: imageUrls,
      pricePerNight: parseFloat(pricePerNight),
      emailHotel,
      contactHotel,
      HotelLink,
      location: parsedLocation,
      hotelStyle,
      hotelClass,
      amenities,
      destinationId,
      rooms: createdRooms,
    });

    res
      .status(201)
      .json({ message: "Hotel created successfully", hotel: newHotel });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const filterHotels = async (req, res) => {
  try {
    const { HotelName, destinationName, checkIn, checkOut, adults, children } =
      req.query;
    let query = {};

    if (!HotelName && !destinationName) {
      return res
        .status(400)
        .json({ message: "u must provide name or destination" });
    }

    if (HotelName) {
      query.name = { $regex: HotelName, $options: "i" };
    }

    if (destinationName) {
      const destinationMatch = await DestinationModel.findOne({
        name: { $regex: destinationName, $options: "i" },
      });

      if (destinationMatch) {
        query.destinationId = destinationMatch._id;
      }
    }

    let hotels = await HotelModel.find(query).populate("destinationId");

    if (checkIn && checkOut && (adults || children)) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const totalGuests = parseInt(adults || 0) + parseInt(children || 0);

      hotels = hotels.filter((hotel) =>
        hotel.rooms.some((room) => {
          const roomCapacity = room.maxAdults + room.maxChildren;
          if (roomCapacity < totalGuests) {
            return false;
          }

          return room.bookedDates.every(
            (booking) =>
              checkOutDate <= booking.checkInDate ||
              checkInDate >= booking.checkOutDate
          );
        })
      );
    }

    if (hotels.length === 0) {
      return res.status(404).json({ message: "there is no hotels matched" });
    }
    res.status(200).json({ message: "there is hotels matched", hotels });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkHotelAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, adults, children } = req.query;

    if (!checkIn || !checkOut || (!adults && !children)) {
      return res.status(400).json({
        message: "Check-in, check-out, and guest capacity are required.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const totalGuests = parseInt(adults || 0) + parseInt(children || 0);

    const hotel = await HotelModel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    const availableRooms = hotel.rooms.filter((room) => {
      const roomCapacity = room.maxAdults + room.maxChildren;
      if (roomCapacity < totalGuests) {
        return false;
      }

      return room.bookedDates.every(
        (booking) =>
          checkOutDate <= booking.checkInDate ||
          checkInDate >= booking.checkOutDate
      );
    });

    if (availableRooms.length === 0) {
      return res.status(404).json({
        message: `We're sorry, this hotel is not available from ${checkIn} to ${checkOut}. Try changing the dates or the number of travelers to find availability.`,
      });
    }

    res.status(200).json({ message: "Rooms available", rooms: availableRooms });
  } catch (error) {
    console.error("Error checking hotel availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHotelsByDestination = async (req, res) => {
  try {
    const { destinationName } = req.query;

    if (!destinationName) {
      return res
        .status(400)
        .json({ message: "destinationName query parameter is required." });
    }

    const destinationMatch = await DestinationModel.findOne({
      name: { $regex: destinationName, $options: "i" },
    });

    if (!destinationMatch) {
      return res
        .status(404)
        .json({ message: "No hotels found for this destination." });
    }

    const hotels = await HotelModel.find({
      destinationId: destinationMatch._id,
    }).populate("destinationId");

    if (hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found." });
    }

    res.status(200).json({ message: "Hotels retrieved successfully", hotels });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await HotelModel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    res.status(200).json({ message: "Hotel retrieved successfully", hotel });
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getNearbyHotels = async (req, res) => {
  try {
    const { lat, lng, maxdistance = 5000 } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }

    const hotels = await HotelModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxdistance),
        },
      },
    });

    if (hotels.length === 0) {
      return res.status(404).json({ message: "No nearby hotels found" });
    }

    return res
      .status(200)
      .json({ message: "Nearby hotels retrieved successfully", hotels });
  } catch (error) {
    console.error("Error fetching nearby hotels:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  postHotel,
  filterHotels,
  checkHotelAvailability,
  getHotelsByDestination,
  getHotelById,
  getNearbyHotels,
};
