const Flight = require("../models/flight");

const createFlight = async (data) => {
  try {
    const flight = new Flight(data);
    await flight.save();
    return flight;
  } catch (err) {
    throw err;
  }
};

const findFlights = async (query) => {
  try {
    const flights = await Flight.find(query);
    return flights;
  } catch (err) {
    throw err;
  }
};
const findFlightById = async (id) => {
  try {
    const flight = await Flight.findById(id);
    return flight;
  } catch (err) {
    throw err;
  }
};

const deleteFlight = async (id) => {
  try {
    const flight = await Flight.findByIdAndDelete(id);
    return flight;
  } catch (err) {
    throw err;
  }
};

const editFlight = async (id, data) => {
  try {
    const flight = await Flight.findByIdAndUpdate(id, data);
    return flight;
  } catch (err) {
    throw err;
  }
};

const chickAvailability = async (id, query) => {
  try {
    const flight = await findFlightById(id);
    const seatData = flight.seats.find((s) => s.seatType == query.type);
    if (!seatData) {
     return {isAvailable:false,message:'There is no seat of this type'}
    }
    const isAvailable =
      seatData &&
      seatData.seatNumber - seatData.bookedSeats >= query.numberOfSeats;
    return {isAvailable};
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createFlight,
  findFlights,
  deleteFlight,
  findFlightById,
  editFlight,
  chickAvailability,
};
