
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
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=0337bcdaa7cdc4b88a62007ca6525db4&units=metric",
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

        Forcast(input);
        UVIndex(data.coord.lat, data.coord.lon);
      }
    })
  }
});

