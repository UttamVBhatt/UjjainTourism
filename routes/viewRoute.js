const express = require("express");
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const hotelController = require("./../controllers/hotelController");
const userController = require("./../controllers/userController");

const router = express.Router();

// Importing Models
const Home = require("./../models/homeModel");
const Songs = require("./../models/songModel");
const Hotel = require("./../models/hotelModel");
const Places = require("./../models/placesModel");
const Hidden = require("./../models/hiddenModel");
const User = require("./../models/userModel");
const Booking = require("./../models/bookingModel");

router.use(authController.isLoggedIn);

/////////////////////
// Main Route Pages
///////////////////

router.route("/me/:userId").get(viewController.getMe(User));

router
  .route("/")
  .get(
    authController.isLoggedIn,
    viewController.gettingData(Home, "home", "Ujjain's Significance")
  );
router
  .route("/songs")
  .get(
    authController.protect,
    viewController.gettingData(Songs, "songs", "Songs")
  );
router
  .route("/places")
  .get(
    authController.protect,
    viewController.gettingData(Places, "places", "Places to Visit")
  );
router
  .route("/hidden")
  .get(
    authController.protect,
    viewController.gettingData(Hidden, "hidden", "Hidden Places of Ujjain")
  );
router
  .route("/hotels")
  .get(authController.protect, viewController.filters(Hotel, {}, "hotels"));

///////////////////////
// Hotel Filter Routes
/////////////////////

router
  .route("/hotels/AC")
  .get(
    authController.protect,
    viewController.filters(Hotel, { acAvailability: true }, "AC Hotels")
  );
router
  .route("/hotels/Non-AC")
  .get(
    authController.protect,
    viewController.filters(Hotel, { acAvailability: false }, "Non AC Hotels")
  );
router
  .route("/hotels/AC-near-mahakal")
  .get(
    authController.protect,
    viewController.filters(
      Hotel,
      { nearMahakal: true, acAvailability: true },
      "AC Near Mahakal"
    )
  );
router
  .route("/hotels/Non-AC-near-mahakal")
  .get(
    authController.protect,
    viewController.filters(
      Hotel,
      { acAvailability: false, nearMahakal: true },
      "Non AC Near Mahakal"
    )
  );
router
  .route("/hotels/available")
  .get(
    authController.protect,
    viewController.filters(
      Hotel,
      { availability: "Available" },
      "Available Hotels"
    )
  );

router
  .route("/hotels/top-5-hotels")
  .get(
    authController.protect,
    hotelController.getTopFiveHotels,
    viewController.topFive(Hotel, "Top-5-Hotels")
  );

router
  .route("/hotels/:slug")
  .get(authController.protect, viewController.getOneHotel(Hotel));

//////////////////////////////////
// Map And Authentication Routes
///////////////////////////////
router
  .route("/placesMap")
  .get(
    viewController.gettingMapAndAuthentication("placesMap", "All Locations")
  );
router
  .route("/hiddenMap")
  .get(
    viewController.gettingMapAndAuthentication("hiddenMap", "All Locations")
  );

router
  .route("/signup")
  .get(
    viewController.gettingMapAndAuthentication("signup", "Create New Account")
  );

router
  .route("/book-form/:hotelId/:userId")
  .get(
    authController.protect,
    viewController.gettingMapAndAuthentication("bookForm", "Book Hotel Now")
  );

router
  .route("/login")
  .get(
    viewController.gettingMapAndAuthentication(
      "login",
      "Log in to your account"
    )
  );

//////////////////////////////
//// Filtering for users ////
////////////////////////////

router
  .route("/me/:userId/reviews")
  .get(viewController.gettingReviewsForOneUser(User));

router
  .route("/me/:userId/bookings")
  .get(viewController.gettingBookingsForOneUser(User, Booking));

router
  .route("/hotels/write-reviews/:userId/:hotelId")
  .get(
    viewController.gettingMapAndAuthentication(
      "writeReview",
      "Write Your Review"
    )
  );

router.route("/me/:userId/liked-hotels").get(viewController.getLikedHotels);

/////////////////////////////////////////
/////// Updating User's Picture ////////
///////////////////////////////////////

/////////////////////////////////////
//// Adding and removing hotels ////
///////////////////////////////////

router.route("/added/:hotelId/:userId").patch(viewController.likeUnlike);

//////////////
// API Routes
////////////

router.route("/placesAPI").get(viewController.getAPIData(Places));
router.route("/hiddenAPI").get(viewController.getAPIData(Hidden));

module.exports = router;
