const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: String,
  author: String,
  image: String,
  audio: String,
});

songSchema.index({ name: 1 });

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
