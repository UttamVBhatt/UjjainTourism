const mongoose = require("mongoose");

const placesSchema = new mongoose.Schema({
  heading: String,
  images: [String],
  data: String,
  coordinates: [String],
});

placesMode.index({ heading: 1 });

const Places = mongoose.model("Places", placesSchema);

module.exports = Places;
