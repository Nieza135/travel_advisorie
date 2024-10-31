// Function fetch weather api
async function fetchWeather() {
    const location = document.getElementById('locationinput').value; 
    const apiKey = '32804b24a847407391c53709241010'; 
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`;
  
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        if (!response.ok) {
            throw new Error(data.error.message);
        }
        
        localStorage.setItem('weatherData', JSON.stringify(data));
        window.location.href = 'weather_info.html'; 
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert(`Error fetching weather data: ${error.message}`); 
    }
}

// Function to display fetched api
function displayWeatherData(data) {
    const weatherDataDiv = document.getElementById('weatherData');
    weatherDataDiv.innerHTML = `
        <h3>${data.location.name}, ${data.location.region}, ${data.location.country}</h3>
        <p><strong>Local Time:</strong> ${data.location.localtime}</p>
        <p><strong>Current Temperature:</strong> ${data.current.temp_c}°C</p>
        <p><strong>Feels Like Temperature:</strong> ${data.current.feelslike_c}°C</p>
        <p><strong>Forecast Temperature (Max):</strong> ${data.forecast.forecastday[0].day.maxtemp_c}°C</p>
        <p><strong>Forecast Temperature (Min):</strong> ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        <p><strong>Sunrise:</strong> ${data.forecast.forecastday[0].astro.sunrise}</p>
        <p><strong>Sunset:</strong> ${data.forecast.forecastday[0].astro.sunset}</p>
        <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
        <p><strong>Weather Description:</strong> ${data.current.condition.text}</p>
        <p><strong>Icon:</strong> <img src="${data.current.condition.icon}" alt="Weather Icon"></p>
    `;
    displayClothingRecommendation(data.current.temp_c, data.current.condition.text);
}

function displayClothingRecommendation(temperature) {
    const recommendationDiv = document.getElementById('clothing_recommendation'); 
    const clothingImage = document.getElementById('clothing_image'); 
    let recommendation = '';
    let imageSrc = ''; 

    if (temperature <= 0) {
        recommendation = 'heavy winter coat, thermal layers, gloves, warm hat is recommended.';
        imageSrc = 'image/winter_clothe.jpg';
    } else if (temperature > 0 && temperature <= 10) {
        recommendation = 'A warm coat, sweater, scarf are recommended.';
        imageSrc = 'image/warm_jackets.jpg';
    } else if (temperature > 10 && temperature <= 20) {
        recommendation = 'A light jacket, sweater are recommended.';
        imageSrc = 'image/light_jackets.jpg';
    } else if (temperature > 20 && temperature <= 30) {
        recommendation = 'Short sleeves, light pants, shorts are recommended.';
        imageSrc = 'image/summer_clothes.jpg';
    } else {
        recommendation = 'Wear summer clothing such as shorts and a t-shirt.';
        imageSrc = 'image/summer_clothes.jpg';
    }

    recommendationDiv.textContent = recommendation; 
    clothingImage.src = imageSrc; 
    clothingImage.style.display = 'block'; 
}


document.addEventListener('DOMContentLoaded', () => {
    const weatherData = JSON.parse(localStorage.getItem('weatherData'));
    if (weatherData) {
        displayWeatherData(weatherData);
    }
});

// CRUD 
let itineraries = [];
let update_txt = null;

function addItinerary() {
    const itineraryInput = document.getElementById('itinerary_input');
    const itineraryDate = document.getElementById('itinerary_date');
    const itinerary = itineraryInput.value;
    const date = itineraryDate.value;

    if (itinerary && date) {
        if (update_txt !== null) {
            // Update existing itinerary
            itineraries[update_txt] = { date: date, activity: itinerary };
            update_txt = null; // Reset updating index
        } else {
            // Add new itinerary
            itineraries.push({ date: date, activity: itinerary });
        }

        // Clear input fields
        itineraryInput.value = '';
        itineraryDate.value = '';
        renderItineraryList();
    }
}

function renderItineraryList() {
    const itineraryList = document.getElementById('itinerary_list');
    itineraryList.innerHTML = '';
    itineraries.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.date}: ${item.activity}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            itineraries.splice(index, 1);
            renderItineraryList();
        };

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => {
            document.getElementById('itinerary_input').value = item.activity;
            document.getElementById('itinerary_date').value = item.date;
            update_txt = index; 
        };

        li.appendChild(updateButton);
        li.appendChild(deleteButton);
        itineraryList.appendChild(li);
    });
}
if (document.getElementById('add_itinerary')) {
    document.getElementById('add_itinerary').addEventListener('click', addItinerary);
}
