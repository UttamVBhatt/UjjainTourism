"use-strict";

/////////////////  NAV - BAR ///////////////////
const btnDiv = document.querySelector(".divbtn");
const menuUl = document.querySelector(".menu");
const hamburger = document.querySelector(".hamburger");

function toggleActive() {
  menuUl.classList.toggle("active");
  btnDiv.classList.toggle("active");
  hamburger.classList.toggle("newHamburger");
}
hamburger.addEventListener("click", function () {
  toggleActive();
});

const navLinks = document.querySelectorAll(".navLinks");
for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", () => {
    navLinks[i].classList.toggle("yellow");
    toggleActive();
  });
}

const footerLinks = document.querySelectorAll("footer .tf a");

for (let i = 0; i < footerLinks.length; i++) {
  footerLinks[i].addEventListener("click", () => {
    footerLinks[i].classList.toggle("yellow");
    footerLinks[i].parentElement.childNodes.forEach((el) =>
      el.classList.toggle("yellow")
    );
  });
}

////// Showing Alerts //////

const showAlert = (type, msg) => {
  hideBookingAlert();
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 3000);
};

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

////// Login And SignUp //////

const urlForRouting = window.location.href.split("/");
let paraForRouting = urlForRouting[urlForRouting.length - 1];

/////// Setting Log out Button's display for account /filter routes ////////

if (
  urlForRouting[3] === "me" ||
  urlForRouting[4] === "write-reviews" ||
  urlForRouting[3] === "songs" ||
  urlForRouting[3] === "hotels" ||
  urlForRouting[3] === "book-form"
) {
  const logOutBtn = document.querySelector("span.log-out");
  logOutBtn.style.display = "none";
}

const signUpForm = document.querySelector(".signup-form");
const loginForm = document.querySelector(".login-form");
const logOutBtn = document.querySelector(".log-out");

const updatePasswordBtn = document.querySelector(
  ".submit-form-btn.update-password-btn"
);

if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const role = document.querySelector("#role").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#passwordConfirm").value;
    console.log({ name, email, role, password, passwordConfirm });
    getIn(
      "POST",
      "signup",
      { name, email, role, password, passwordConfirm },
      "Account Created Successfully"
    );
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    getIn("POST", "login", { email, password }, "Logged in Successfully");
  });
}

