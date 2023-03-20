import React, { useState, useEffect } from "react";

function WeatherB() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = "871e89417ffc1e2f0cf2945384f5f161";

    {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              setWeather(data);
              setLocation(`${data.name}, ${data.sys.country}`);
            })
            .catch((error) => {
              console.error("Error fetching weather data: ", error);
              setError("Unable to fetch weather data.");
            });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setError("Unable to get location.");
        }
      );
    }
  });

  

  return (
    <div className="weather">
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h2>{location}</h2>
          <p>{weather.main.temp}°F, {weather.weather[0].description}</p>
          <p></p>
        </div>
      )}
    </div>
  );
}

export default WeatherB;
