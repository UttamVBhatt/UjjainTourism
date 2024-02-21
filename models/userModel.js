const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    minlength: [3, "A name must contain atleast 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "You must provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email address"],
  },
  password: {
    type: String,
    required: [true, "You must provide password"],
    minlength: [8, "Password must contain atleast 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please fill up the password confirm field"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please fill up the role as user"],
    enum: {
      values: ["user", "admin", "owner"],
      message: "You can login as a user only",
    },
    default: "user",
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  likes: Array,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = function (
  requestedPassword,
  existedPassword
) {
  return bcrypt.compare(requestedPassword, existedPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.asswordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
