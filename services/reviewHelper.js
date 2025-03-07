const Hotel = require("../models/hotel");

const updateHotelRating = async (hotelId) => {
  try {
    const ReviewModel = require("../models/review"); //  Fix circular dependency

    const reviews = await ReviewModel.find({ reference: hotelId });
    const totalReviews = reviews.length;

    const averageReviews =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    
    await Hotel.findByIdAndUpdate(hotelId, {
      totalReviews,
      averageRating:averageReviews,
    });

    console.log(`Updated Hotel ${hotelId}:`, { totalReviews,averageRating: averageReviews });
  } catch (error) {
    console.error("Error updating hotel rating:", error);
    throw error
  }
};

module.exports = { updateHotelRating };
