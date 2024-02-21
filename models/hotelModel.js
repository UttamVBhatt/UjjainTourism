const mongoose = require("mongoose");
const slugify = require("slugify");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "A name must have atleast 3characters"],
      required: [true, "A Hotel must have a name"],
    },
    slug: String,
    Description: {
      type: String,
      required: [true, "You must provide some description about your hotel"],
    },
    summary: {
      type: String,
      required: [
        true,
        "A Hotel should have a summary about it , explaining the features of the hotel",
      ],
    },
    price: {
      type: Number,
      min: [100, "Your hotel's price must be atleast 100"],
      required: [true, "You must provide the price of your hotel"],
      default: 100,
    },
    address: {
      type: String,
      required: [true, "You must give the address of your hotel"],
    },
    ratings: {
      type: Number,
      min: [1, "Rating must be atleast 1"],
      max: [5, "Rating should not be greater than 5"],
      default: 1,
    },
    availability: String,
    services: {
      type: [String],
      default: "No Services are Available",
    },
    serviceAvailability: [String],
    acAvailability: Boolean,
    nearMahakal: Boolean,
    perPerson: Number,
    image: {
      type: String,
      required: [true, "Please give the image of your hotel"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hotelSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

hotelSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "hotel",
  localField: "_id",
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
