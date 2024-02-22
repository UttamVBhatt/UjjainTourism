"use strict";

////////////////////////////////////////////////////////////////////
////////////////////////INITIALIZING  VARIABLES ///////////////////
//////////////////////////////////////////////////////////////////

var songCards = document.querySelector(".song-cards");
let backOverlay = document.querySelector(".back-overlay");
let cross = document.querySelector(".cross");
let mainPlay = document.querySelectorAll(".mainPlay");
let gif = document.querySelector(".gif");
let audio1 = document.querySelector(".audio1");
let cardsContainer = document.querySelector(".cardsContainer");
let cardBackward = document.querySelector(".fa-backward");
let cardForward = document.querySelector(".fa-forward");
let cardImage = document.querySelector(".cardImageImage");
let cardSongName = document.querySelector(".cardSongName");
let authorName = document.querySelector(".authorName");
let cardPlay = document.querySelector(".card-play");
let songList = document.querySelectorAll(".songs-div");
let range = document.querySelector(".range");
let index = 0;
let isplaying;

/////////////////////////////////////////////////////////////////////
///////////////////////// SONG ARRAY ///////////////////////////////
///////////////////////////////////////////////////////////////////

let songs = [
  {
    songName: "Adiyogi",
    authorName: "Kailash Kher",
    image: "/images/songImages/image1.jpg",
    audio: "/songs/Adiyogi.mp3",
  },
  {
    songName: "Bhola Nyu Matke",
    authorName: "Rajesh Singhpuria",
    image: "/images/songImages/image6.jpg",
    audio: "/songs/Bhola Nyu Matke.mp3",
  },
  {
    songName: "Bam Bholle",
    authorName: "Viruss",
    image: "/images/songImages/image5.jpg",
    audio: "/songs/BamBholle.mp3",
  },
  {
    songName: "Har Har Mahadev",
    authorName: "Vikram Montrose",
    image: "/images/songImages/image10.jpg",
    audio: "/songs/Har Har Mahadev Omg 2.mp3",
  },
  {
    songName: "Bam Bam Bol...",
    authorName: "Niraj Singh",
    image: "/images/songImages/image8.jpg",
    audio: "/songs/Bam Bam Bol Raha Hai Kashi.mp3",
  },
  {
    songName: "Bam Lahiri",
    authorName: "Kailash Kher",
    image: "/images/songImages/image4.jpg",
    audio: "/songs/Bam Lahiri.mp3",
  },
  {
    songName: "Hanuman Chalisa",
    authorName: "Gulshan Kumar",
    image: "/images/songImages/image9.jpg",
    audio: "/songs/Hanuman Chalisa.mp3",
  },
  {
    songName: "Baba Teri...",
    authorName: "Hansraj Rajhuvanshi",
    image: "/images/songImages/image2.jpg",
    audio: "/songs/Baba Teri Maya.mp3",
  },
  {
    songName: "Bholenath Ki Shadi",
    authorName: "Hansraj Raghuvanshi",
    image: "/images/songImages/image7.jpg",
    audio: "/songs/Bholenath-Ki-Shadi.mp3",
  },
  {
    songName: "Damru Bajaya",
    authorName: "Hansraj Raghuvanshi",
    image: "/images/songImages/image8.jpg",
    audio: "/songs/Damru-Bajaya.mp3",
  },
  {
    songName: "Lo Sambhalo Bhole...",
    authorName: "Lakhbir Singh Lakkha",
    image: "/images/songImages/image13.jpg",
    audio: "/songs/Lo Sambhalo Bhole Apni Kanwar.mp3",
  },
  {
    songName: "Mahakal Sarkar",
    authorName: "Sunny Albela",
    image: "/images/songImages/image14.jpg",
    audio: "/songs/Mahakal Sarkar.mp3",
  },
  {
    songName: "Om-Namah-Shivay",
    authorName: "Udit Narayana",
    image: "/images/songImages/image18.jpg",
    audio: "/songs/Om-Namah-Shivay.mp3",
  },
  {
    songName: "Mera Bhola Hai...",
    authorName: "Hansraj Raghuvanshi",
    image: "/images/songImages/image16.jpg",
    audio: "/songs/Mera Bhola Hai Bhandari.mp3",
  },
  {
    songName: "Teri Hove Jay...",
    authorName: "Kishan Bhagat",
    image: "/images/songImages/image21.jpg",
    audio: "/songs/Teri hove jay jaykar.mp3",
  },
  {
    songName: "Namo Namo Ji...",
    authorName: "Amit Trivedi",
    image: "/images/songImages/image17.jpg",
    audio: "/songs/Namo-Namo-Ji-Shankara.mp3",
  },
  {
    songName: "Mahakal Ki Gulami",
    authorName: "Kishan Bhagat",
    image: "/images/songImages/image15.jpg",
    audio: "/songs/Mahakal-Ki-Gulami.mp3",
  },
  {
    songName: "Shiv Sama Rahe...",
    authorName: "Hansraj Raghuvanshi",
    image: "/images/songImages/image19.jpg",
    audio: "/songs/Shiv-Sama-Rahe-Mujhme.mp3",
  },
  {
    songName: "Ujjain Ke Raja",
    authorName: "Kishan Bhagat",
    image: "/images/songImages/image22.jpg",
    audio: "/songs/Mahakal Ki Gulami.mp3",
  },
  {
    songName: "Taqdeer Mujhe Le Chal",
    authorName: "Shahzaaz Akhtar",
    image: "/images/songImages/image20.jpg",
    audio: "/songs/Taqdeer Mujhe Le Chal Mahakal Ki Basti Main.mp3",
  },
  {
    songName: "Unchi Unchi Vaadi",
    authorName: "Hansraj Raghuvanshi",
    image: "/images/songImages/image23.jpg",
    audio: "/songs/Unchi Unchi Vaadi Mein Baste Hai Bhole Shankar.mp3",
  },
  {
    songName: "Laagi Lagan Shankara",
    authorName: "Hansraj Raghuvansh12",
    image: "/images/songImages/image9.jpg",
    audio: "/songs/Laagi Lagan Shankara.mp3",
  },
  {
    songName: "Kyu Khadi Khadi...",
    authorName: "Karambi and Dolly",
    image: "/images/songImages/image11.jpg",
    audio: "/songs/Kyu Khadi Khadi Tu Hale Gora.mp3",
  },
];

