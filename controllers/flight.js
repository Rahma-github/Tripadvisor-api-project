const flightService = require("../services/flight");

//add new flight
const addFlight = async (req, res, next) => {
  try {
    const {
      flightNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
      airline,
      flightDuration,
      seats,
    } = req.body;

    const flight = await flightService.createFlight({
      flightNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
      airline,
      flightDuration,
      seats,
    });

    res.status(200).json(flight);
  } catch (err) {
    next(err);
  }
};

//filter flights
const filterFlights = async (req, res, next) => {
  try {
    const { origin, destination, departingDate, returningDate } = req.body;
    let query = { $and: [] };
    if (origin) {
      query.$and.push({ origin: origin });
    }
    if (destination) {
      query.$and.push({ destination: destination });
    }
    // test it
    if (departingDate || returningDate) {
      query.$and.push({
        $or: [
          { departureDate: departingDate },
          { departureDate: returningDate },
        ],
      });
    }
    // if (!query.$and.length) query = undefined;
    const flights =await flightService.findFlights(query);
    res.status(200).json(flights);
  } catch (err) {
    next(err);
  }
};
//get flight by Id
const getFlight = async (req, res, next) => {
  try {
    const { id } = req.params;

    const flight = await flightService.findFlightById(id);

    res.status(200).json(flight);
  } catch (err) {
    next(err);
  }
};

//delete flights
const deleteFlight = async (req, res, next) => {
  try {
    const { id } = req.params;

    const flight = await flightService.deleteFlight(id);

    res.status(200).json(flight);
  } catch (err) {
    next(err);
  }
};

//edit flights
const editFlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      flightNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
      airline,
      flightDuration,
      seats,
    } = req.body;

    const updateData = {
      flightNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
      airline,
      flightDuration,
      seats,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const flight = await flightService.editFlight(id, updateData);

    res.status(200).json(flight);
  } catch (err) {
    next(err);
  }
};
//chick Availability

const chickAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, numberOfSeats } = req.query;

    const available = await flightService.chickAvailability(id, {
      type,
      numberOfSeats,
    });

    res.status(200).json(available);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addFlight,
  filterFlights,
  getFlight,
  deleteFlight,
  editFlight,
  chickAvailability,
};