const logOut = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    const token = res.data.token;
    document.cookie = "jwt" + "=" + token;

    if (res.data.status === "success") {
      showAlert("success", "Logged Out Successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 900);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener("click", logOut);
}

const makeAlert = (message) => {
  showAlert("success", message);
  window.setTimeout(() => {
    location.reload(true);
  }, 1000);
};

const loginBtn = document.querySelector(".login-btn");
const signUpBtn = document.querySelector(".signup-btn");
const updateDataBtn = document.querySelector(".update-data-btn");
const updatePasswordFormBtn = document.querySelector(".update-password-btn");

const getIn = async (method, url, data, message, dataset) => {
  const newMethod = method;
  const newUrl = url;
  const newData = data;
  const newMessage = message;
  try {
    let url;
    const method = newMethod;
    const data = newData;
    const message = newMessage;
    if (newUrl === "login") {
      url = "/api/v1/users/login";
      loginBtn.textContent = "Loggin in...";
    }

    if (newUrl === "signup") {
      url = "/api/v1/users/signup";
      signUpBtn.textContent = "Creating Account...";
    }

    if (newUrl === "updateMe") {
      if (paraForRouting.includes("#")) {
        paraForRouting = paraForRouting.split("#")[0];
      }
      url = `/api/v1/users/updateMe/${paraForRouting}`;

      updateDataBtn.textContent = "Updating...";
    }

    if (newUrl === "updatePassword") {
      if (paraForRouting.includes("#")) {
        paraForRouting = paraForRouting.split("#")[0];
      }
      url = `/api/v1/users/updatepassword/${paraForRouting}`;
      updatePasswordFormBtn.textContent = "Updating...";
    }

    if (newUrl === "createBooking") {
      url = `/api/v1/bookings/book-hotel/${urlForRouting[4]}/${urlForRouting[5]}`;
    }

    if (newUrl === "deleteBooking") {
      url = `/api/v1/bookings/${dataset}`;
    }

    if (newUrl === "createReview") {
      url = `/api/v1/reviews/write-reviews/${urlForRouting[5]}/${urlForRouting[6]}`;
    }

    if (newUrl === "deleteReview") {
      url = `/api/v1/reviews/${dataset}`;
    }

    if (newUrl === "likeAndUnlike" || newUrl === "removeFromLikes") {
      url = `/added/${dataset}`;
    }

    const res = await axios({
      method,
      url,
      data,
    });

    if (
      newUrl === "login" ||
      (newUrl === "signup" && res.data.status === "success")
    ) {
      const token = res.data.token;
      document.cookie = "jwt" + "=" + token;

      showAlert("success", message);
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    } else if (newUrl === "updatePassword") {
      const token = res.data.token;
      document.cookie = "jwt" + "=" + token;

      makeAlert(message);
    } else if (newUrl === "createBooking") {
      showAlert("success", message);
      goToMe(5);
    } else if (newUrl === "deleteBooking") {
      showAlert("success", message);
      goToMe(4);
    } else if (newUrl === "deleteReview") {
      showAlert("success", message);
      goToMe(4);
    } else if (newUrl === "createReview") {
      showAlert("success", message);
      goToMe(5);
    } else if (newUrl === "likeAndUnlike") {
      showAlert("success", message);
      window.setTimeout(() => {
        location.assign("/hotels");
      }, 1000);
    } else if (newUrl === "removeFromLikes") {
      showAlert("success", message);
      goToMe(4);
    } else {
      makeAlert(message);
    }
  } catch (err) {
    console.log(err);
    console.log(err.response.data);
    loginBtn.textContent = "Submit";
    signUpBtn.textContent = "Submit";
    showAlert("error", err.response.data.message);
  }
};

function goToMe(x) {
  window.setTimeout(() => {
    location.assign(`/me/${urlForRouting[x]}`);
  }, 1000);
}

////////////////////////////////////////////////
/////  Stuff related to account page //////////
//////////////////////////////////////////////

if (
  urlForRouting[5] === "liked-hotels" ||
  urlForRouting[5] === "reviews" ||
  urlForRouting[5] === "bookings"
) {
  const choosePhoto = (document.querySelector(".choose-photo").style.display =
    "none");
  const formUpload = (document.querySelector("#upload-photo").style.display =
    "none");

  const settingsDiv = document.querySelectorAll(".settings-div");
  const settingsHeading = document.querySelectorAll(".settings-heading");
  const formdiv = document.querySelectorAll(".form-div");
  const mySettings = document.querySelector(".my-settings");

  mySettings.textContent = "My Account";
  mySettings.setAttribute("href", `/me/${urlForRouting[4]}`);

  for (let i = 0; i < settingsDiv.length; i++) {
    settingsDiv[i].style.display = "none";
    settingsHeading[i].style.display = "none";
    formdiv[i].style.display = "none";
  }
}

////////////////////////////////////////////////
///// Updating User data and Password//////////
//////////////////////////////////////////////

const updateDataForm = document.querySelector(".update-data-form");
const passwordUpdateForm = document.querySelector(".update-password-form");
const uploadPhotoForm = document.querySelector("#upload-photo");

if (uploadPhotoForm) {
  uploadPhotoForm.addEventListener("click", (e) => {
    uploadPhotoForm.textContent = "Wait a minute...";
    e.preventDefault();
    const form = new FormData();
    form.append("photo", document.querySelector("#photo").files[0]);
    if (photo.files[0]) {
      getIn("PATCH", "updateMe", form, "Updated Successfully");
    } else {
      showAlert("error", "Please select a photo");
    }
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector(".input-label-div #name").value;
    const email = document.querySelector(".input-label-div #email").value;
    getIn("PATCH", "updateMe", { name, email }, "Updated Successfully");
  });
}

if (passwordUpdateForm) {
  passwordUpdateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    updatePasswordBtn.textContent = "Updating...";

    getIn(
      "PATCH",
      "updatePassword",
      { currentPassword, newPassword, passwordConfirm },
      "Updated Successfully"
    );
  });
}

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////

