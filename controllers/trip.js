const Trip = require("../models/trip");
const tripService = require("../services/trip");

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const owner = req.userId;
    const { name, destination, date, description, visibility, isCompleted } =
      req.body;

    const tripDate = new Date(date);
    const currentDate = new Date();

    const newTrip = await tripService.createTrip({
      name,
      destination,
      date: tripDate,
      description,
      visibility,
      owner,
      isCompleted:
        isCompleted !== undefined ? isCompleted : tripDate < currentDate, // ✅ Mark as completed if past date
    });

    res.status(201).json({ message: "Trip created", trip: newTrip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Get all trips
// exports.getAllTrips = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const trips = await tripService.findTrips({$or:[{owner:userId},{users:userId}]});
//     res.status(200).json(trips);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//get all trips with it's status
exports.getAllTrips = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();

    const trips = await Trip.find({
      $or: [{ owner: userId }, { users: userId }],
    });

    let completedTrips = [];
    let uncompletedTrips = [];

    trips.forEach(async (trip) => {
      let isCompleted = trip.isCompleted || new Date(trip.date) < currentDate;

      if (!trip.isCompleted && new Date(trip.date) < currentDate) {
        trip.isCompleted = true;
        await trip.save();
      }

      const tripData = trip.toObject();
      tripData.isCompleted = isCompleted;

      if (isCompleted) {
        completedTrips.push(tripData);
      } else {
        uncompletedTrips.push(tripData);
      }
    });

    res.status(200).json({ completedTrips, uncompletedTrips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get sorted trips
exports.getSortedTrips = async (req, res) => {
  try {
    const userId = req.userId;
    const { sortBy } = req.query;
    const currentDate = new Date();

    let sortCriteria = {};

    if (sortBy === "startDate") {
      sortCriteria = { date: 1 };
    } else if (sortBy === "recentlyEdited") {
      sortCriteria = { updatedAt: -1 };
    } else if (sortBy === "recentlyCreated") {
      sortCriteria = { createdAt: -1 };
    } else {
      return res.status(400).json({
        error:
          "Invalid sortBy value. Use 'startDate', 'recentlyEdited', or 'recentlyCreated'.",
      });
    }

    const trips = await Trip.find({
      $or: [{ owner: userId }, { users: userId }],
      isCompleted: false,
    }).sort(sortCriteria);

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a trip by ID
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Share a trip */
exports.shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const shareableLink = `https://www.tripadvisor.com/trip/${trip._id}`;

    res.json({ shareableLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Join a trip
exports.joinTrip = async (req, res) => {
  try {
    const userId = req.userId;
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Prevent duplicate join
    if (trip.users.includes(userId)) {
      return res.status(400).json({ message: "User already joined" });
    }

    trip.users.push(userId);
    await trip.save();

    res.json({ message: "Joined trip successfully!", trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get users for a trip
exports.getTripUsers = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "users",
      "username email"
    );

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json({ users: trip.users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const { visibility, name, destination, date, description } = req.body;

    if (visibility && !["public", "restricted"].includes(visibility)) {
      return res
        .status(400)
        .json({
          error: "Invalid visibility option. Use 'public' or 'restricted'.",
        });
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { name, destination, date, description, visibility },
      { new: true }
    );

    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Duplicate a trip
exports.duplicateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const newTrip = new Trip({
      name: "Copy of " + trip.name,
      destination: trip.destination,
      date: trip.date,
      description: trip.description,
      visibility: trip.visibility,
      owner: req.userId,
      users: trip.users,
      isCompleted: trip.isCompleted,
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
