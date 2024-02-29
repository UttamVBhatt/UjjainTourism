const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  heading: String,
  image: String,
  data: String,
});

homeSchema.index({ heading: 1 });

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
