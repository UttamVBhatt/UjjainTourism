const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Importing Models
const Home = require("./models/homeModel");
const Places = require("./models/placesModel");
const Hidden = require("./models/hiddenModel");
const Hotel = require("./models/hotelModel");
const Song = require("./models/songModel");

// Importing Variables
const port = process.env.PORT;
const DB = process.env.DATABASE;

const fs = require("fs");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(DB, {
    dbName: "UjjainVisitors",
  })
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err));

// const homeData = JSON.parse(fs.readFileSync("./data/home-data.json"));
const placesData = JSON.parse(fs.readFileSync("./data/places.json"));
// const hiddenData = JSON.parse(fs.readFileSync("./data/hidden.json"));
// const hotelData = JSON.parse(fs.readFileSync("./data/hotels.json"));
// const songData = JSON.parse(fs.readFileSync("./data/songs.json"));

const importData = async () => {
  try {
    // await Home.create(homeData);
    await Places.create(placesData);
    // await Hidden.create(hiddenData);
    // await Hotel.create(hotelData);
    // await Song.create(songData);
    console.log("Data Successfully Loaded");
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    // await Song.deleteMany();
    // await Hotel.deleteMany();
    await Places.deleteMany();
    console.log("Data Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
};

importData();
// deleteData();
