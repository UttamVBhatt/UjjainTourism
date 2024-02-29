const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "You must write something as a review"],
    minlength: [3, "Review must contain atleast 3 characters"],
  },
  rating: {
    type: Number,
    min: [1, "Rating should be atleast 1"],
    max: [5, "Rating should be less than 5"],
    required: [true, "You must give some rating"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please give the id of the user"],
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: [true, "Please give the id of the hotel"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  }).populate({
    path: "hotel",
    select: "name image slug",
  });
  next();
});

reviewSchema.index({ review: 1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
