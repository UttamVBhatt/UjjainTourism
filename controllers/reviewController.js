const Review = require("./../models/reviewModel");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.checkingTheUserAndHotelId = (req, res, next) => {
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  if (!req.body.user) req.body.user = req.params.userId;
  next();
};

exports.checkingTheAleradyWrittenReview = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const hotelId = req.params.hotelId;
  const reviews = await Review.find();
  Object.values(reviews).map((el) => {
    if (el.hotel.id === hotelId && el.user.id === userId) {
      return next(new AppError("You can only write one review on a hotel"));
    }
  });
  next();
});

exports.deleteReview = handlerFactory.deleteOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.getOneReview = handlerFactory.getOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
