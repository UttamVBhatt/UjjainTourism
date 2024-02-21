const mongoose = require("mongoose");

const placesSchema = new mongoose.Schema({
  heading: String,
  images: [String],
  data: String,
  coordinates: [String],
});

const Places = mongoose.model("Places", placesSchema);

module.exports = Places;
