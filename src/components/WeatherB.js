import React, { useState, useEffect } from "react";

function WeatherB() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [useGeolocation, setUseGeolocation] = useState(false);

  useEffect(() => {
    const apiKey = "871e89417ffc1e2f0cf2945384f5f161";

    if (useGeolocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

            fetch(apiUrl)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Error fetching weather data.");
                }
                return response.json();
              })
              .then((data) => {
                setWeather(data);
                setLocation(`${data.name}, ${data.sys.country}`);
                setError(null);
              })
              .catch((error) => {
                console.error("Error fetching weather data: ", error);
                setError(error.message);
              });
          },
          (error) => {
            console.error("Error getting user location: ", error);
            setError("Error getting user location.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } else if (searchInput !== "") {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=imperial`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Invalid city name. Please try again.");
          }
          return response.json();
        })
        .then((data) => {
          setWeather(data);
          setLocation(`${data.name}, ${data.sys.country}`);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching weather data: ", error);
          setError(error.message);
        });
    }
  }, [searchInput, useGeolocation]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  const handleUseGeolocationChange = (event) => {
    setUseGeolocation(event.target.checked);
  };

  return (
    <div className="weather">
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="searchInput">Enter a city name:</label>
        <input
          type="text"
          id="searchInput"
          value={searchInput}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      <label>
        <input
          type="checkbox"
    checked={useGeolocation}
      onChange={handleUseGeolocationChange}
    />
    Use my current location
  </label>
  {error && <p>{error}</p>}
  {weather && (
    <div>
      <h2>{location}</h2>
      <p>{weather.main.temp}°F, {weather.weather[0].description}</p>
    </div>
  )}
</div>

);
}

export default WeatherB;