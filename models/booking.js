const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  leadTraveler: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  traveler2: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        var re = /\S+@\S+\.\S+/;
        return re.test(v);
      },
      message: "Invalid email format",
    },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Hotel","Restaurant","Flight","Trip"],
    required: true,
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type",
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ["Credit/Debit Card", "PayPal", "Google Pay"],
      required: true,
    },
  },
});


const BookingModel = mongoose.model("Booking", BookingSchema);
module.exports = BookingModel;
