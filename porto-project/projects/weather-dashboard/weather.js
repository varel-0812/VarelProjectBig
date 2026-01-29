// Weather API functionality

class WeatherAPI {
    constructor() {
        // Using OpenWeatherMap API - You'll need to sign up for a free API key
        this.apiKey = 'a9b0ad67c4e68308151cf971d68f0e7b'; // Replace with your actual API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geoUrl = 'http://api.openweathermap.org/geo/1.0';
        
        // Default city
        this.currentCity = 'Jakarta';
        this.currentData = null;
        this.unit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
    }
    
    // Set API key
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    
    // Get current weather data
    async getCurrentWeather(city) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=${this.unit}`
            );
            
            if (!response.ok) {
                throw new Error('City not found. Please try again.');
            }
            
            const data = await response.json();
            this.currentData = data;
            this.currentCity = data.name;
            
            return data;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    }
    
    // Get weather forecast
    async getForecast(city) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=${this.unit}`
            );
            
            if (!response.ok) {
                throw new Error('Forecast data unavailable.');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }
    
    // Get weather by coordinates
    async getWeatherByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.unit}`
            );
            
            if (!response.ok) {
                throw new Error('Location weather data unavailable.');
            }
            
            const data = await response.json();
            this.currentData = data;
            this.currentCity = data.name;
            
            return data;
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            throw error;
        }
    }
    
    // Get forecast by coordinates
    async getForecastByCoords(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.unit}`
            );
            
            if (!response.ok) {
                throw new Error('Forecast data unavailable for this location.');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast by coordinates:', error);
            throw error;
        }
    }
    
    // Get city coordinates
    async getCityCoords(city) {
        try {
            const response = await fetch(
                `${this.geoUrl}/direct?q=${city}&limit=1&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('City not found.');
            }
            
            const data = await response.json();
            
            if (data.length === 0) {
                throw new Error('City not found. Please try again.');
            }
            
            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name,
                country: data[0].country
            };
        } catch (error) {
            console.error('Error fetching city coordinates:', error);
            throw error;
        }
    }
    
    // Get user's current location
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error('Unable to retrieve your location. Please enable location services.'));
                }
            );
        });
    }
    
    // Process forecast data for display
    processForecastData(forecastData) {
        const dailyForecast = {};
        const hourlyForecast = [];
        
        // Process 5-day forecast (3-hour intervals from API)
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toDateString();
            
            // Group by day for 5-day forecast
            if (!dailyForecast[day]) {
                dailyForecast[day] = {
                    date: date,
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                    weather: item.weather[0],
                    count: 1
                };
            } else {
                // Update min and max temps
                dailyForecast[day].temp_min = Math.min(dailyForecast[day].temp_min, item.main.temp_min);
                dailyForecast[day].temp_max = Math.max(dailyForecast[day].temp_max, item.main.temp_max);
                dailyForecast[day].count++;
            }
            
            // Get today's hourly forecast (next 24 hours)
            const now = new Date();
            const hoursDiff = (date - now) / (1000 * 60 * 60);
            
            if (hoursDiff >= 0 && hoursDiff <= 24 && hourlyForecast.length < 8) {
                hourlyForecast.push({
                    time: date,
                    temp: item.main.temp,
                    weather: item.weather[0]
                });
            }
        });
        
        // Convert to array and limit to 5 days
        const dailyArray = Object.values(dailyForecast).slice(0, 5);
        
        return {
            daily: dailyArray,
            hourly: hourlyForecast
        };
    }
}

// Create global instance
const weatherAPI = new WeatherAPI();