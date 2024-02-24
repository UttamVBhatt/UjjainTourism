const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const { promisify } = require("util");
const sendEmail = require("./../public/js/email");
const crypto = require("crypto");
const Email = require("./../public/js/email");

const jwt = require("jsonwebtoken");

// Signing JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
  });
};

// Sending Response along with cookie
const createSendToken = (user, status, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(status).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Signing up the user
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  console.log(newUser);
  const url = `${req.protocol}://${req.get("host")}/me/${newUser.id}`;

  const email = await new Email(newUser, url).sendWelcome();

  console.log(email);

  createSendToken(newUser, 201, res);
});

// Logging in the user...
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("Please provide valid email or password", 401));
  }

  createSendToken(user, 200, res);
});

// Logging out the user
exports.logOut = catchAsync(async (req, res, next) => {
  const token = "Logged Out";
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success", token });
});

// Checking whether a user is logged in or not
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token === "Logged Out") {
    return next(
      new AppError(
        "Please login to get the access\n or\n Signup if you are a new user",
        401
      )
    );
  }

  if (!token) {
    return next(
      new AppError(
        "Token doesn't exist, please login again or Signup if you're a new users",
        400
      )
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_STRING
  );

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError(
        "User belongs to that token doesn't exist, please login again",
        404
      )
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User had recently changed password, please login again",
        401
      )
    );
  }

  req.user = freshUser;
  next();
});

// Allowing only certain users to get a certain resourcee
exports.restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have access to this resource", 400));
    }
    next();
  });
};

// Updating the password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("+password");

  if (!(await user.comparePasswords(req.body.currentPassword, user.password))) {
    return next(new AppError("Please provide valid current password", 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
      if (token === "Logged Out") {
        return next();
      }

      if (!token) {
        return next();
      }
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_STRING
      );

      const freshUser = await User.findById(decoded.id);

      if (!freshUser) {
        return next();
      }

      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = freshUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

// Forgot And Reset password functionality.....

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("No any user find with this email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  // const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to :${resetURL}.\n If you didn't forget your password, please ignore this email`;

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return next(
      new AppError("Error sending email , please try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  (user.passwordConfirm = req.body.passwordConfirm),
    (user.passwordResetToken = undefined);
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 201, res);
});