function mainPlayPause() {
  mainPlay.forEach((element) => {
    element.classList.replace("fa-pause", "fa-play");
  });
}

////////////////////////////////////////////////////////////////////////
////////////////////// PLAY MUSIC FROM SONGLIST ///////////////////////
//////////////////////////////////////////////////////////////////////

for (let i = 0; i < mainPlay.length; i++) {
  mainPlay[i].addEventListener("click", () => {
    if (mainPlay[i].classList.contains("fa-play")) {
      let newSongIndex = Number(mainPlay[i].dataset.set);
      change_music(newSongIndex);
    } else {
      mainPlay[i].classList.replace("fa-pause", "fa-play");
      audio1.pause();
      audio1.currentTime = 0;
    }
  });
}

////////////////////////////////////////////////////////////////////////
///////////////// OVERLAY AND CROSS BUTTON HIDDEN FUNCTION /////////////
////////////////////////////////////////////////////////////////////////

function cardDisplayNone() {
  songCards.style.display = "none";
  backOverlay.style.display = "none";
  cardsContainer.style.display = "none";
}

cross.addEventListener("click", cardDisplayNone);
backOverlay.addEventListener("click", cardDisplayNone);

////////////////////////////////////////////////////////////////////////
//////////////////////// PLAY AND PAUSE FOR CARD ///////////////////////
////////////////////////////////////////////////////////////////////////

const playMusic = () => {
  isplaying = true;
  audio1.play();
  cardPlay.classList.replace("fa-play", "fa-pause");
  cardImage.classList.add("anime");
  gif.style.display = "block";
  gif.classList.add("newAnime");
};

const pauseMusic = () => {
  isplaying = false;
  audio1.pause();
  cardPlay.classList.replace("fa-pause", "fa-play");
  cardImage.classList.remove("anime");
  gif.style.display = "none";
};

cardPlay.addEventListener("click", () => {
  isplaying ? pauseMusic() : playMusic();
});

////////////////////////////////////////////////////////////////////////
/////////// CHANGE MUSIC FROM FORWARD AND BACKWARD BUTTO N ////////////
//////////////////////////////////////////////////////////////////////

function change_index(i) {
  index += i;
  change_music(index);
}

function change_music(i) {
  index = i;
  if (index < 0) {
    index = mainPlay.length - 1;
  }
  if (index > mainPlay.length - 1) {
    index = 0;
  }
  mainPlayPause();
  audio1.currentTime = 0;
  cardPlay.classList.replace("fa-play", "fa-pause");
  cardImage.src = songs[index].image;
  cardSongName.textContent = songs[index].songName;
  authorName.textContent = songs[index].authorName;
  cardsContainer.style.display = "flex";
  gif.style.display = "block";
  gif.classList.add("newAnime");
  cardImage.classList.add("anime");
  mainPlay[index].classList.replace("fa-play", "fa-pause");
  songCards.style.display = "flex";
  backOverlay.style.display = "block";
  songCards.classList.add("modalView");
  backOverlay.classList.add("modalView");
  audio1.src = songs[index].audio;
  audio1.play();
}
////////////////////////////////////////////////////////////////////////
/////////// TIME UPDATE IN RANGE FROM AUDIO AND VICE-VERSA ////////////
//////////////////////////////////////////////////////////////////////

audio1.addEventListener("timeupdate", () => {
  let progress = Math.trunc((audio1.currentTime / audio1.duration) * 100);
  range.value = progress;
  if (range.value == 100) {
    change_index(1);
  }
});

range.addEventListener("change", () => {
  audio1.currentTime = (range.value * audio1.duration) / 100;
});

// const images = document.querySelectorAll(".songs_div img");

// images.forEach((el) => el.classList.add("song-image"));
