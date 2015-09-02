(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

console.log("broken?");
function qs(selector) {
    return document.querySelector(selector);
}

function qsAll(selector) {
    return document.querySelectorAll(selector);
}

//-------------------------------------------------------------------------------------------

var GPS = new Promise(function (res, rej) {
    navigator.geolocation.getCurrentPosition(function (gpsData) {
        return res({
            lat: gpsData.coords.latitude,
            lon: gpsData.coords.longitude,
            formatted_address: "your area"
        });
    }, function (error) {
        return rej(error.message);
    });
});

var fetchWeatherData_callback = function (ll) {
    var key = "d1d2cfa5c1f21a639607f391988f2da9",
        url = "https://api.forecast.io/forecast/" + key + "/" + ll.lat + "," + ll.lon + "?callback=?",
        x = $.getJSON(url).then(function (r) {

        //Weather Object

        console.log(r);
        console.log("Promise is working");

        //Quick weather
        var current_data = r.currently,
            temp_current = current_data.temperature,
            appTemp_current = current_data.apparentTemperature,
            precProb_current = current_data.precipProbability * 100,
            summary_current = current_data.summary,
            visibility = current_data.visibility,
            humidity_current = current_data.humidity * 100,
            wind_current = current_data.windSpeed;

        qs(".current-temp").innerHTML = "" + Math.round(temp_current) + "°";

        //Iphone Clock
        var clock = setInterval(function () {
            myTimer();
        }, 1000);

        function myTimer() {
            var d = new Date();
            qs(".time").innerHTML = d.toLocaleTimeString();
        }

        var weather_icon_src_generator = function weather_icon_src_generator(dayX_data) {

            if (dayX_data.cloudCover < 0.3) {
                return "../images/sun.png";
            } else if (dayX_data.cloudCover > 0.3 && dayX_data.cloudCover < 0.5) {
                return "../images/partlysunny.png";
            } else if (dayX_data.cloudCover > 0.5 && dayX_data.precipProbability < 0.5) {
                return "../images/cloudy.png";
            } else {
                return "../images/rain.png";
            }
        };

        //Daily forecast data
        function displayDayX(dayX) {
            var daily_data = r.daily.data[dayX],
                highLow = "" + Math.round(daily_data.temperatureMax) + "°/" + Math.round(daily_data.temperatureMin) + "°",
                chance_of_precipitation = "Chance of precipitation: " + Math.round(daily_data.precipProbability * 100) + "%",
                weather_icon_src = weather_icon_src_generator(daily_data);

            qs(".dayoftheweek img").src = weather_icon_src;
            qs("#chancePrecip").innerHTML = chance_of_precipitation;
        }

        //Weekly Forecast data

        var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var days = [0, 1, 2, 3, 4, 5, 6, 7];

        function getDay_of_week(day) {
            return weekdays[(new Date().getDay() - 1 + day) % 7];
        }

        days.forEach(function (day) {
            var week_data = r.daily.data[day],
                week_highLow = "" + Math.round(week_data.temperatureMax) + "°hi/" + Math.round(week_data.temperatureMin) + "°lo",
                week_weather_icon_src = "" + weather_icon_src_generator(week_data);

            qs(".dayoftheweek:nth-of-type(" + (day + 1) + ") span:first-child").innerHTML = getDay_of_week(day);
            qs(".dayoftheweek:nth-of-type(" + (day + 1) + ") img").src = week_weather_icon_src;
            qs(".dayoftheweek:nth-of-type(" + (day + 1) + ") span:nth-of-type(2)").innerHTML = week_highLow;
        });
    });
};

//Scrolling

$(document).ready(function () {

    $("#image-container").bind("mousemove", function (event) {
        console.log("dvffdg");
        var x = event.clientX;
        var y = event.clientY;

        $("#image-container").css("top", y / 10);
        $("#image-container").css("left", x / 10);
    });
});

GPS.then(fetchWeatherData_callback);

//Router

},{}]},{},[1]);
