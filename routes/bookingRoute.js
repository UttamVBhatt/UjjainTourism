const express = require("express");

const bookingController = require("./../controllers/bookingController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();

router.route("/").get(bookingController.getAllBookings);

router
  .route("/book-hotel/:hotelId/:userId")
  .post(
    bookingController.checkingTheHotelAndUserId,
    bookingController.createBooking
  );

router
  .route("/:id")
  .get(bookingController.getOneBooking)
  .patch(
    reviewController.checkingTheUserAndHotelId,
    bookingController.updateBooking
  )
  .delete(bookingController.deleteBooking);

module.exports = router;