const settingsToggle = document.querySelector(".account-nav-hamburger span");
const navDiv = document.querySelector(".nav-div");

if (settingsToggle) {
  settingsToggle.addEventListener("click", () => {
    navDiv.classList.toggle("left-nav");
  });
}

//////////////////////////////////////////
///////////// Booking Hotel /////////////
////////////////////////////////////////

const bookHotelForm = document.querySelector(".book-hotel-form");

if (bookHotelForm) {
  bookHotelForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("your-name").value;
    const callingNumber = document.getElementById("phone-number").value;
    const whatsappNumber = document.getElementById("whatsapp-number").value;
    const date = document.getElementById("date").value;
    const noOfDaysToStay = document.getElementById("no-of-staying-days").value;
    getIn(
      "POST",
      "createBooking",
      { name, callingNumber, whatsappNumber, date, noOfDaysToStay },
      "Congratulations, Hotel Booked Successfully"
    );
  });
}

//////////////////////////////////////////////
////////// Deleting User's Booking //////////
////////////////////////////////////////////

const showBookingAlert = (type, urlType, msg, dataset) => {
  hideBookingAlert();
  const markup = `<div class="alert-booking alert--${type}">
     <p>${msg}</p>
     <div class="alert-booking-btn-div">
        <button class="alert-booking-btn delete-booking-btn">
          <a >Delete</a>
        </button>
        <button class="alert-booking-btn no-delete-booking">Don't Delete</button>
     </div>
  </div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  const noDeleteBtn = document.querySelector(".no-delete-booking");
  const deleteBtn = document.querySelector(".delete-booking-btn");

  noDeleteBtn.addEventListener("click", hideBookingAlert);
  const deleteBooking = () => {
    getIn("DELETE", urlType, "", "Deleted Successfully", dataset);
  };
  deleteBtn.addEventListener("click", deleteBooking);
};

const hideBookingAlert = () => {
  const el = document.querySelector(".alert-booking");
  if (el) el.parentElement.removeChild(el);
};

const deleteMyBooking = document.querySelectorAll(".delete-my-booking");
const deleteReviewBtn = document.querySelectorAll(".delete-review");

const deleteFunctionality = (element, msg, urlType) => {
  element.forEach((el) => {
    el.addEventListener("click", () => {
      const dataset = el.getAttribute("data-set");
      showBookingAlert("error", urlType, `${msg}`, dataset);
    });
  });
};

if (deleteMyBooking)
  deleteFunctionality(
    deleteMyBooking,
    "Are you sure you want to delete this booking ?",
    "deleteBooking"
  );

if (deleteReviewBtn)
  deleteFunctionality(
    deleteReviewBtn,
    "Do you want to delete this review ?",
    "deleteReview"
  );

//////////////////////////////////////
/////// Write Review Function ///////
////////////////////////////////////

const reviewForm = document.querySelector(".review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const review = document.querySelector("#review").value;
    const rating = document.querySelector("#ratings").value;
    getIn("POST", "createReview", { review, rating }, "Review Created");
  });
}

///////////////////////////////////////
/////////// Adding Likes /////////////
/////////////////////////////////////

const likeBtn = document.querySelectorAll(".heart");
const added = document.querySelectorAll(".heading-span .pad-increase span");

if (likeBtn) {
  likeBtn.forEach((el, i) => {
    el.addEventListener("click", () => {
      const dataset = el.dataset.set;
      let message;
      el.classList.contains("red")
        ? (message = "Removed from likes")
        : (message = "Added in likes");
      getIn("PATCH", "likeAndUnlike", {}, message, dataset);
    });
  });
}

const removeLikeBtn = document.querySelectorAll(".remove-from-likes");

if (removeLikeBtn) {
  removeLikeBtn.forEach((el) => {
    el.addEventListener("click", () => {
      const dataset = el.dataset.set;
      getIn("PATCH", "removeFromLikes", {}, "Removed from likes", dataset);
    });
  });
}
