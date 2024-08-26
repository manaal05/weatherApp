
function getWeather() {
    let temperature = document.getElementById("temperature");
    let description = document.getElementById("description");
    let location = document.getElementById("location");
  
    let api = "https://api.openweathermap.org/data/2.5/weather";
    let apiKey = "f146799a557e8ab658304c1b30cc3cfd";
  
    location.innerHTML = "Locating...";
  
    navigator.geolocation.getCurrentPosition(success, error);
  
    function success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
  
      let url =
        api +
        "?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        apiKey +
        "&units=imperial";
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          let temp = data.main.temp;
          temperature.innerHTML = temp + "° F";
          location.innerHTML =
            data.name + " (" + latitude + "°, " + longitude + "°)";
          description.innerHTML = data.weather[0].main;
        });
    }
  
    function error() {
      location.innerHTML = "Unable to retrieve your location";
    }
  }
  
  getWeather();
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';
$(document).ready(function () {
    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                weatherFn(lat, lon); // Use coordinates to fetch weather
            },
            function (error) {
                console.error('Error getting location:', error);
                // Enable manual city input only if location is not available
                $('#city-input').prop('disabled', false);
                $('#city-input-btn').prop('disabled', false);
            }
        );
    } else {
        // If geolocation is not supported, allow manual input
        $('#city-input').prop('disabled', false);
        $('#city-input-btn').prop('disabled', false);
    }
});

async function weatherFn(lat = null, lon = null, cityName = null) {
    let tempUrl;
    if (cityName) {
        tempUrl = `${url}?q=${cityName}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        tempUrl = `${url}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        return; // Exit if no data available
    }

    try {
        const res = await fetch(tempUrl);
        if (!res.ok) {
            throw new Error('City not found');
        }

        const data = await res.json();
        weatherShowFn(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (cityName) {
            alert('City not found. Please try again.');
        }
    }
}

function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);

    // Change background based on weather condition
    const weatherCard = $('#weather-card');
    const weatherCondition = data.weather[0].main.toLowerCase();

    if (weatherCondition.includes('clear')) {
        weatherCard.css('background', 'url("assets/clearsky.jpg") no-repeat center/cover');
    } else if (weatherCondition.includes('clouds')) {
        weatherCard.css('background', 'url("assets/cloudy.jpg") no-repeat center/cover');
    } else if (weatherCondition.includes('rain')) {
        weatherCard.css('background', 'url("assets/rainy.jpeg") no-repeat center/cover');
    } else if (weatherCondition.includes('sunny')) {
        weatherCard.css('background','url("assets/sunny.jpeg") no-repeat center/cover');
    } else {
        weatherCard.css('background', 'linear-gradient(to right, #4CAF50, #2196F3)'); // default background
    }

    $('#weather-info').fadeIn();
}

// Event listener for manual city input
$('#city-input-btn').click(function () {
    const cityName = $('#city-input').val();
    if (cityName) {
        weatherFn(null, null, cityName);
    } else {
        alert('Please enter a city name.');
    }
});
