class WeatherInfo {
    constructor() {
        this.currCity = "Iasi";
        this.units = "metric";
        this.city = document.querySelector(".weather__city");
        this.datetime = document.querySelector(".weather__datetime");
        this.weatherForecast = document.querySelector('.weather__forecast');
        this.weatherTemperature = document.querySelector(".weather__temperature");
        this.weatherIcon = document.querySelector(".weather__icon");
        this.weatherMinmax = document.querySelector(".weather__minmax");
        this.weatherRealFeel = document.querySelector('.weather__realfeel');
        this.weatherHumidity = document.querySelector('.weather__humidity');
        this.weatherWind = document.querySelector('.weather__wind');
        this.weatherPressure = document.querySelector('.weather__pressure');
        this.weatherDescriptions = {
            'Clear': 'Senin',
            'Clouds': 'Înnorat',
            'Rain': 'Ploaie',
            'Drizzle': 'Burniță',
            'Thunderstorm': 'Furtună',
            "Fog": 'Ceață',
            "Mist": 'Ceață',
            "Snow": 'Ninsoare'
        };
    }

    async getWeatherData() {
        const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';
        const lang = 'ro';
        const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.currCity}&appid=${API_KEY}&units=${this.units}&lang=${lang}`;

        try {
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`Orașul ${this.currCity} nu a fost găsit`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    updateUI(data) {
        console.log(data);
        this.city.innerHTML = `${data.name}, ${this.convertCountryCode(data.sys.country)}`;
        this.datetime.innerHTML = this.convertTimeStamp(data.dt, data.timezone);
        this.weatherForecast.innerHTML = `<p>${this.weatherDescriptions[data.weather[0].main]}</p>`;
        this.weatherTemperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
        this.weatherIcon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
        this.weatherMinmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
        this.weatherRealFeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
        this.weatherHumidity.innerHTML = `${data.main.humidity}%`;
        this.weatherWind.innerHTML = `${data.wind.speed} ${this.units === "imperial" ? "mph" : "m/s"}`;
        this.weatherPressure.innerHTML = `${data.main.pressure} hPa`;
        this.updateDateTime();
    }

    updateDateTime() {
        const now = new Date();
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Bucharest",
            hour12: false,
        };
        this.datetime.innerHTML = now.toLocaleString("ro-RO", options);
    }

    convertTimeStamp(timestamp, timezone) {
        const convertTimezone = timezone / 3600;
        const date = new Date(timestamp * 1000);
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
            hour12: true,
        };
        return date.toLocaleString("ro-RO", options);
    }

    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["ro"], { type: "region" });
        return regionNames.of(country);
    }

    async fetchDataAndUpdateUI() {
        try {
            const data = await this.getWeatherData();
            this.updateUI(data);
        } catch (error) {
            this.city.innerHTML = "Orașul nu a fost găsit";
            this.weatherRealFeel.innerHTML = "";
            this.weatherHumidity.innerHTML = "";
            this.weatherWind.innerHTML = "";
            this.weatherPressure.innerHTML = "";
            this.weatherForecast.innerHTML = "";
            this.weatherMinmax.innerHTML = "";
            this.weatherTemperature.innerHTML = "";
            this.updateDateTime();
        }
    }
}

const weatherInfo = new WeatherInfo();

document.querySelector(".weather__search").addEventListener('submit', e => {
    e.preventDefault();
    let search = document.querySelector(".weather__searchform");
    weatherInfo.currCity = search.value;
    weatherInfo.fetchDataAndUpdateUI();
    search.value = "";
});

document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (weatherInfo.units !== "metric") {
        weatherInfo.units = "metric";
        weatherInfo.fetchDataAndUpdateUI();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (weatherInfo.units !== "imperial") {
        weatherInfo.units = "imperial";
        weatherInfo.fetchDataAndUpdateUI();
    }
});

document.body.addEventListener('load', () => {
    weatherInfo.fetchDataAndUpdateUI();
});

document.addEventListener('DOMContentLoaded', () => {
    weatherInfo.fetchDataAndUpdateUI();
});
