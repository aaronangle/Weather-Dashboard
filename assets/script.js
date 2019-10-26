var topDisplay = $(".top-display")


//add event listener to search image
$(".search-background").on("click", function () {
    //Get the user input from the input box
    var input = $(".input").val()
    console.log(input)
    //Make a call to open weather with the user input
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&APPID=74f0b99ce4d4ead30c56392cfe258bd7"
    //Create an h1 with the city and current date
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var temp = parseInt(response.main.temp)
        temp = (temp - 273.15) * 9 / 5 + 32
        temp = temp.toFixed(2)
        $("<p>").text("Temperature: " + temp + "°F")



    })
    //p tag with temperature in farenheit

    //p tag with humidity

    //p tag with wind speed

    //p tag with UV index HAVE To make a seperate call for this one



})

