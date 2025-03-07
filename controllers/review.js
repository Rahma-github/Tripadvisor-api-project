const reviewService = require("../services/review");

const addReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, description, type, reference, rating, when, who, captions } =
      req.body;

    // get photos
    let photos = [];
    if (req.files) {
      req.files.forEach((file, index) => {
        photos.push({ uri: file.path, caption: captions[index] });
      });
    }

    // Add post
    const review = await reviewService.addReview({
      user: userId,
      title,
      description,
      type,
      reference,
      rating,
      when,
      who,
      photos,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
  
    const userId = req.userId;
    console.log('lol')

    const reviews = await reviewService.getReviews({user:userId});

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const {type,reference} = req.params;
    const reviews = await reviewService.getReviews({type,reference});

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};


const deleteReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.id;

    const review = await reviewService.deleteReview(userId, reviewId);

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addReview,
  getReviews,
  deleteReview,
  getUserReviews
};
