const mongoose = require("mongoose");
const { Schema } = mongoose;
const { updateHotelRating } = require("../services/reviewHelper");
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Destination", "Hotel", "Restaurant", "Atractive"],
      required: true,
    },
    reference: {
      type: Schema.Types.ObjectId,
      refPath: "type",
      // type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },

    when: {
      type: Date,
      required: true,
    },
    who: {
      type: String,
      enum: ["Solo", "Family", "Friends", "Couple"],
      required: true,
    },
    photos: {
      type: [
        {
          uri: String,
          caption: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);


reviewSchema.pre("save", async function () {
  if (this.type === "Hotel") {
    // console.log("hi test save");
    await updateHotelRating(this.reference);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.type === "Hotel") {
    await updateHotelRating(doc.reference);
  }
});



const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel;
