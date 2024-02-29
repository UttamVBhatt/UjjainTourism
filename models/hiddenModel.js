const mongoose = require("mongoose");

const hiddenSchema = new mongoose.Schema({
  heading: String,
  images: [String],
  data: String,
  coordinates: [String],
});

hiddenSchema.index({ heading: 1 });

const Hidden = mongoose.model("Hidden", hiddenSchema);

module.exports = Hidden;
