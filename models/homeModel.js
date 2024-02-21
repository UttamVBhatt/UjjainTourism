const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
  heading: String,
  image: String,
  data: String,
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
