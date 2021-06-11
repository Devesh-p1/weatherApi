
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
});

