
let currCity = "Iasi";
let units = "metric";

let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');


document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    e.preventDefault();
    currCity = search.value; 
    getWeather();
    search.value = ""
})

document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        units = "metric" 
        getWeather()
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        units = "imperial"
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone){
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
    }
    return date.toLocaleString("ro-RO", options)
   
}
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["ro"], { type: "region" });
    return regionNames.of(country);
}

function getWeather(){
    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';
    const lang = 'ro';
    const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}&lang=${lang}`
    fetch(searchUrl)
    .then(res => {
        if (!res.ok) {
            throw new Error(`Orașul ${currCity} nu a fost găsit`);
        }
        return res.json();
    })
    .then(data => {
    console.log(data)
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${weatherDescriptions[data.weather[0].main]}</p>`;
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${data.main.humidity}%`
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`
    updateDateTime();

})
.catch(error => {
    console.error(error);
    city.innerHTML = "Orașul nu a fost găsit";
    weather__realfeel.innerHTML = "";
    weather__humidity.innerHTML = "";
    weather__wind.innerHTML = "";
    weather__pressure.innerHTML = "";
    weather__forecast.innerHTML = "";
    weather__minmax.innerHTML = "";
    weather__temperature.innerHTML = "";
    updateDateTime();
});
const weatherDescriptions = {
    'Clear': 'Senin',
    'Clouds': 'Înnorat',
    'Rain': 'Ploaie',
    'Drizzle': 'Burniță',
    'Thunderstorm': 'Furtună',
    "Fog": 'Ceață',
    "Mist": 'Ceață',
}
}
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",  
        hour12: false,
    };
    datetime.innerHTML = now.toLocaleString("ro-RO", options);
}
updateDateTime();


document.body.addEventListener('load', getWeather())