const express = require("express");

const router = express.Router();

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const reviewRouter = require("./../routes/reviewRoute");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

// router.use(authController.protect);

router.get("/logout", authController.logOut);
router.patch("/updatepassword/:userId", authController.updatePassword);
router.patch(
  "/updateMe/:userId",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.get("/me", userController.getMe, userController.getOneUser);

authController.restrictTo("admin");

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
