// Utility functions for Weather Dashboard

class Utils {
    // Format timestamp to readable date and time
    static formatDateTime(timestamp, timezone = 0) {
        const date = new Date((timestamp + timezone) * 1000);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Format time only
    static formatTime(timestamp, timezone = 0) {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Format date for forecast
    static formatDate(timestamp, timezone = 0) {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Get day name from timestamp
    static getDayName(timestamp, timezone = 0) {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
    
    // Convert temperature from Kelvin to Celsius
    static kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
    }
    
    // Convert temperature from Kelvin to Fahrenheit
    static kelvinToFahrenheit(kelvin) {
        return Math.round((kelvin - 273.15) * 9/5 + 32);
    }
    
    // Convert wind speed from m/s to km/h
    static msToKmh(ms) {
        return Math.round(ms * 3.6);
    }
    
    // Convert meters to kilometers
    static metersToKm(meters) {
        return (meters / 1000).toFixed(1);
    }
    
    // Get weather icon based on OpenWeatherMap icon code
    static getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        
        return iconMap[iconCode] || 'fas fa-question';
    }
    
    // Get weather description
    static getWeatherDescription(weatherId) {
        const descriptions = {
            200: 'Thunderstorm with light rain',
            201: 'Thunderstorm with rain',
            202: 'Thunderstorm with heavy rain',
            210: 'Light thunderstorm',
            211: 'Thunderstorm',
            212: 'Heavy thunderstorm',
            221: 'Ragged thunderstorm',
            230: 'Thunderstorm with light drizzle',
            231: 'Thunderstorm with drizzle',
            232: 'Thunderstorm with heavy drizzle',
            300: 'Light drizzle',
            301: 'Drizzle',
            302: 'Heavy drizzle',
            310: 'Light drizzle rain',
            311: 'Drizzle rain',
            312: 'Heavy drizzle rain',
            313: 'Shower rain and drizzle',
            314: 'Heavy shower rain and drizzle',
            321: 'Shower drizzle',
            500: 'Light rain',
            501: 'Moderate rain',
            502: 'Heavy rain',
            503: 'Very heavy rain',
            504: 'Extreme rain',
            511: 'Freezing rain',
            520: 'Light shower rain',
            521: 'Shower rain',
            522: 'Heavy shower rain',
            531: 'Ragged shower rain',
            600: 'Light snow',
            601: 'Snow',
            602: 'Heavy snow',
            611: 'Sleet',
            612: 'Light shower sleet',
            613: 'Shower sleet',
            615: 'Light rain and snow',
            616: 'Rain and snow',
            620: 'Light shower snow',
            621: 'Shower snow',
            622: 'Heavy shower snow',
            701: 'Mist',
            711: 'Smoke',
            721: 'Haze',
            731: 'Sand/dust whirls',
            741: 'Fog',
            751: 'Sand',
            761: 'Dust',
            762: 'Volcanic ash',
            771: 'Squalls',
            781: 'Tornado',
            800: 'Clear sky',
            801: 'Few clouds',
            802: 'Scattered clouds',
            803: 'Broken clouds',
            804: 'Overcast clouds'
        };
        
        return descriptions[weatherId] || 'Unknown weather condition';
    }
    
    // Update timestamp in header
    static updateTimestamp() {
        const now = new Date();
        const timestampElement = document.getElementById('timestamp');
        
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        timestampElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Show error message
    static showError(message) {
        // Create error element if it doesn't exist
        let errorEl = document.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            document.querySelector('.search-container').after(errorEl);
        }
        
        errorEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        errorEl.classList.add('show');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 5000);
    }
    
    // Show loading state
    static showLoading(show = true) {
        const searchBtn = document.getElementById('searchBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (show) {
            searchBtn.innerHTML = '<span class="spinner"></span> Searching';
            refreshBtn.innerHTML = '<span class="spinner"></span> Refreshing';
            searchBtn.disabled = true;
            refreshBtn.disabled = true;
        } else {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            searchBtn.disabled = false;
            refreshBtn.disabled = false;
        }
    }
}