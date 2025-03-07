const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required:true,
  },
  type: {
    type: String,
    enum: ["propertyAmenitiesc", "roomFeatures","roomTypes"],
    required: true,
  },
});


const FeatureModel= mongoose.model("Feature", FeatureSchema);
module.exports = FeatureModel;