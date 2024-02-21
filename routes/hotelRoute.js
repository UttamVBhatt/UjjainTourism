const express = require("express");

const router = express.Router();

const hotelController = require("./../controllers/hotelController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoute");

router.use("/:hotelId/reviews", reviewRouter);
router.use(authController.protect);

router
  .route("/")
  .get(hotelController.getAllHotels)
  .post(authController.restrictTo("admin"), hotelController.createHotel);

router
  .route("/top-5-hotels")
  .get(hotelController.getTopFiveHotels, hotelController.getAllHotels);

router
  .route("/:id")
  .get(hotelController.getOneHotel)
  .delete(authController.restrictTo("admin"), hotelController.deleteHotel)
  .patch(authController.restrictTo("admin"), hotelController.updateHotel);

module.exports = router;
