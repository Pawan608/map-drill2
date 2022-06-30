"use strict";

//current position of the device
//function 1 is called if we successfully get data
//function 2 is a error function so it is called if we get error
//third parameter is the object which is called options
class App {
  #data1 = [];
  /////data1 contains array of database1
  #database1;
  #map;
  ///we have assigned variable outside of constructor because we had to declare private variables
  //Private variables cannot be accessed outside the class
  constructor() {
    ///The moment we create an object through a class, the constructor part immediately runs because constructor is an instance of a class
    this.getposition();
  }
  getposition() {
    navigator.geolocation.getCurrentPosition(
      this.loadmap.bind(this),
      function (err) {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  loadmap(cord) {
    console.log(this);
    //"this" will not target to the object
    // console.log("Data successfully received");
    const { latitude: lat, longitude: long } = cord.coords;
    // console.log(`${lat},${long}`);
    this.#map = L.map("map").setView([lat, long], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.addEventListener("click", this.startfetching.bind(this));
  }
  ////EventListener always sends event as a parameter in the callback function
  startfetching = async function (mapE) {
    //mapE cointains object of data containing latitude and longitude
    //console.log(mapE);
    const { lat, lng } = mapE.latlng;
    //console.log(`${lat},${lng}`);
    try {
      const data = await this.place(lat, lng);
      console.log(data);
      this.popup(data);

      this.database(data);
      this.append();
    } catch (err) {
      console.log(err.message);
      alert(err.message);
    }
  };
  //console.log("from outside the fuction", lat, long);
  ////To fetch data from an API we send request to the Api and  in return we get response
  place = async function (lat, lng) {
    try {
      let data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`); ///promise
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok)
        data = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
      if (!data.ok) throw new Error("Unable to fetch Address");
      const data1 = await data.json();
      const country = await fetch(
        `https://restcountries.com/v3.1/alpha/${data1.prov}`
      ); //promise
      const [data2] = await country.json();
      //console.log(data2);
      //console.log(data1);
      return [data1, data2];
    } catch (err) {
      console.log(err);
    }
  };
  popup(data) {
    const layer = L.marker([data[0].latt, data[0].longt]).addTo(this.#map);
    const popup = layer
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
        })
      )
      .setPopupContent(`${data[0].city},${data[1].name.common}`)
      .openPopup();
  }
  database(data) {
    this.#database1 = {
      city: data[0].city,
      latitude: data[0].latt,
      longitude: data[0].longt,
      flag: data[1].flags.svg,
      country: data[1].name.common,
      district: "No information",
      state: "No information",
      id: String(Date.now()),
      district: function () {
        if (typeof data[0].region == "string") {
          const statedistrict = data[0].region.split(",");
          console.log(statedistrict);
          this.district = statedistrict[0];
          this.state = statedistrict[1];
        }
      },
    };

