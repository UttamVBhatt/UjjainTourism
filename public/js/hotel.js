"use strict";

let index = 0;
const dots = document.querySelectorAll(".dot");
const imageDiv = document.querySelectorAll(".image-div");

function showImage(i) {
  index += i;
  showHotelImage(index);
}

for (let i = 0; i < dots.length; i++) {
  dots[i].addEventListener("click", () => {
    const datasetValue = +dots[i].dataset.set;
    showHotelImage(datasetValue);
  });
}

function showHotelImage(i) {
  index = i;
  for (let i = 0; i < imageDiv.length; i++) {
    imageDiv[i].style.display = "none";
  }
  for (let i = 0; i < imageDiv.length; i++) {
    dots[i].classList.remove("active-dot");
  }
  if (index < 0) {
    index = imageDiv.length - 1;
  }
  if (index > imageDiv.length - 1) {
    index = 0;
  }
  imageDiv[index].style.display = "block";
  dots[index].classList.add("active-dot");
}

////////// HEART ///////////

// let heart = document.querySelectorAll(".heart");
// const added = document.querySelectorAll(".heading-span .pad-increase span");

// for (let i = 0; i < heart.length; i++) {
//   heart[i].addEventListener("click", function () {
//     heart[i].classList.toggle("red");
//     added[i].classList.toggle("opac");
//   });
// }
