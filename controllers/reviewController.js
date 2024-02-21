const Review = require("./../models/reviewModel");
const handlerFactory = require("./handlerFactory");

exports.checkingTheUserAndHotelId = (req, res, next) => {
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  if (!req.body.user) req.body.user = req.params.userId;
  next();
};

exports.deleteReview = handlerFactory.deleteOne(Review);
exports.createReview = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);
exports.getOneReview = handlerFactory.getOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
