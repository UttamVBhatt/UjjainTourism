const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const handlerFactory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for updating passwords", 400));
  }

  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

  const filteredBody = filterObj(req.body, "name", "email");

  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.userId,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/////////////// Uploading User's Photo /////////////////

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.params.userId}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/userImages/${req.file.filename}`);

  next();
});

exports.uploadUserPhoto = upload.single("photo");

exports.deleteUser = handlerFactory.deleteOne(User);
exports.createUser = handlerFactory.createOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.getOneUser = handlerFactory.getOne(User);
exports.getAllUsers = handlerFactory.getAll(User);
