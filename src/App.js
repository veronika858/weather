import React, { useState } from "react";
import "./scss/main.scss";

const api = {
  key: "&APPID=18aca0f26c0c84601ff8f652d8fd6d75",
  base: "http://api.openweathermap.org/data/2.5/weather?",
};

async function executeQuery(query) {
  let response = await fetch(api.base + query + api.key);
  return await response.json();
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = d.getDate();
  let year = d.getFullYear();
  let day = days[d.getDay()];
  let month = months[d.getMonth()];

  return `${day} ${date} ${month} ${year}`;
}

function WindZones(props) {
  if (props.wind <= 0.2) {
    return "Calm";
  } else if (props.wind >= 0.3 && props.wind <= 1.5) {
    return "Light Air";
  } else if (props.wind >= 1.6 && props.wind <= 3.3) {
    return "Light Breeze";
  } else if (props.wind >= 3.4 && props.wind <= 5.4) {
    return "Gentle Breeze";
  } else if (props.wind >= 5.5 && props.wind <= 7.9) {
    return "Moderate Breeze";
  } else if (props.wind >= 8.0 && props.wind <= 10.7) {
    return "Fresh Breeze";
  } else if (props.wind >= 10.8 && props.wind <= 13.8) {
    return "strong Breeze";
  } else if (props.wind >= 13.9 && props.wind <= 17.1) {
    return "Near Gale";
  } else if (props.wind >= 17.2 && props.wind <= 20.7) {
    return "Gale";
  } else if (props.wind >= 20.8 && props.wind <= 24.4) {
    return "Severe Gale";
  } else if (props.wind >= 24.5 && props.wind <= 28.4) {
    return "Strong storm";
  } else if (props.wind >= 28.5 && props.wind <= 32.6) {
    return "Violent Storm";
  } else if (props.wind >= 32.7) {
    return "Hurricane";
  }
  return null;
}

function Sunrise(props) {
  const date = new Date(props.sunrise * 1000);
  return date.toLocaleTimeString();
}

function Sunset(props) {
  const date = new Date(props.sunset * 1000);
  return date.toLocaleTimeString();
}

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [init, setInit] = useState("");
  const search = (e) => {
    if (e.key === "Enter") {
      executeQuery("q=" + query).then((result) => {
        setQuery("");
        setWeather(result);
        console.log(result, weather);
      });
    }
  };

  const success = (position) => {
    //this.getWeatherData(position.coords.latitude, position.coords.longitude);
    console.log(position);
    executeQuery(
      "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude
    ).then((result) => {
      setQuery("");
      setWeather(result);
      //					console.log(result, weather);
    });
  };

  const error = () => {
    alert("Unable to retrieve location.");
  };

  if (navigator.geolocation) {
    if (!init) {
      navigator.geolocation.getCurrentPosition(success, error);
      setInit("1");
    }
  } else {
    alert(
      "Your browser does not support location tracking, or permission is denied."
    );
  }
  //};

  return (
    <div className="app cards">
      <main>
        <div className="container">
          <div className="cards__item">
            <div
              className={
                typeof weather.main != "undefined"
                  ? weather.main.temp > 16 + 272.15
                    ? "card warm"
                    : "card"
                  : "card"
              }
            >
              <div className="search-box">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                  onKeyPress={search}
                />
              </div>
              {typeof weather.main != "undefined" ? (
                <div className="weather card__body">
                  <div className="location-box">
                    <h2 className="location">
                      {" "}
                      {weather.name}, {weather.sys.country}
                    </h2>
                    <h5 className="date">{dateBuilder(new Date())}</h5>
                  </div>
                  <div className="weather-box">
                    <div className="temp">
                      Temp:{" "}
                      {Math.round(
                        (weather.main.temp - 272.15 + Number.EPSILON) * 100
                      ) / 100}
                      °C
                    </div>
                    <div className="weather_main">
                      Cloudiness: {weather.weather[0].main}
                    </div>
                    <div className="wind">
                      Wind:{" "}
                      {Math.round(
                        (weather.wind.speed * 3.6 + Number.EPSILON) * 100
                      ) / 100}{" "}
                      km/h <WindZones wind={weather.wind.speed} />
                    </div>
                    <div className="sunrise">
                      Sunrise: <Sunrise sunrise={weather.sys.sunrise} />
                    </div>
                    <div className="sunset">
                      Sunset: <Sunset sunset={weather.sys.sunset} />
                    </div>
                  </div>
                  <div className="icon">
                    {["Sun", "Clear"].includes(weather.weather[0].main) ? (
                      <div className="sun">
                        <div className="rays"></div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "Clouds" ? (
                      <div className="clouds">
                        <div className="cloud"></div>
                        <div className="cloud"></div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "SunRainClouds" ? (
                      <div className="sun-shower">
                        <div className="cloud"></div>
                        <div className="sun">
                          <div className="rays"></div>
                        </div>
                        <div className="rain"></div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "Thunderstorm" ? (
                      <div className="thunder-storm">
                        <div className="cloud"></div>
                        <div className="lightning">
                          <div className="bolt"></div>
                          <div className="bolt"></div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "Snow" ? (
                      <div className="flurries">
                        <div className="cloud"></div>
                        <div className="snow">
                          <div className="flake"></div>
                          <div className="flake"></div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "Rain" ? (
                      <div className="rainy">
                        <div className="cloud"></div>
                        <div className="rain"></div>
                      </div>
                    ) : (
                      " "
                    )}
                    {weather.weather[0].main === "Haze" ? (
                      <div className="haze">
                        <div className="cloud"></div>
                        <div className="haze"></div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            ,
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
