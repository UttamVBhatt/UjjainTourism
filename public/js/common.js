"use strict";

////////// HEART ///////////

let heart = document.querySelectorAll(".heart");

for (let i = 0; i < heart.length; i++) {
  heart[i].addEventListener("click", function () {
    heart[i].classList.toggle("red");
  });
}

///////////// CAROUSEL ///////////////

let prevBtn = document.querySelector(".prev");
let nextBtn = document.querySelector(".next");
let imgContainer = document.querySelectorAll(".img-container");
let dots = document.querySelectorAll(".dot");

let index = 0;

for (let i = 0; i < dots.length; i++) {
  dots[i].addEventListener("click", () => {
    let dotIndex = dots[i].dataset.cg;
    let noDotIndex = Number(dotIndex);
    imageSlider(noDotIndex);
  });
}

function show_image(n) {
  index += n;
  imageSlider(index);
}

function imageSlider(n) {
  index = n;

  for (let i = 0; i < imgContainer.length; i++) {
    imgContainer[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active-dot");
  }

  if (index > imgContainer.length - 1) {
    index = 0;
  }

  if (index < 0) {
    index = imgContainer.length - 1;
  }

  imgContainer[index].style.display = "block";
  dots[index].classList.add("active-dot");
}

////////////// GIF //////////////

let gifDiv = document.querySelector(".gif");
let gifImage = document.querySelector(".gif img");

window.addEventListener("DOMContentLoaded", () => {
  gifDiv.style.display = "none";
  gifImage.style.display = "none";
});