    this.#database1.district();
    // console.log(this.#database1);
    this.#data1.unshift(this.#database1);
    //console.log("Data", data1);
  }
  append() {
    const sidebar = document.querySelector(".box");
    const box1 = document.createElement("div");
    box1.classList.add("workout");
    box1.classList.add("workout--running");
    const box2 = document.createElement("div");
    const box3 = document.createElement("div");
    box2.classList.add("pos");
    box1.setAttribute("data-id", `${this.#database1.id}`);
    const html = `<li>
  <h2 class="workout__title">ADDRESS DETAILS</DETAils></h2>
  <div class="workout__details">
    <span class="workout__icon country">Country:</span>
    <span class="workout__value country_name">${this.#database1.country}</span>
    <span class="workout__unit flag"></span>
  </div>
  <div class="workout__details">
    <span class="workout__icon state">State:</span>
    <span class="workout__value state_name" >${this.#database1.state}</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon district">District:</span>
    <span class="workout__value district_name ">${
      this.#database1.district
    }</span>
    
  </div>
  <div class="workout__details">
    <span class="workout__icon city">City:</span>
    <span class="workout__value">${this.#database1.city}</span>
  </div>
  <div class="weather workout__icon" data-ok="0">
    <span class="status" style="transform: translateX(3.5rem)">Check Weather</span> 
    </div>
   </li>`;
    const html2 = `<img src="${
      this.#database1.flag
    }" style="width:150px;height:150px;position:relative;">`;
    box2.innerHTML = html;
    box3.innerHTML = html2;
    box1.append(box2);
    box1.append(box3);
    sidebar.prepend(box1);
    this.slideto();
    const check = document.querySelector(".weather");
    check.addEventListener("click", this.checkweather.bind(this));
  }
  slideto() {
    const box1 = document.querySelector(".workout");
    box1.scrollIntoView({ behavior: "smooth" });
  }
  checkweather(e) {
    let j;
    const targetdetail = document.querySelectorAll(".workout");
    for (let i = 0; i < targetdetail.length; i++) {
      if (e.target.closest(".workout") === targetdetail[i]) {
        j = i;
        break;
      }
    }
    const html = `<div class="weather_report add" style="position: relative;">  </div>`;
    const button = e.target.closest(".weather");
    const target = e.target.closest(".status") || e.target.children[0];
    if (button.dataset.ok == "0") {
      target.closest(".workout").insertAdjacentHTML("afterend", html);
      button.dataset.ok = "1";
    }
    const sibling = target.closest(".workout").nextSibling;
    if (sibling.classList.contains("add")) {
      sibling.classList.remove("add");
      button.classList.add("weather_button");
      target.textContent = "Hide Weather";
      sibling.style.width = window.getComputedStyle(
        target.closest(".workout")
      ).width;
      sibling.style.height = "180px";
      this.fetchweather(j, sibling);
    } else {
      sibling.classList.add("add");
      button.classList.remove("weather_button");
      target.textContent = "Check Weather";
      sibling.style.height = "0px";
      sibling.textContent = "";
    }
  }
  fetchweather = async function (j, sibling) {
    const { latitude: latt, longitude: longt } = this.#data1[j];
    const data = await this.weather_report(latt, longt);
    this.weatherdata(sibling, data);
  };
  weather_report = async function (latt, longt) {
    const key = "5c15139977cd460d2d51fde21f1111a7";
    try {
      let weather = await fetch(
        ` https://api.openweathermap.org/data/2.5/weather?lat=${latt}&lon=${longt}&appid=${key}`
      );
      let report = await weather.json();
      return report;
      console.log("Weather", report);
    } catch (err) {
      alert("Could't find the weather");
    }
  };
  weatherdata(sibling, report) {
    //console.log(report);
    const { main, weather, wind } = report;
    const weatherdata = {
      humidity: main.humidity,
      maxtemp: main.temp_max,
      mintemp: main.temp_min,
      description: weather[0].description,
      windspeed: wind.speed,
      degree: wind.deg,
    };
    // console.log(weatherdata);
    // console.log(sibling);
    this.showWeatherReport(sibling, weatherdata);
  }
  showWeatherReport(sibling, weatherdata) {
    const html = `<div class="reports"> <h3> Weather Report</h3>
  <span class="report">Max Temp</span><span>: ${Math.round(
    weatherdata.maxtemp - 273
  )}℃</span><br>
  <span class="report">Min Temp</span><span>: ${Math.round(
    weatherdata.mintemp - 273
  )}℃</span><br>
  <span class="report">Humidity</span><span>: ${weatherdata.humidity}</span><br>
  <span class="report">Wind Speed</span> <span>: ${
    weatherdata.windspeed
  }</span><br>
  <span class="report">Description</span><span>: ${
    weatherdata.description
  }</span>
      </div>`;
    setTimeout(function () {
      sibling.insertAdjacentHTML("afterbegin", html);
    }, 1000);
  }
}

const app = new App();
