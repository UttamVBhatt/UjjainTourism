const express = require("express");
const app = express();

// Requiring Built-in Module
const path = require("path");

// Requiring various Routers
const viewRouter = require("./routes/viewRoute");
const hotelRouter = require("./routes/hotelRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");
const bookingRouter = require("./routes/bookingRoute");

// Requiring Utilities
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorHandler");

// Requiring Important Headers
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Using all important Headers
app.use("/api", helmet());
app.use(express.json());
app.use(cookieParser());
app.use(expressMongoSanitize());
app.use(xssClean());
app.use(
  hpp({
    whitelist: ["price", "ratings"],
  })
);
app.use(cors());
app.options("*", cors());

// Setting up the view engine and views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static Files
app.use(express.static(`${__dirname}/public`));

// Setting up routes for simultaneous Routers
app.use("/", viewRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

// Handling Error for incorrect URL
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Using the global Error Handler
app.use(globalErrorHandler);

module.exports = app;
