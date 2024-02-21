const catchAsync = require("../utils/catchAsync");
const Booking = require("./../models/bookingModel");
const handlerFactory = require("./handlerFactory");

exports.checkingTheHotelAndUserId = (req, res, next) => {
  req.body.user = req.params.userId;
  req.body.hotel = req.params.hotelId;
  next();
};

exports.getAllBookings = handlerFactory.getAll(Booking);
exports.getOneBooking = handlerFactory.getOne(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);
