const FeatureModel = require("../models/feature");

const postFeature = async (req, res) => {
  try {
    const { featureName, type } = req.body;

    if (!featureName || !type) {
      return res.status(400).json({ message: "Feature name and type are required" });
    }
   
    if (!["propertyAmenitiesc", "roomFeatures", "roomTypes"].includes(type)) {
      return res.status(400).json({message:"Invalid type. Allowed types: propertyAmenitiesc, roomFeatures, roomTypes",});
    }

    
    const newFeature = await FeatureModel.create({ featureName, type });
    res.status(201).json({message: "Feature created successfully",feature: newFeature,});
  } catch (error) {
    console.error("Error creating feature:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllFeatures = async (_, res) => {
  try {
    const Features = await FeatureModel.find();
    res.status(200).json(Features);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


module.exports = { postFeature, getAllFeatures };
