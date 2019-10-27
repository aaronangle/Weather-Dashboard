var topDisplay = $(".top-display")
var bottomDisplay = $(".bottom-display")
var previousSearch = $(".previousSearch")
var today = new Date().toLocaleDateString()
var buttonList = $(".button")


//add event listener to search image
$(".search-background").on("click", function () {
    topDisplay.empty()
    bottomDisplay.empty()
    //Get the user input from the input box
    var input = $(".input").val().trim()

    //Make a call to open weather with the user inputs
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"
    //Create an h1 with the city and current date
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var weatherDescritpion = response.weather[0].main
        var weatherImg = $("<img>")
        if (weatherDescritpion === "Clear") {
            weatherImg.attr("src", "assets/images/sunny.png")
        } else if (weatherDescritpion === "Clouds") {
            weatherImg.attr("src", "assets/images/cloudy.png")
        } else if (weatherDescritpion === "Drizzle" || weatherDescritpion === "Rain") {
            weatherImg.attr("src", "assets/images/rain.png")
        }

        weatherImg.addClass("weatherImg")

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
        var headingHolder = $("<div>")
        headingHolder.append(cityText, weatherImg)
        headingHolder.addClass("headingHolder")
        topDisplay.addClass("top-displayBorder")
        topDisplay.append(headingHolder, temperatureText, humidityText, windSpeedText)

        var button = $("<button>")
        button.addClass(input)
        previousSearch.prepend(button.text(input))

        var latitude = response.coord.lat
        var longitude = response.coord.lon

        uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (result) {

            var uv = result.value

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

    forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        j = 0
        var date = $("<h2>").text("5 Day Forecast:")
        bottomDisplay.append(date)
        for (let i = 0; i < response.list.length; i += 8) {
            j += 1
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + j)
            var nextDay = tomorrow.toLocaleDateString()
            var blueCard = $("<div>")
            blueCard.addClass("blueCard")
            var temp = parseInt(response.list[i].main.temp)
            temp = (temp - 273.15) * 9 / 5 + 32
            temp = temp.toFixed(0);
            var tempText = $("<p>").text("Temp: " + temp + " °F");
            var humidity = response.list[i].main.humidity;
            var humidityText = $("<p>").text("Humidity:" + humidity + "%");
            var weatherDesc = response.list[i].weather[0].main
            var weatherThumbnailImg = $("<img>")
            if (weatherDesc === "Clear") {
                weatherThumbnailImg.attr("src", "assets/images/sunny.png")
            } else if (weatherDesc === "Clouds") {
                weatherThumbnailImg.attr("src", "assets/images/cloudy.png")
            } else if (weatherDesc === "Drizzle" || weatherDesc === "Rain") {
                weatherThumbnailImg.attr("src", "assets/images/rain.png")
            }
            weatherThumbnailImg.addClass("weatherThumbnail")
            blueCard.append(nextDay, weatherThumbnailImg, tempText, humidityText)
            bottomDisplay.append(blueCard)
        }

    })

    $(".input").val("")


})

previousSearch.on("click", function (event) {
    var eventTarget = $(event.target)
    eventTargetValue = eventTarget.attr("class")
})