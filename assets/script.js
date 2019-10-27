var topDisplay = $(".top-display")
var bottomDisplay = $(".bottom-display")
var previousSearch = $(".previousSearch")
var today = new Date().toLocaleDateString()
var buttonList = $(".button")

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



//Function for get the weather based off user input
function getWeather(input) {

    //clear out the top and bottom displays to display new data
    topDisplay.empty()
    bottomDisplay.empty()
    $(".middle-display").empty()

    //Make a call to open weather with the user inputs
    queryURL = "https://api.openweathermap.org/data/2.5/weather?" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

    //initial AJAX call for weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        //Gets the main weather condition
        var weatherDescritpion = response.weather[0].main

        //sets the image based on weather conditions
        var weatherImg = $("<img>")
        if (weatherDescritpion === "Clear") {
            weatherImg.attr("src", "assets/images/sunny.png")
        } else if (weatherDescritpion === "Clouds") {
            weatherImg.attr("src", "assets/images/cloudy.png")
        } else if (weatherDescritpion === "Drizzle" || weatherDescritpion === "Rain") {
            weatherImg.attr("src", "assets/images/rain.png")
        } else if (weatherDescritpion === "Snowing") {
            weatherImg.attr("src", "assets/images/snowing.png")
        }
        //Add a class to the image for styling purposes
        weatherImg.addClass("weatherImg")

        //Gets the temp and converts to Farenheit
        var temp = parseInt(response.main.temp)
        temp = (temp - 273.15) * 9 / 5 + 32
        temp = temp.toFixed(2)
        var temperatureText = $("<p>").text("Temperature: " + temp + " °F")

        var humidity = response.main.humidity
        var humidityText = $("<p>").text("Humidty: " + humidity + "%")

        var windSpeed = response.wind.speed
        var windSpeedText = $("<p>").text("Wind Speed: " + windSpeed + " MPH")

        var cityName = response.name
        var cityText = $("<h2>").text(cityName + " " + "(" + today + ")")

        var headingHolder = $("<div>").addClass("headingHolder")
        headingHolder.append(cityText, weatherImg)


        topDisplay.addClass("top-displayBorder")
        topDisplay.append(headingHolder, temperatureText, humidityText, windSpeedText)

        var latitude = response.coord.lat
        var longitude = response.coord.lon

        //new URL to make another call to get the UV index
        uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (result) {

            var uv = result.value

            //Sets background color of the UV index based on how high it is
            if (uv < 3) {
                var uv = $("<span>").text(uv).addClass("uvGreen")
            } else if (uv <= 5) {
                var uv = $("<span>").text(uv).addClass("uvYellow")
            } else {
                var uv = $("<span>").text(uv).addClass("uvRed")
            }

            var uvText = $("<p>").text("UV index: ")
            uvText.append(uv)
            topDisplay.append(uvText)
        })


    })

    //5 DAY FORECAST
    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        //Counter for the date
        j = 0

        var date = $("<h2>").text("5 Day Forecast:")
        $(".middle-display").append(date)

        for (let i = 6; i < response.list.length; i += 8) {
            //increase counter
            j += 1
            //var for tommorow and the next five days
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + j)
            var nextDay = $("<p>").text(tomorrow.toLocaleDateString())
            nextDay.addClass("blueCardText")

            var blueCard = $("<div>")
            blueCard.addClass("blueCard")

            var temp = parseInt(response.list[i].main.temp)
            temp = (temp - 273.15) * 9 / 5 + 32
            temp = temp.toFixed(0);
            var tempText = $("<p>").text("Temp: " + temp + " °F");
            tempText.addClass("blueCardText")

            var humidity = response.list[i].main.humidity;
            var humidityText = $("<p>").text("Humidity:" + humidity + "%");
            humidityText.addClass("blueCardText")

            var weatherDesc = response.list[i].weather[0].main
            var weatherThumbnailImg = $("<img>")
            if (weatherDesc === "Clear") {
                weatherThumbnailImg.attr("src", "assets/images/sunny.png")
            } else if (weatherDesc === "Clouds") {
                weatherThumbnailImg.attr("src", "assets/images/cloudy.png")
            } else if (weatherDesc === "Drizzle" || weatherDesc === "Rain") {
                weatherThumbnailImg.attr("src", "assets/images/rain.png")
            } else if (weatherDesc === "Snow") {
                weatherThumbnailImg.attr("src", "assets/images/snowing.png")
            }
            weatherThumbnailImg.addClass("weatherThumbnail")

            blueCard.append(nextDay, weatherThumbnailImg, tempText, humidityText)
            bottomDisplay.append(blueCard)
        }

    })

    $(".input").val("")
}






//add event listener to search image
$(".search-background").on("click", function () {
    //Get the user input from the input box
    var input = $(".input").val().trim()

    //Create a button for the side bar based on recent searches
    var button = $("<button>")
    button.addClass(input)
    previousSearch.prepend(button.text(input))

    //Creates the input based off user input to add to the queryURL
    input = "q=" + input
    getWeather(input)

})

//Click event for the sidebar buttons
previousSearch.on("click", function (event) {
    //Target where the user clicked
    var eventTarget = $(event.target)

    //Find the class of what was clicked
    eventTargetValue = eventTarget.attr("class")
    eventTargetValue = "q=" + eventTargetValue

    //Rund the function with new parameter from sidebar button
    getWeather(eventTargetValue)
})