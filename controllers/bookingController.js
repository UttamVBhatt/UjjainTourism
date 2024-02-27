const Booking = require("./../models/bookingModel");
const handlerFactory = require("./handlerFactory");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.checkingTheHotelAndUserId = catchAsync(async (req, res, next) => {
  req.body.user = req.params.userId;
  req.body.hotel = req.params.hotelId;
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError("No user found with that id", 404));
  }
  req.body.name = user.name;
  req.body.email = user.email;
  next();
});

exports.getAllBookings = handlerFactory.getAll(Booking);
exports.getOneBooking = handlerFactory.getOne(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);
