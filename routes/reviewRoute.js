const express = require("express");

const router = express.Router({ mergeParams: true });

const reviewController = require("./../controllers/reviewController");

router
  .route("/write-reviews/:userId/:hotelId")
  .post(
    reviewController.checkingTheUserAndHotelId,
    reviewController.createReview
  );

router.route("/").get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getOneReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
