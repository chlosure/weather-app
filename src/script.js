function formatDay(timestamp) {
  let date = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return `${day}`;
}

function time(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${formatDay(timestamp)} ${hours}:${minutes}`;
}

function displayWeather(response) {
  document.querySelector(".city").innerHTML = response.data.name;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;
  document.querySelector(".temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#day-time").innerHTML = time(response.data.dt * 1000);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#temp-max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#temp-min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#visibility").innerHTML = Math.round(
    response.data.visibility / 1000
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
}

function displayForecast(response) {
  let forecastElement = document.querySelector(".daily");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let index = 1; index < 7; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
      <div class="col-sm">
        <ul>
          <li>${formatDay(forecast.dt * 1000)}</li>
          <img src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png" alt="weather icon" />
          <li><strong>${Math.round(
            forecast.temp.max
          )}°</strong> <small>${Math.round(forecast.temp.min)}°</small>
          </li>
          <li>${forecast.weather[0].main}</li>
        </ul>
      </div>
      `;
  }
}

function displayGeolocation(response) {
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let apiKey = "88718a3cd7a46d18f08891c26ac51e4f";
  let units = "metric";
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&exclude=current,minutely,hourly`;
  axios.get(apiUrl).then(displayForecast);
}

function searchCity(city) {
  let apiKey = "88718a3cd7a46d18f08891c26ac51e4f";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);

  axios.get(apiUrl).then(displayGeolocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(".form-control").value;
  searchCity(city);
}
let searchButton = document.querySelector(".location");
searchButton.addEventListener("submit", handleSubmit);

function showLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "88718a3cd7a46d18f08891c26ac51e4f";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&exclude=current,minutely,hourly`;
  axios.get(apiUrl).then(displayForecast);
}

function searchGeolocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

let geolocationButton = document.querySelector(".btn-success");
geolocationButton.addEventListener("click", searchGeolocation);

let celsiusTemperature = null;

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showFahrenheit);

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
}
let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showCelsius);

searchCity("San Francisco");
