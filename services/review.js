const Review = require("../models/review");
const { updateHotelRating } = require("./reviewHelper");

const addReview = async (data) => {
  try {
    const review = new Review(data);
    await review.save();

    if (data.type === "Hotel") {
      await updateHotelRating(data.reference);
    }

    return review;
  } catch (err) {
    throw err;
  }
};

const getReviews = async (query) => {
  try {
    const reviews = await Review.find(query).populate("user");
    return reviews;
  } catch (err) {
    throw err;
  }
};

const deleteReview = async (userId, reviewId) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (review && review.type === "Hotel") {
      await updateHotelRating(review.reference);
    }

    return review;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addReview,
  getReviews,
  deleteReview,
};
