
$(document).ready(function() {
  $("#button").on("click", function() {
    var Value = $("#value").val();

    // clear input box
    $("#value").val("");

    Weather(Value);
  });

  $(".prevCity").on("click", "li", function() {
    Weather($(this).text());
  });

  function createB(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".prevCity").append(list);
  }

  function Weather(Value) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + Value + "&appid=0337bcdaa7cdc4b88a62007ca6525db4&units=metric",
      dataType: "json",
      success: function(data) {
        // create history link for this search
        if (prevCity.indexOf(Value) === -1) {
          prevCity.push(Value);
          window.localStorage.setItem("prevCity", JSON.stringify(prevCity));
    
          createB(Value);
        }
        
        // clear any old content
        $("#current").empty();

        // create html content for current weather
        var name = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var div = $("<div>").addClass("card");
        var windy = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " KMH");
        var sweaty = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var hotCold = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °C");
        var divBody = $("<div>").addClass("card-body");
        var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        name.append(icon);
        divBody.append(name, hotCold, sweaty, windy);
        div.append(divBody);
        $("#current").append(div);

        // call follow-up api endpoints
        Forecast(Value);
        UVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }

  function Forecast(Value) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + Value + "&appid=0337bcdaa7cdc4b88a62007ca6525db4&units=metric",
      dataType: "json",
      success: function(data) {
        // overwrite any existing content with title and empty row
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var div = $("<div>").addClass("card bg-primary text-white");
            var dBody = $("<div>").addClass("card-body p-2");

            var name = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            var para1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °C");
            var para2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(div.append(dBody.append(name, icon, para1, para2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }

  // function UVIndex(lat, lon) {
  //   $.ajax({
  //     type: "GET",
  //     url: "http://api.openweathermap.org/data/2.5/uvi?appid=0337bcdaa7cdc4b88a62007ca6525db4=" + lat + "&lon=" + lon,
  //     dataType: "json",
  //     success: function(data) {
  //       var uv = $("<p>").text("UV Index: ");
  //       var button = $("<span>").addClass("btn btn-sm").text(data.value);
        
  //       // change color depending on uv value
  //       if (data.value < 3) {
  //         button.addClass("btn-success");
  //       }
  //       else if (data.value < 7) {
  //         button.addClass("btn-warning");
  //       }
  //       else {
  //         button.addClass("btn-danger");
  //       }
        
  //       $("#today .card-body").append(uv.append(button));
  //     }
  //   });
  // }

  var prevCity = JSON.parse(window.localStorage.getItem("prevCity")) || [];

  if (prevCity.length > 0) {
    Weather(prevCity[prevCity.length-1]);
  }

  for (var i = 0; i < prevCity.length; i++) {
    createB(prevCity[i]);
  }

  // API CALL FOR UV INDEX WAS TERMINATED.. PAIN
});

