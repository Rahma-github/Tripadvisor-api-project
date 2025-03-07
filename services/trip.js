const Trip = require("../models/trip");

// Create a new trip
const createTrip = async (data)=>{
    try{
        const newTrip = new Trip(data);
        await newTrip.save();
        return newTrip;
    }catch(error){throw error}
}

const findTrips = async (query)=>{
    try{
        const trips = await Trip.find(query);
        return trips;
    }catch(error){throw error}
}

module.exports = {
    createTrip,
    findTrips
}