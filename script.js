let vantaEffect = null;

// Map your weather conditions to fog colors
function getFogColorScheme(condition) {
  switch (condition.toLowerCase()) {
    case "clear":
      return {
        highlightColor: 0xf0f8ff, // AliceBlue, very pale whitish-blue
        midtoneColor: 0xddeeff,   // soft pale blue
        lowlightColor: 0xa3c1e1,  // light sky blue (same as before)
        baseColor: 0xb3d1f2       // very light blue background
      };
    case "clouds":
      return {
        highlightColor: 0xd0d6db,
        midtoneColor: 0x99b3cc,
        lowlightColor: 0x6f8fa6,
        baseColor: 0x5c6b78 // muted blue-gray base
      };
    case "rain":
      return {
        highlightColor: 0x4b5a68,
        midtoneColor: 0x3f4d59,
        lowlightColor: 0x2d3b47,
        baseColor: 0x1f2a33 // dark rainy base
      };
    case "snow":
      return {
        highlightColor: 0xb0c4de, // light steel blue
        midtoneColor: 0x6495ed,   // cornflower blue
        lowlightColor: 0x4169e1,  // royal blue
        baseColor: 0x0d1f4f       // dark blue (navy-ish)
      };
    default:
      return {
        highlightColor: 0xff9919,
        midtoneColor: 0xffcc66,
        lowlightColor: 0x996633,
        baseColor: 0x87ceeb
      };
  }
}

// Initialize or update the Vanta fog effect
function changeBackgroundByCondition(condition) {
  const colors = getFogColorScheme(condition);

  if (vantaEffect) {
    vantaEffect.setOptions({
      highlightColor: colors.highlightColor,
      midtoneColor: colors.midtoneColor,
      lowlightColor: colors.lowlightColor,
      baseColor: colors.baseColor,
      speed: 5
    });
  } else {
    vantaEffect = VANTA.FOG({
      el: "#vanta-bg",
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      highlightColor: colors.highlightColor,
      midtoneColor: colors.midtoneColor,
      lowlightColor: colors.lowlightColor,
      baseColor: colors.baseColor,
      blurFactor: 0.7,
      speed: 5,
      zoom: 1,
      minHeight: 200.0,
      minWidth: 200.0
    });
  }
}

// Clothing recommendation logic based on temperature and weather condition
function getClothingRecommendation(temp, weather) {
  if (temp < 15) return "Wear a warm jacket.";
  if (temp >= 15 && temp < 25) return "Light jacket or sweater.";
  if (temp >= 25) return "T-shirt and shorts.";
  return "Dress comfortably.";
}

// Geolocation success callback - fetch weather based on coords
function success(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  const apiKey = "e43e276b6a85a35682551f79e24d0669";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      let city = data.name;
      let temp = data.main.temp;
      let weather = data.weather[0].main;
      if(weather==="Rain"||weather==="Clouds"||weather==="Snow"){
        document.getElementById("header").style.color="white";
        document.getElementById("recc").style.color="white";
         document.getElementById("content").style.color="white";


      }

      changeBackgroundByCondition(weather);

      document.querySelector(".recc").innerHTML = `
        <p>City: ${city}</p>
        <p>Temperature: ${temp}°C</p>
        <p>Weather: ${weather}</p>
        <p><strong>Recommendation:</strong> ${getClothingRecommendation(temp, weather)}</p>
      `;
    })
    .catch(err => {
      console.error("Error fetching weather:", err);
    });
}

function error() {
  document.getElementById("location").textContent = "❌ Location access denied";
  console.log("Unable to retrieve location");
}

// Request user location and get weather
function getlocation() {
  navigator.geolocation.getCurrentPosition(success, error);
}

// Fetch weather by city name input
function getWeather() {
  let city = document.getElementById("city").value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
  const apiKey = "e43e276b6a85a35682551f79e24d0669";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        alert("City not found. Please check spelling.");
        return;
      }

      const temp = data.main.temp;
      const weather = data.weather[0].main;
      const City = data.name;
      

      changeBackgroundByCondition(weather);

      // You can adjust text color based on weather condition here
     if(weather==="Rain"||weather==="Clouds"||weather==="Snow"){
        document.getElementById("header").style.color="white";
        document.getElementById("recc").style.color="white";
         document.getElementById("content").style.color="white";
}

      document.getElementById("recc").innerHTML = `
        <p>City: ${City}</p>
        <p>Temperature: ${temp}°C</p>
        <p>Condition: ${weather}</p>
        <p><strong>Recommendation:</strong> ${getClothingRecommendation(temp, weather)}</p>
      `;
    })
    .catch(err => console.error("Error fetching weather:", err));
}
// Initialize with default weather condition so Vanta Fog shows right away
document.addEventListener("DOMContentLoaded", () => {
  changeBackgroundByCondition("clear");
});