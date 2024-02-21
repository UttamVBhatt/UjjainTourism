const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/ApiFeatures");
const Review = require("./../models/reviewModel");
const User = require("../models/userModel");
const Hotel = require("../models/hotelModel");

////////////////////////////////
// API Controllers
//////////////////////////////////

exports.getAPIData = (Model) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.find();

    res.status(200).json({
      status: "success",
      data,
    });
  });
};

////////////////////////////
// Getting Data Controllers
//////////////////////////

exports.gettingData = (Model, template, title) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.find();

    res.status(200).render(template, {
      title,
      data,
    });
  });
};

////////////////////////////////////////////////
// Rendering Maps and Authentications Templates
//////////////////////////////////////////////

exports.gettingMapAndAuthentication = (template, title) => {
  return catchAsync(async (req, res, next) => {
    res.status(200).render(template, {
      title,
    });
  });
};

//////////////////////////////////
// Rendering All Hotels Templates
////////////////////////////////
exports.filters = (Model, filters, title) => {
  return catchAsync(async (req, res, next) => {
    const filterHotels = await Model.find(filters);

    filterHotels.user = req.user;

    res.status(200).render("oneHotel", {
      title,
      filterHotels,
    });
  });
};

exports.topFive = (Model, title) => {
  return catchAsync(async (req, res, next) => {
    const hotels = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .skip()
      .fields();

    const filterHotels = await hotels.query;

    filterHotels.user = req.user;

    res.status(200).render("oneHotel", {
      title,
      filterHotels,
    });
  });
};

exports.getOneHotel = (Model) => {
  return catchAsync(async (req, res, next) => {
    const hotel = await Model.find({ slug: req.params.slug });

    const reviews = await Review.find();

    let reviewObj = [];

    Object.keys(reviews).forEach((el, i) => {
      if (reviews[el].hotel.slug === req.params.slug) {
        hotelReview = reviews[el].review;
        userName = reviews[el].user.name;
        userImage = reviews[el].user.photo;

        const newObj = {
          hotelReview: hotelReview,
          userName: userName,
          userImage: userImage,
        };

        reviewObj.push(newObj);
      }
    });

    hotel.reviews = reviewObj;
    let user = req.user;

    res.status(200).render("perHotel", {
      title: req.params.slug,
      hotel,
      user,
    });
  });
};

//////////////////////////////////
// Rendering All Users Templates
////////////////////////////////

exports.getMe = (Model) => {
  return catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.params.userId);

    res.status(200).render("account", {
      title: "Your Account",
      user,
    });
  });
};

///////////////////////////////////////
///Gettign Reviews for one user //////
/////////////////////////////////////

exports.gettingReviewsForOneUser = (Model) => {
  return catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.params.userId);
    const review = await Review.find();

    let userReview;
    let hotelName;
    let hotelImage;

    let reviewObj = [];

    Object.keys(review).forEach((el) => {
      if (review[el].user && review[el].user.id === user.id) {
        const newObj = {
          userReview: review[el].review,
          hotelName: review[el].hotel.name,
          hotelImage: review[el].hotel.image,
          id: review[el].id,
        };

        reviewObj.push(newObj);
      }
    });

    user.reviews = reviewObj;

    res.status(200).render("user-filter", {
      title: "My Reviews",
      user,
    });
  });
};

///////////////////////////////////////
///Gettign Bookings for one user /////
/////////////////////////////////////

exports.gettingBookingsForOneUser = (Model, Booking) => {
  return catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.params.userId);
    const bookings = await Booking.find();

    let hotelName;
    let hotelImage;
    let bookingDate;

    let bookingsObj = [];

    Object.keys(bookings).forEach((el) => {
      if (bookings[el].user && bookings[el].user.id === user.id) {
        const newObj = {
          hotelName: bookings[el].hotel.name,
          hotelImage: bookings[el].hotel.image,
          bookingDate: bookings[el].date,
          address: bookings[el].hotel.address,
          summary: bookings[el].hotel.summary,
          price: bookings[el].hotel.price,
          ratings: bookings[el].hotel.ratings,
          slug: bookings[el].hotel.slug,
          hotelId: bookings[el].hotel.id,
          id: bookings[el].id,
        };

        bookingsObj.push(newObj);
      }
    });

    user.bookings = bookingsObj;

    res.status(200).render("bookings", {
      title: "My Bookings",
      user,
    });
  });
};

///////////////////////////////////////////////
///// Gettign liked Hotels for one user //////
/////////////////////////////////////////////

exports.getLikedHotels = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const hotels = await Hotel.find();

  let hotelName;
  let address;
  let summary;
  let price;
  let ratings;

  let hotelObj = [];

  for (let i = 0; i < hotels.length; i++) {
    if (user.likes.includes(hotels[i].id)) {
      const newHotel = {
        hotelName: hotels[i].name,
        address: hotels[i].address,
        summary: hotels[i].summary,
        price: hotels[i].price,
        ratings: hotels[i].ratings,
        slug: hotels[i].slug,
        id: hotels[i].id,
      };

      hotelObj.push(newHotel);
    }
  }
  user.hotels = hotelObj;

  res.status(200).render("likes", {
    title: "My Liked Hotels",
    user,
  });
});

exports.likeUnlike = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const hotelId = await req.params.hotelId;

  if (user.likes.includes(hotelId)) {
    const index = user.likes.indexOf(hotelId);

    user.likes.splice(index, 1);

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Unliked",
    });
  } else {
    user.likes.push(hotelId);

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Liked",
    });
  }
});
