const { query } = require("express");
const Attractive = require("../models/attractive");

const createAtractive = async (data) => {
  try {
    const newAttractive = new Attractive(data);
    await newAttractive.save();
    return newAttractive;
  } catch (error) {
    throw error;
  }
};

const findAtractives = async (query) => {
  try {
    const atractives = await Attractive.find(query);
    return atractives;
  } catch (error) {
    throw error;
  }
};
const findAtractive = async (query) => {
  try {
    const atractive = await Attractive.findOne(query)
      .populate("destination")
      .exec();
    return atractive;
  } catch (error) {
    throw error;
  }
};

const findAtractiveById = async (id) => {
  try {
    const atractive = await Attractive.findById(id)
      .populate("destination")
      .exec();
    return atractive;
  } catch (error) {
    throw error;
  }
};
const deleteAtractive = async (id) => {
  try {
    const atractive = await Attractive.findByIdAndDelete(id);
    return atractive;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createAtractive,
  findAtractives,
  findAtractive,
  findAtractiveById,
  deleteAtractive
};
