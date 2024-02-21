const catchAsync = require("../utils/catchAsync");
const Hotel = require("./../models/hotelModel");
const handlerFactory = require("./handlerFactory");

exports.getTopFiveHotels = catchAsync(async (req, res, next) => {
  req.query.sort = "-ratings";
  req.query.limit = "5";
  next();
});

exports.deleteHotel = handlerFactory.deleteOne(Hotel);
exports.createHotel = handlerFactory.createOne(Hotel);
exports.updateHotel = handlerFactory.updateOne(Hotel);
exports.getOneHotel = handlerFactory.getOne(Hotel, "reviews");
exports.getAllHotels = handlerFactory.getAll(Hotel);
