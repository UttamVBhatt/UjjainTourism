const AppError = require("./../utils/appError");

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.log("Error in Rendering Part", err);
  return res.status(err.statusCode).render("error", {
    title: "Error",
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      return res.status(err.statusCode).render("error", {
        title: "error",
        message: err.message,
      });
    }
    console.log("ERROR", err);
    console.log(err.stack);
    return res.status(err.statusCode).json({
      status: "ERROR",
      message: "Something went very wrong",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: err.message,
    });
  }

  console.log("ERROR", err);
  return res.status(500).render("error", {
    title: "Something went very wrong",
    message: "Please try again later...",
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const duplicateField = err.KeyValue.name;
  const message = `This ${duplicateField} is a duplicate Field please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${value}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError(`Invalid Token please login`, 401);

const handleTokenExpiredError = () =>
  new AppError("Your token has been expired, please login again", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  }
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.message) error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
