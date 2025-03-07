const DestinationModel = require("../models/destination");

const postDestination = async (req, res) => {
  try {
    const {
      name,
      region,
      country,
      description,
      attractions = [],
      bestTimeToVisit,
      activities = [],
    } = req.body;

   

    if (!name || !region || !country || !req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing required fields or images" });
    }

    const port = process.env.PORT || 5000;
    const hostname = process.env.HOSTNAME || "http://localhost";

    const imageUrls = req.files.map(
      (file) => `${hostname}:${port}/uploads/${file.filename}`
    );

    const newDestination = await DestinationModel.create({
      name,
      region,
      country,
      description,
      images: imageUrls,
      attractions,
      bestTimeToVisit,
      activities,
    });

    return res
      .status(201)
      .json({
        message: "Destination created successfully",
        destination: newDestination,
      });
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllDestinations = async (_, res) => {
  try {
    const destinations = await DestinationModel.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await DestinationModel.findById(id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    return res
      .status(200)
      .json({ message: "success to get specific destination ", destination });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDestination = await DestinationModel.findByIdAndUpdate(id,{ $set: req.body },{ new: true, runValidators: true });

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    return res
      .status(200)
      .json({
        message: "Destination updated successfully",
        destination: updatedDestination,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDestination = await DestinationModel.findByIdAndDelete(id);

    if (!deletedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    return res
      .status(200)
      .json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  postDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
