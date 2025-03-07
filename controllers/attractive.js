const { getMaxListeners } = require("../models/attractive");
const attractiveService = require("../services/attractive");

const addAtractive = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      minAge,
      maxAge,
      groupSize,
      duration,
      language,
      timeOfDay,
      category,
      productCategories,
      destination,
      accessabilty,
    } = req.body;
    const files = req.files;

    const images = files.map((file) => file.path);

    const attractive = await attractiveService.createAtractive({
      title,
      description,
      images,
      price,
      minAge,
      maxAge,
      groupSize,
      duration,
      language,
      timeOfDay,
      category,
      productCategories,
      destination,
      accessabilty,
    });

    res.status(201).json(attractive);
  } catch (error) {
    next(error);
  }
};
const getAtractives = async (req, res, next) => {
  try {
    const { title,description } = req.query;
    const query = { $or: [] };
    if (title) {
      query.$or.push({ title: { $regex: title, $options: "i" } });
    }
    if(description){
      query.$or.push({ description: { $regex: description, $options: "i" } });
    }
    const atractives = await attractiveService.findAtractives(query);
    res.status(200).json(atractives);
  } catch (error) {
    next(error);
  }
};

const getAtractive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attractive = await attractiveService.findAtractiveById(id);

    res.status(200).json(attractive);
  } catch (error) {
    next(error);
  }
};
const filterAttractives = async (req, res, next) => {
    try {
        const { price ,category,productCategories ,timeOfDay,language,accessabilty} = req.query;
        const query = { $and: [] };
        if (category) {
            query.$and.push({ category: category});
        }
        if (productCategories){
            query.$and.push({ productCategories: { $in: productCategories } });
        }
       if (timeOfDay) {
            query.$and.push({ timeOfDay: { $in: timeOfDay } });
        }
        if (price) {
            query.$and.push({ price: { $lte: price } });
        }
        if (language) {
            query.$and.push({ language: { $in: language } });
        }
        if(accessabilty){
            query.$and.push({ accessabilty: { $in: accessabilty } });
        }
        const atractives = await attractiveService.findAtractives(query);
        res.status(200).json(atractives);
    } catch (error) {
        next(error);
    }
}
const getAtractivesInDestination = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const atractives = await attractiveService.findAtractives({
      destination: destinationId,
    });
    res.status(200).json(atractives);
  } catch (error) {
    next(error);
  }
};
const deleteAtractive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attractive = await attractiveService.deleteAtractive(id);
    res.status(200).json(attractive);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAtractive,
  getAtractives,
  getAtractive,
  getAtractivesInDestination,
  deleteAtractive,
  filterAttractives,
};
