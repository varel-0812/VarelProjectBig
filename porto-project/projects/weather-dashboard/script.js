// Weather Dashboard - Full Functionality
document.addEventListener('DOMContentLoaded', () => {
    class WeatherDashboard {
        constructor() {
            this.currentCity = 'Jakarta';
            this.currentCountry = 'Indonesia';
            this.favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
            this.weatherData = null;
            this.temperatureChart = null;
            this.precipitationChart = null;
            this.cities = [
                { name: 'Jakarta', country: 'Indonesia', lat: -6.2, lon: 106.8 },
                { name: 'Bandung', country: 'Indonesia', lat: -6.9, lon: 107.6 },
                { name: 'Surabaya', country: 'Indonesia', lat: -7.25, lon: 112.75 },
                { name: 'Bali', country: 'Indonesia', lat: -8.4, lon: 115.2 },
                { name: 'Singapore', country: 'Singapore', lat: 1.35, lon: 103.8 },
                { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.15, lon: 101.7 },
                { name: 'Bangkok', country: 'Thailand', lat: 13.75, lon: 100.5 },
                { name: 'Tokyo', country: 'Japan', lat: 35.7, lon: 139.7 },
                { name: 'Seoul', country: 'South Korea', lat: 37.6, lon: 127.0 },
                { name: 'Sydney', country: 'Australia', lat: -33.9, lon: 151.2 },
                { name: 'London', country: 'UK', lat: 51.5, lon: -0.1 },
                { name: 'New York', country: 'USA', lat: 40.7, lon: -74.0 }
            ];
            
            this.init();
        }
        
        init() {
            this.loadWeatherData();
            this.updateTime();
            this.renderFavorites();
            this.setupEventListeners();
            this.setupCharts();
            this.setupSearch();
            
            // Update time every minute
            setInterval(() => this.updateTime(), 60000);
        }
        
        loadWeatherData() {
            // Simulate weather data for current city
            const cityData = this.cities.find(c => c.name === this.currentCity);
            
            if (!cityData) return;
            
            // Generate realistic weather data
            this.weatherData = {
                city: this.currentCity,
                country: cityData.country,
                current: {
                    temp: this.getRandomTemp(25, 35),
                    feels_like: this.getRandomTemp(24, 36),
                    humidity: Math.floor(Math.random() * 30) + 60,
                    pressure: Math.floor(Math.random() * 20) + 1000,
                    wind_speed: (Math.random() * 15 + 5).toFixed(1),
                    wind_deg: Math.floor(Math.random() * 360),
                    visibility: Math.floor(Math.random() * 10) + 5,
                    uv_index: Math.floor(Math.random() * 8) + 1,
                    precipitation: (Math.random() * 5).toFixed(1),
                    condition: this.getRandomCondition(),
                    icon: this.getWeatherIcon(this.getRandomCondition()),
                    temp_min: this.getRandomTemp(22, 28),
                    temp_max: this.getRandomTemp(30, 36)
                },
                hourly: this.generateHourlyData(),
                daily: this.generateDailyData(),
                alerts: this.generateAlerts()
            };
            
            this.updateDisplay();
        }
        
        getRandomTemp(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        getRandomCondition() {
            const conditions = [
                'Cerah', 'Cerah Berawan', 'Berawan', 
                'Hujan Ringan', 'Hujan Sedang', 'Hujan Lebat',
                'Petir', 'Kabut', 'Mendung'
            ];
            return conditions[Math.floor(Math.random() * conditions.length)];
        }
        
        getWeatherIcon(condition) {
            const icons = {
                'Cerah': 'fas fa-sun',
                'Cerah Berawan': 'fas fa-cloud-sun',
                'Berawan': 'fas fa-cloud',
                'Hujan Ringan': 'fas fa-cloud-rain',
                'Hujan Sedang': 'fas fa-cloud-showers-heavy',
                'Hujan Lebat': 'fas fa-cloud-rain',
                'Petir': 'fas fa-bolt',
                'Kabut': 'fas fa-smog',
                'Mendung': 'fas fa-cloud'
            };
            return icons[condition] || 'fas fa-cloud';
        }
        
        generateHourlyData() {
            const hours = [];
            const now = new Date();
            
            for (let i = 0; i < 24; i++) {
                const hourTime = new Date(now.getTime() + i * 60 * 60 * 1000);
                hours.push({
                    time: hourTime.getHours().toString().padStart(2, '0') + ':00',
                    temp: this.getRandomTemp(24, 34),
                    condition: this.getRandomCondition(),
                    icon: this.getWeatherIcon(this.getRandomCondition()),
                    precipitation: Math.random() > 0.7 ? (Math.random() * 3).toFixed(1) : 0
                });
            }
            
            return hours;
        }
        
        generateDailyData() {
            const days = [];
            const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const today = new Date();
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
                days.push({
                    day: dayNames[date.getDay()],
                    date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
                    temp_min: this.getRandomTemp(23, 27),
                    temp_max: this.getRandomTemp(30, 35),
                    condition: this.getRandomCondition(),
                    icon: this.getWeatherIcon(this.getRandomCondition()),
                    precipitation: Math.random() > 0.5 ? (Math.random() * 5).toFixed(1) : 0
                });
            }
            
            return days;
        }
        
        generateAlerts() {
            const alerts = [];
            const alertTypes = [
                { type: 'Hujan Lebat', icon: 'fas fa-cloud-showers-heavy', chance: 0.3 },
                { type: 'Angin Kencang', icon: 'fas fa-wind', chance: 0.2 },
                { type: 'Petir', icon: 'fas fa-bolt', chance: 0.1 },
                { type: 'Kabut Tebal', icon: 'fas fa-smog', chance: 0.15 }
            ];
            
            alertTypes.forEach(alert => {
                if (Math.random() < alert.chance) {
                    alerts.push({
                        type: alert.type,
                        icon: alert.icon,
                        message: `${alert.type} diperkirakan terjadi hari ini.`
                    });
                }
            });
            
            return alerts;
        }
        
        updateDisplay() {
            if (!this.weatherData) return;
            
            const data = this.weatherData;
            
            // Update current weather
            document.getElementById('currentCity').textContent = `${data.city}, ${data.country}`;
            document.getElementById('currentTemp').textContent = `${data.current.temp}°C`;
            document.getElementById('tempMin').textContent = `${data.current.temp_min}°C`;
            document.getElementById('tempMax').textContent = `${data.current.temp_max}°C`;
            document.getElementById('weatherCondition').textContent = data.current.condition;
            document.getElementById('weatherIcon').innerHTML = `<i class="${data.current.icon}"></i>`;
            
            // Update details
            document.getElementById('humidity').textContent = `${data.current.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.current.wind_speed} km/jam`;
            document.getElementById('pressure').textContent = `${data.current.pressure} hPa`;
            document.getElementById('visibility').textContent = `${data.current.visibility} km`;
            document.getElementById('uvIndex').textContent = `${data.current.uv_index} ${this.getUvLevel(data.current.uv_index)}`;
            document.getElementById('precipitation').textContent = `${data.current.precipitation} mm`;
            
            // Update forecast
            this.renderForecast();
            
            // Update hourly
            this.renderHourly();
            
            // Update alerts
            this.renderAlerts();
            
            // Update charts
            this.updateCharts();
        }
        
        getUvLevel(uvIndex) {
            if (uvIndex <= 2) return 'Rendah';
            if (uvIndex <= 5) return 'Sedang';
            if (uvIndex <= 7) return 'Tinggi';
            if (uvIndex <= 10) return 'Sangat Tinggi';
            return 'Ekstrem';
        }
        
        renderForecast() {
            const forecastDays = document.getElementById('forecastDays');
            forecastDays.innerHTML = '';
            
            this.weatherData.daily.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'forecast-day';
                dayElement.innerHTML = `
                    <div class="day-name">${day.day}</div>
                    <div class="day-date">${day.date}</div>
                    <div class="day-icon">
                        <i class="${day.icon}"></i>
                    </div>
                    <div class="day-temp">${day.temp_max}°</div>
                    <div class="day-condition">${day.condition}</div>
                `;
                forecastDays.appendChild(dayElement);
            });
        }
        
        renderHourly() {
            const hourlyForecast = document.getElementById('hourlyForecast');
            hourlyForecast.innerHTML = '';
            
            this.weatherData.hourly.forEach((hour, index) => {
                if (index % 2 === 0) { // Show every other hour for space
                    const hourElement = document.createElement('div');
                    hourElement.className = 'hourly-item';
                    hourElement.innerHTML = `
                        <div class="hourly-time">${hour.time}</div>
                        <div class="hourly-icon">
                            <i class="${hour.icon}"></i>
                        </div>
                        <div class="hourly-temp">${hour.temp}°</div>
                        ${hour.precipitation > 0 ? 
                            `<div class="hourly-precipitation">${hour.precipitation}mm</div>` : 
                            '<div class="hourly-precipitation">&nbsp;</div>'}
                    `;
                    hourlyForecast.appendChild(hourElement);
                }
            });
        }
        
        renderAlerts() {
            const weatherAlerts = document.getElementById('weatherAlerts');
            const alertsContainer = weatherAlerts.querySelector('.alert-card')?.parentElement || weatherAlerts;
            
            // Clear existing alerts except heading
            const heading = weatherAlerts.querySelector('h3');
            alertsContainer.innerHTML = '';
            if (heading) alertsContainer.appendChild(heading);
            
            if (this.weatherData.alerts.length === 0) {
                const noAlerts = document.createElement('div');
                noAlerts.className = 'alert-card';
                noAlerts.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <div class="alert-content">
                        <h4>Tidak Ada Peringatan</h4>
                        <p>Tidak ada peringatan cuaca untuk ${this.currentCity}.</p>
                    </div>
                `;
                alertsContainer.appendChild(noAlerts);
            } else {
                this.weatherData.alerts.forEach(alert => {
                    const alertElement = document.createElement('div');
                    alertElement.className = 'alert-card';
                    alertElement.innerHTML = `
                        <i class="${alert.icon}"></i>
                        <div class="alert-content">
                            <h4>${alert.type}</h4>
                            <p>${alert.message}</p>
                        </div>
                    `;
                    alertsContainer.appendChild(alertElement);
                });
            }
        }
        
        setupCharts() {
            const tempCtx = document.getElementById('temperatureChart').getContext('2d');
            const precipCtx = document.getElementById('precipitationChart').getContext('2d');
            
            // Temperature Chart
            this.temperatureChart = new Chart(tempCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    datasets: [{
                        label: 'Suhu (°C)',
                        data: [24, 23, 28, 32, 30, 27],
                        borderColor: '#ff003c',
                        backgroundColor: 'rgba(255, 0, 60, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaaaaa'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaaaaa'
                            }
                        }
                    }
                }
            });
            
            // Precipitation Chart
            this.precipitationChart = new Chart(precipCtx, {
                type: 'bar',
                data: {
                    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    datasets: [{
                        label: 'Presipitasi (mm)',
                        data: [2.1, 0, 5.3, 1.2, 0.5, 3.7, 0.2],
                        backgroundColor: 'rgba(0, 150, 255, 0.5)',
                        borderColor: '#0096ff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaaaaa'
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#aaaaaa'
                            }
                        }
                    }
                }
            });
        }
        
        updateCharts() {
            if (!this.temperatureChart || !this.precipitationChart) return;
            
            // Update temperature chart with hourly data
            const hourlyTemps = this.weatherData.hourly
                .filter((_, i) => i % 4 === 0)
                .slice(0, 6)
                .map(h => h.temp);
            
            this.temperatureChart.data.datasets[0].data = hourlyTemps;
            this.temperatureChart.update();
            
            // Update precipitation chart with daily data
            const dailyPrecip = this.weatherData.daily.map(d => parseFloat(d.precipitation));
            this.precipitationChart.data.datasets[0].data = dailyPrecip;
            this.precipitationChart.update();
        }
        
        updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            document.getElementById('currentTime').innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${dateString} ${timeString}</span>
            `;
        }
        
        setupSearch() {
            const searchInput = document.getElementById('cityInput');
            const suggestions = document.getElementById('searchSuggestions');
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                
                if (query.length < 2) {
                    suggestions.classList.remove('active');
                    return;
                }
                
                const filtered = this.cities.filter(city =>
                    city.name.toLowerCase().includes(query) ||
                    city.country.toLowerCase().includes(query)
                );
                
                if (filtered.length > 0) {
                    suggestions.innerHTML = filtered.map(city => `
                        <div class="suggestion-item" data-city="${city.name}" data-country="${city.country}">
                            <strong>${city.name}</strong>, ${city.country}
                        </div>
                    `).join('');
                    
                    suggestions.classList.add('active');
                    
                    // Add click events to suggestions
                    suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const city = item.dataset.city;
                            const country = item.dataset.country;
                            this.changeCity(city, country);
                            searchInput.value = '';
                            suggestions.classList.remove('active');
                        });
                    });
                } else {
                    suggestions.classList.remove('active');
                }
            });
            
            // Close suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
                    suggestions.classList.remove('active');
                }
            });
            
            // Enter key to search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.searchCity(query);
                        searchInput.value = '';
                        suggestions.classList.remove('active');
                    }
                }
            });
        }
        
        searchCity(query) {
            const city = this.cities.find(c =>
                c.name.toLowerCase() === query.toLowerCase() ||
                c.country.toLowerCase() === query.toLowerCase()
            );
            
            if (city) {
                this.changeCity(city.name, city.country);
                this.showNotification(`Menampilkan cuaca untuk ${city.name}, ${city.country}`);
            } else {
                this.showNotification(`Kota "${query}" tidak ditemukan.`);
            }
        }
        
        changeCity(city, country) {
            this.currentCity = city;
            this.currentCountry = country;
            this.loadWeatherData();
        }
        
        setupEventListeners() {
            // Location button
            document.getElementById('useLocationBtn').addEventListener('click', () => {
                this.showNotification('Menggunakan lokasi Anda...');
                
                // Simulate location detection
                setTimeout(() => {
                    const randomCity = this.cities[Math.floor(Math.random() * this.cities.length)];
                    this.changeCity(randomCity.name, randomCity.country);
                    this.showNotification(`Lokasi terdeteksi: ${randomCity.name}, ${randomCity.country}`);
                }, 1500);
            });
            
            // Add favorite button
            document.getElementById('addFavoriteBtn').addEventListener('click', () => {
                this.showAddFavoriteModal();
            });
            
            // Initialize favorites
            this.renderFavorites();
        }
        
        renderFavorites() {
            const favoritesGrid = document.getElementById('favoritesGrid');
            favoritesGrid.innerHTML = '';
            
            if (this.favorites.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="no-favorites">
                        <i class="fas fa-star"></i>
                        <p>Belum ada kota favorit</p>
                    </div>
                `;
                return;
            }
            
            this.favorites.forEach(fav => {
                const cityData = this.cities.find(c => c.name === fav.city);
                if (!cityData) return;
                
                const temp = this.getRandomTemp(20, 35);
                const condition = this.getRandomCondition();
                const icon = this.getWeatherIcon(condition);
                
                const favoriteElement = document.createElement('div');
                favoriteElement.className = 'favorite-city';
                favoriteElement.innerHTML = `
                    <button class="remove-favorite" data-city="${fav.city}">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="favorite-city-name">${fav.city}</div>
                    <div class="favorite-city-temp">${temp}°C</div>
                    <div class="favorite-city-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="favorite-city-condition">${condition}</div>
                `;
                
                // Click to view city weather
                favoriteElement.addEventListener('click', (e) => {
                    if (!e.target.closest('.remove-favorite')) {
                        this.changeCity(fav.city, fav.country);
                    }
                });
                
                // Remove favorite
                const removeBtn = favoriteElement.querySelector('.remove-favorite');
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeFavorite(fav.city);
                });
                
                favoritesGrid.appendChild(favoriteElement);
            });
        }
        
        showAddFavoriteModal() {
            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3><i class="fas fa-star"></i> Tambah Kota Favorit</h3>
                    <input type="text" class="modal-input" id="favoriteCityInput" placeholder="Nama kota...">
                    <select class="modal-select" id="favoriteCountrySelect">
                        <option value="">Pilih negara...</option>
                        ${[...new Set(this.cities.map(c => c.country))].map(country => 
                            `<option value="${country}">${country}</option>`
                        ).join('')}
                    </select>
                    <div class="modal-buttons">
                        <button class="modal-btn secondary cancel-btn">Batal</button>
                        <button class="modal-btn primary save-btn">Simpan</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            const closeModal = () => modal.remove();
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
            
            // Save favorite
            modal.querySelector('.save-btn').addEventListener('click', () => {
                const city = modal.querySelector('#favoriteCityInput').value.trim();
                const country = modal.querySelector('#favoriteCountrySelect').value;
                
                if (!city || !country) {
                    this.showNotification('Harap isi semua field!');
                    return;
                }
                
                // Check if already in favorites
                if (this.favorites.some(f => f.city === city && f.country === country)) {
                    this.showNotification('Kota sudah ada di favorit!');
                    return;
                }
                
                this.addFavorite(city, country);
                closeModal();
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        
        addFavorite(city, country) {
            this.favorites.push({ city, country });
            localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
            this.renderFavorites();
            this.showNotification(`${city} ditambahkan ke favorit!`);
        }
        
        removeFavorite(city) {
            this.favorites = this.favorites.filter(f => f.city !== city);
            localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
            this.renderFavorites();
            this.showNotification(`${city} dihapus dari favorit!`);
        }
        
        showNotification(message) {
            // Remove existing notifications
            document.querySelectorAll('.notification').forEach(n => n.remove());
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
    
    // Initialize the dashboard
    const weatherDashboard = new WeatherDashboard();
});