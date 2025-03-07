const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    cover: {
      type: String,
    },
    currentCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
    followers: {
      type: {
        counter: Number,
        userId: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    },
    following: {
      type: {
        counter: Number,
        userId: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    },
    trips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
  });

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
