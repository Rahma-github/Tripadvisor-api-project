const mongoose = require("mongoose");
const { Schema } = mongoose;

const attractiveSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    minAge: {
      type: Number,
      required: true,
    },
    maxAge: {
      type: Number,
      required: true,
    },
    groupSize: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      unqiue: true,
      // required: true,
    },
    language: {
      type: [String],
      required: true,
    },
    timeOfDay: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "adventure",
        "cultural",
        "historical",
        "culinary",
        "nature",
        "shopping",
        "beach",
        "nightlife",
        "wellness",
        "family",
      ],
      required: true,
    },
    productCategories: {
      type: [String],
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    accessabilty: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

attractiveSchema.pre("save", async function (next) {
  // Generate a random 9-digit code
  const generateCode = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  // Ensure the code is unique
  let code = generateCode();
  let isUnique = false;

  while (!isUnique) {
    const existingAttractive = await mongoose.models.Attractive.findOne({
      code,
    });
    if (!existingAttractive) {
      isUnique = true;
    } else {
      code = generateCode();
    }
  }

  this.code = code;
  next();
});

const Attractive = mongoose.model("Attractive", attractiveSchema);
module.exports = Attractive;
