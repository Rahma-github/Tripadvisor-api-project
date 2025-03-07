const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String },
    images: [{ type: String, required: true }],
    attractions: [{ type: String }],
    bestTimeToVisit: { type: String },
    activities: [{ type: String }],
  },
  { timestamps: true }
);

const  DestinationModel= mongoose.model("Destination", DestinationSchema);
module.exports = DestinationModel;