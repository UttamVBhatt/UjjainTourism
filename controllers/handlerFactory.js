const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/ApiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
      return next(new AppError("No such Doc found with that id", 400));
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newDoc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) {
      return next(new AppError("No such Document found with that id", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No such Document found with that id", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.hotelId) filter = { hotel: req.params.hotelId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .skip();

    const docs = await Model.find(features.query);

    res.status(200).json({
      totalHotels: docs.length,
      status: "success",
      docs,
    });
  });
