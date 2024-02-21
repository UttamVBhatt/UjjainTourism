const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.message, err.stack);
  console.log("Uncaught Exception , Server is closing");
  process.exit(1);
});

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT;
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    dbName: "UjjainVisitors",
  })
  .then(() => console.log("Database is Connected"))
  .catch((err) => console.log(err));

process.on("unhandledRejection", (err) => {
  console.log(err.message, err.stack);
  console.log("Unhandled Rejection , Server is closing");
  server.close(() => {
    process.exit(1);
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
