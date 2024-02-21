"use strict";

const url = window.location.href.split("/");
const para = url[url.length - 1];

const dataFunction = async (url) => {
  try {
    const data = await (
      await fetch(`http://localhost:3000/${url}`)
    )
      .json()
      .then((data) => data)
      .catch((err) => console.log(err));

    return data;
  } catch (err) {
    console.log(err);
  }
};

const getData = async (url) => {
  const dataArray = await dataFunction(url);
  if (dataArray.data) {
    return dataArray.data;
  } else {
    return null;
  }
};

const showingMap = async (data) => {
  const dataArray = await data;
  let map = L.map("map");

  for (let i = 0; i < dataArray.length; i++) {
    map.setView(dataArray[i].coordinates, 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(dataArray[i].coordinates)
      .addTo(map)
      .bindPopup(dataArray[i].heading)
      .openPopup();
  }
};

const callingFunctions = (urlString) => {
  const urlLastParameter = urlString;
  const dataArray = getData(urlLastParameter);
  showingMap(dataArray);
};

if (para === "placesMap") {
  callingFunctions("placesAPI");
}
if (para === "hiddenMap") {
  callingFunctions("hiddenAPI");
}

const footer = document.querySelector("footer");

footer.style.marginTop = 0;

// {
//   maxWidth: 250,
//   minWidth: 100,
//   autoClose: false,
//   closeOnClick: false,
//   className: "popup",
// }
