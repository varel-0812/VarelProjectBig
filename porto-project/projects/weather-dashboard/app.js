// Main application logic

class WeatherApp {
    constructor() {
        this.weatherAPI = weatherAPI;
        this.currentData = null;
        this.forecastData = null;
        
        // Initialize the app
        this.init();
    }
    
    init() {
        // Update timestamp every second
        Utils.updateTimestamp();
        setInterval(Utils.updateTimestamp, 1000);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load default weather data
        this.loadWeatherData('Jakarta');
    }
    
    setupEventListeners() {
        // Search button click
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });
        
        // Enter key in search input
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Location button click
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.handleLocationSearch();
        });
        
        // Refresh button click
        document.getElementById('refreshBtn').addEventListener('click', () => {
            if (this.currentData) {
                this.loadWeatherData(this.currentData.name);
            }
        });
    }
    
    handleSearch() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (city) {
            this.loadWeatherData(city);
            cityInput.value = '';
        } else {
            Utils.showError('Please enter a city name.');
        }
    }
    
    async handleLocationSearch() {
        try {
            Utils.showLoading(true);
            const coords = await this.weatherAPI.getCurrentLocation();
            await this.loadWeatherByCoords(coords.lat, coords.lon);
        } catch (error) {
            Utils.showError(error.message);
            Utils.showLoading(false);
        }
    }
    
    async loadWeatherData(city) {
        try {
            Utils.showLoading(true);
            
            // Get current weather
            const currentWeather = await this.weatherAPI.getCurrentWeather(city);
            this.currentData = currentWeather;
            
            // Get forecast
            const forecast = await this.weatherAPI.getForecast(city);
            this.forecastData = forecast;
            
            // Update UI
            this.updateCurrentWeather(currentWeather);
            this.updateForecast(forecast);
            
        } catch (error) {
            Utils.showError(error.message);
        } finally {
            Utils.showLoading(false);
        }
    }
    
    async loadWeatherByCoords(lat, lon) {
        try {
            Utils.showLoading(true);
            
            // Get current weather by coordinates
            const currentWeather = await this.weatherAPI.getWeatherByCoords(lat, lon);
            this.currentData = currentWeather;
            
            // Get forecast by coordinates
            const forecast = await this.weatherAPI.getForecastByCoords(lat, lon);
            this.forecastData = forecast;
            
            // Update UI
            this.updateCurrentWeather(currentWeather);
            this.updateForecast(forecast);
            
        } catch (error) {
            Utils.showError(error.message);
        } finally {
            Utils.showLoading(false);
        }
    }
    
    updateCurrentWeather(data) {
        // Update city name
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        
        // Update date
        document.getElementById('currentDate').textContent = 
            Utils.formatDateTime(data.dt, data.timezone);
        
        // Update temperature
        document.getElementById('currentTemp').textContent = 
            Math.round(data.main.temp);
        
        // Update weather icon and description
        const weather = data.weather[0];
        document.getElementById('weatherIcon').className = 
            Utils.getWeatherIcon(weather.icon);
        document.getElementById('weatherDescription').textContent = 
            Utils.getWeatherDescription(weather.id);
        
        // Update details
        document.getElementById('feelsLike').textContent = 
            `${Math.round(data.main.feels_like)}°C`;
        document.getElementById('humidity').textContent = 
            `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = 
            `${data.wind.speed} m/s`;
        document.getElementById('pressure').textContent = 
            `${data.main.pressure} hPa`;
        
        // Update additional info
        document.getElementById('sunrise').textContent = 
            Utils.formatTime(data.sys.sunrise, data.timezone);
        document.getElementById('sunset').textContent = 
            Utils.formatTime(data.sys.sunset, data.timezone);
        document.getElementById('visibility').textContent = 
            `${Utils.metersToKm(data.visibility)} km`;
        document.getElementById('cloudiness').textContent = 
            `${data.clouds.all}%`;
        document.getElementById('lastUpdated').textContent = 
            Utils.formatTime(data.dt, data.timezone);
        
        // UV index is not in current weather API, would need separate call
        document.getElementById('uvIndex').textContent = '--';
    }
    
    updateForecast(forecastData) {
        const processed = this.weatherAPI.processForecastData(forecastData);
        
        // Update 5-day forecast
        this.updateDailyForecast(processed.daily);
        
        // Update hourly forecast
        this.updateHourlyForecast(processed.hourly);
    }
    
    updateDailyForecast(dailyData) {
        const forecastContainer = document.getElementById('forecastDays');
        forecastContainer.innerHTML = '';
        
        dailyData.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            
            dayElement.innerHTML = `
                <div class="forecast-date">${Utils.formatDate(day.date.getTime() / 1000)}</div>
                <div class="forecast-day-name">${Utils.getDayName(day.date.getTime() / 1000)}</div>
                <div class="forecast-icon">
                    <i class="${Utils.getWeatherIcon(day.weather.icon)}"></i>
                </div>
                <div class="forecast-temp">
                    <span class="temp-high">${Math.round(day.temp_max)}°</span>
                    <span class="temp-low">${Math.round(day.temp_min)}°</span>
                </div>
                <div class="forecast-condition">${day.weather.description}</div>
            `;
            
            forecastContainer.appendChild(dayElement);
        });
    }
    
    updateHourlyForecast(hourlyData) {
        const hourlyContainer = document.getElementById('hourlyForecast');
        hourlyContainer.innerHTML = '';
        
        hourlyData.forEach(hour => {
            const hourElement = document.createElement('div');
            hourElement.className = 'hourly-item';
            
            hourElement.innerHTML = `
                <div class="hour-time">${Utils.formatTime(hour.time.getTime() / 1000)}</div>
                <div class="hour-icon">
                    <i class="${Utils.getWeatherIcon(hour.weather.icon)}"></i>
                </div>
                <div class="hour-temp">${Math.round(hour.temp)}°</div>
                <div class="hour-condition">${hour.weather.description}</div>
            `;
            
            hourlyContainer.appendChild(hourElement);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // You need to get your own API key from https://openweathermap.org/api
    // For demo purposes, we'll use a placeholder
    // In a real application, you should sign up for your own API key
    
    const app = new WeatherApp();
    
    // Note: The app will work partially without an API key, 
    // but you'll need to sign up for a free API key at openweathermap.org
    // and replace 'YOUR_API_KEY_HERE' in weather.js with your actual key
    
    // Show a message about API key
    console.log('Weather Dashboard initialized.');
    console.log('Note: To get full functionality, please:');
    console.log('1. Sign up for a free API key at https://openweathermap.org/api');
    console.log('2. Replace "YOUR_API_KEY_HERE" in js/weather.js with your actual API key');
});