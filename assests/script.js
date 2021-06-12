
$(document).ready(function() {
  
  // this finna be the search button and its functions
  $('#button').on('click', function() {
    let input = $('#input').val();
    $('#input').val('');
    Weather(input);
  });

  $('.prevCity').on('click', 'li', function(){
    Weather($(this).text());
  });

  function createButton(text) {
    let list = $('<li>').addClass("appList").text(text);
    $('.prevCity').append(list);
  }

  function Weather(input) {
    $ajax({
      type: 'GET',
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=&units=metric",
      dataType: 'json',
      success: function(data) {
        if (prevCity.indexOf(input) === -1) {
          prevCity.push(input);
          window.localStorage.setItem('prevCity', JSON.stringify(prevCity));
          createButton(input);
        }
        $ ('#current').empty();

        let name = $('<h3>').addClass('title').text(data.name + ' (' + new Date().toLocaleDateString() + ')');
        let div = $('<div>').addClass('div');
        let windy = $('<p>').addClass('div-conent').text('Wind Speed: ' + data.wind.speed + ' KPH')
        let sweaty = $('<p>').addClass('div-conent').text('Humidity: ' + data.main.humidity + '%')
        let hotCold = $('<p>').addClass('div-conent').text('Temperature: ' + data.main.temp + 'C')
        let body = $('<div>').addClass('div-body');
        let icon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png')

        name.append(icon);
        body.append(name, hotCold, sweaty, windy);
        div.append(body);
        $('#current').append(div);

        Forecast(input);
        UVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }

  function Forecast(input) {
    $.ajax({
      type: 'GET',
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=&units=metric",
      dataType: 'json',
      success: function(data) {
        $('#forcast').html('<h4>5-day Forcast:<h4>').append('<div>')

        for (var i = 0; i < data.list.length; i++) {

          if (data.list[i].dt_txt.indexOf('15:00:00') !== -1){
            let column = $('<div>').addClass('col-md-2');
            let div = $('<div>').addClass('Ftext')
            let Dbody = $('<div>').addClass('Fbody')

            let name = $('<h5>').addClass('title').text(new Date(data.list[i].dt_txt).toLocaleDateString());
            let icon = $('<img>').attr('src', "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            let para1 = $('<p>').addClass('div-content').text('Temp: ' + data.list[i].main.temp_max + ' C')
            let para2 = $('<p>').addClass('div-content').text('Humidity: ' + data.list[i].main.humidity + '%')

            col.append(div.append(Dbody.append(name, icon, para1, para2)));
            $('#forcast').append(col);
          }
        }
      }
    })
  }
});

