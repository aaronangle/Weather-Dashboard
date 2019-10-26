var topDisplay = $(".top-display")


//add event listener to search image
$(".search-background").on("click", function () {
    //Get the user input from the input box
    var input = $(".input").val()
    console.log(input)
    //Make a call to open weather with the user input
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"
    //Create an h1 with the city and current date
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var temp = parseInt(response.main.temp)
        temp = (temp - 273.15) * 9 / 5 + 32
        temp = temp.toFixed(2)
        var temperatureText = $("<p>").text("Temperature: " + temp + "°F")
        var humidity = response.main.humidity
        var humidityText = $("<p>").text("Humidty: " + humidity + "%")
        var windSpeed = response.wind.speed
        var windSpeedText = $("<p>").text("Wind Speed: " + windSpeed)

        topDisplay.append(temperatureText, humidityText, windSpeedText)

        var latitude = response.coord.lat
        var longitude = response.coord.lon

        uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (result) {
            console.log(result)
        })


    })
    //p tag with temperature in farenheit

    //p tag with humidity

    //p tag with wind speed

    //p tag with UV index HAVE To make a seperate call for this one



})

