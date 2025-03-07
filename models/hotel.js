const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    languagesSpoken: { type: [String], required: true },
    images: [{ type: String, required: true }],
    pricePerNight: { type: Number, required: true },
    emailHotel: {
      type: String,
    },
    contactHotel: {
      type: String,
    },
    HotelLink: {
      type: String,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    hotelStyle: { type: [String], default: [], required: true },

   
    cancellationDeadline: { type: Date, required: false },

    rooms: [
      {
        type: { type: String, enum: ["Single", "Double"], required: true },
        maxAdults: { type: Number, required: true },
        maxChildren: { type: Number, required: true },
        bookedDates: [
          {
            checkInDate: {
              type: Date,
            },
            checkOutDate: {
              type: Date,
            },
          },
        ],
      },
    ],

    ///////////////////////////ref to feature
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature",
        required: true,
      },
    ],

    ///////////////////////ref to  Destination
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    ///////////////////////////ref to review
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },

    ranking: {
      position: { type: Number, default: 0 },
      totalHotels: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);


HotelSchema.index({ location: "2dsphere" });

const HotelModel= mongoose.model("Hotel", HotelSchema);
module.exports = HotelModel;
