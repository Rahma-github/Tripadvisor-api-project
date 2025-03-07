const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    destination: { type: String, required: true },
    date: { type: Date },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["public", "restricted"],
      default: "restricted",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;