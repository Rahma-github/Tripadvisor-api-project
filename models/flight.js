const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flightSchema = new Schema(
  {
    flightNumber: { type: String, required: true },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    airline: { type: String, required: true },
    flightDuration: { type: Number, required: true },
    seats: {
      type: [
        {
          seatNumber: { type: String, required: true },
          seatType: { type: String, required: true },
          price: { type: Number, required: true },
          currency: { type: String, required: true },
          bookedSeats: { type: Number, required: true,default:0},
        },
      ],
      required: true,
      default:[]
    },
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;
