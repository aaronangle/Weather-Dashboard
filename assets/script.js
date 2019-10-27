var topDisplay = document.querySelector(".top-display")
var middleDisplay = document.querySelector(".middle-display")
var bottomDisplay = document.querySelector(".bottom-display")
var previousSearch = document.querySelector(".previousSearch")
var buttonList = document.querySelector(".button")
var input = document.querySelector(".input")
var searchBackground = document.querySelector(".search-background")
var today = new Date().toLocaleDateString()

//Onload asks for location to give approximate weather data for user
if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
        function success(position) {
            // for when getting location is a success
            var latitude = position.coords.latitude
            latitude = latitude.toFixed(0)
            var longitude = position.coords.longitude
            longitude = longitude.toFixed(0)
            console.log(latitude)
            getWeather("lat=" + latitude + "&lon=" + longitude)
        },
        function error(error_message) {
            // for when getting location results in an error
            console.error('An error has occured while retrieving location', error_message)
        }
    )
} else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser')
}


function getWeather(input) {

    topDisplay.textContent = "";
    bottomDisplay.textContent = "";
    middleDisplay.textContent = "";

    queryURL = "https://api.openweathermap.org/data/2.5/weather?" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

    fetch(queryURL, {
        method: "GET"
    }).then(data => data.json())


        .then(function (response) {

            //Gets the main weather condition
            var weatherDescritpion = response.weather[0].main

            //sets the image based on weather conditions
            var weatherImg = document.createElement("img")
            if (weatherDescritpion === "Clear") {
                weatherImg.src = "assets/images/sunny.png"
            } else if (weatherDescritpion === "Clouds") {
                weatherImg.src = "assets/images/cloudy.png"
            } else if (weatherDescritpion === "Drizzle" || weatherDescritpion === "Rain") {
                weatherImg.src = "assets/images/rain.png"
            } else if (weatherDescritpion === "Snowing") {
                weatherImg.src = "assets/images/snowing.png"
            } else if (weatherDescritpion === "Thunderstorm") {
                weatherImg.src = "assets/images/thunder.png"
            }
            //Add a class to the image for styling purposes
            weatherImg.className = "weatherImg"

            //Gets the temp and converts to Farenheit
            var temp = parseInt(response.main.temp)
            temp = (temp - 273.15) * 9 / 5 + 32
            temp = temp.toFixed(2)
            var temperatureText = document.createElement("p")
            temperatureText.textContent = "Temperature: " + temp + " °F"

            var humidity = response.main.humidity
            var humidityText = document.createElement("p")
            humidityText.textContent = "Humidty: " + humidity + "%"

            var windSpeed = response.wind.speed
            var windSpeedText = document.createElement("p")
            windSpeedText.textContent = "Wind Speed: " + windSpeed + " MPH"

            var cityName = response.name
            var cityText = document.createElement("h2")
            cityText.textContent = cityName + " " + "(" + today + ")"

            var headingHolder = document.createElement("div")
            headingHolder.className = "headingHolder"
            headingHolder.append(cityText, weatherImg)


            topDisplay.className = "top-displayBorder"

            topDisplay.append(headingHolder)
            topDisplay.append(temperatureText)
            topDisplay.append(humidityText)
            topDisplay.append(windSpeedText)

            var latitude = response.coord.lat
            var longitude = response.coord.lon

            //new URL to make another call to get the UV index
            uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

            fetch(uvURL, {
                method: "GET"
            }).then(data => data.json())
                .then(function (result) {

                    var uv = result.value
                    var uvSpan = document.createElement("span")
                    //Sets background color of the UV index based on how high it is
                    if (uv < 3) {
                        uvSpan.className = "uvGreen"
                        uvSpan.textContent = uv
                    } else if (uv <= 5) {
                        uvSpan.className = "uvYellow"
                        uvSpan.textContent = uv
                    } else {
                        uvSpan.className = "uvRed"
                        uvSpan.textContent = uv
                    }

                    var uvText = document.createElement("p")
                    uvText.textContent = "UV index: "
                    uvText.append(uvSpan)
                    topDisplay.append(uvText)
                })

        })

    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

    fetch(forecastURL, {
        method: "GET"
    }).then(data => data.json())
        .then(function (response) {

            //Counter for the date
            j = 0

            var date = document.createElement("h2")
            date.textContent = "5 Day Forecast:"
            middleDisplay.append(date)

            for (let i = 6; i < response.list.length; i += 8) {
                //increase counter
                j += 1
                //var for tommorow and the next five days
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + j)
                var nextDay = document.createElement("p")
                nextDay.textContent = tomorrow.toLocaleDateString()
                nextDay.className = "blueCardText"

                var blueCard = document.createElement("div")
                blueCard.className = "blueCard"

                var temp = parseInt(response.list[i].main.temp)
                temp = (temp - 273.15) * 9 / 5 + 32
                temp = temp.toFixed(0);
                var tempText = document.createElement("p")
                tempText.textContent = "Temp: " + temp + " °F";
                tempText.className = "blueCardText"

                var humidity = response.list[i].main.humidity;
                var humidityText = document.createElement("p")
                humidityText.textContent = "Humidity:" + humidity + "%";
                humidityText.className = "blueCardText"

                var weatherDesc = response.list[i].weather[0].main
                var weatherThumbnailImg = document.createElement("img")
                if (weatherDesc === "Clear") {
                    weatherThumbnailImg.src = "assets/images/sunny.png"
                } else if (weatherDesc === "Clouds") {
                    weatherThumbnailImg.src = "assets/images/cloudy.png"
                } else if (weatherDesc === "Drizzle" || weatherDesc === "Rain") {
                    weatherThumbnailImg.src = "assets/images/rain.png"
                } else if (weatherDesc === "Snow") {
                    weatherThumbnailImg.src = "assets/images/snowing.png"
                } else if (weatherDesc === "Thunderstorm") {
                    weatherThumbnailImg.src = "assets/images/thunder.png"
                }
                weatherThumbnailImg.className = "weatherThumbnail"

                blueCard.append(nextDay, weatherThumbnailImg, tempText, humidityText)
                bottomDisplay.append(blueCard)
            }


        })

}


searchBackground.addEventListener("click", function () {
    var userInput = input.value.trim()

    var button = document.createElement("button");
    button.className = userInput
    button.textContent = userInput
    previousSearch.prepend(button)

    buttonStorage.push(userInput)

    localStorage.setItem('Cities', buttonStorage)

    userInput = "q=" + userInput;
    getWeather(userInput)

    input.value = ""

})

var buttonStorage = []

//Loads the local storage and creates buttons
window.onload = function () {
    console.log("hi")
    var cityNameStorage = localStorage.getItem("Cities")
    var cityButton = cityNameStorage.split(",")
    cityButton.forEach(function (name) {
        var button = document.createElement("button");
        button.className = name
        button.textContent = name
        previousSearch.prepend(button)
        buttonStorage.push(name)
    })

}

previousSearch.addEventListener("click", function (event) {
    var eventTarget = event.target.className;

    eventTargetValue = "q=" + eventTarget;

    getWeather(eventTargetValue);
})