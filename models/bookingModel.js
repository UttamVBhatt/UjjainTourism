const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    minlength: [3, "A name must contain atleast 3 characters"],
  },
  callingNumber: {
    type: Number,
    minlength: [10, "Your number should have atleast 10 in numbers"],
    maxlength: [10, "Your number should not be greater than 10"],
    required: [true, "You must provide your calling number"],
  },
  whatsappNumber: {
    type: Number,
    minlength: [10, "Your number should have atleast 10 in numbers"],
    maxlength: [10, "Your number should not be greater than 10"],
    required: [true, "You must provide your whatsapp number"],
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "You must provide date"],
  },
  noOfDaysToStay: {
    type: Number,
    min: [1, "Number of staying days should be atleast 1 day"],
    max: [2, "Sorry, you can't book hotels for more than 2 days"],
    required: [true, "You must provide valid number of days"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide the id of the user"],
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: [true, "Please provide the id of the desired booking hotel"],
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hotel",
    select: "name image address summary price ratings slug",
  }).populate({
    path: "user",
    select: "name image id",
  });
  next();
});

const Booking = new mongoose.model("Booking", bookingSchema);

module.exports = Booking;
