var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var inp = document.getElementById("addr");

function addr_search() {
  $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
    var items = [];
    $.each(data, function(key, val) {
      items.push(
        "<li><a href='#' onclick='chooseAddr(" + val.lat + ", " + val.lon + ");return false;'>" + val.display_name + '</a></li>');
      });
      $('#results').empty();
      if (items.length != 0) {
        $('<p>', { html: "Resultados:" }).appendTo('#results');
        $('<ul/>', {
          'class': 'my-new-list',
          html: items.join('')
        }).appendTo('#results');
      } else {
        $('<p>', { html: "No se encontraron resultados" }).appendTo('#results');
      }
    });
  }

function chooseAddr(lat, lng, type) {
  var url1 = "https://api.flickr.com/services/feeds/photos_public.gne?tags=";
  var url2 = "&tagmode=any&format=json&jsoncallback=?";
  var url = url1 + inp.value + url2;

  $('#results img').remove();
  
  $.getJSON(url, function(data) {
    for(var i = 0; i < 6; i++) {
      var img = document.createElement('img');
      img.setAttribute("width", "200px");
      img.setAttribute("heigth", "200px");
      img.src = data.items[i].media['m'];
      $('#results').append(img);
    }
  });

  var location = new L.LatLng(lat, lng);
  mymap.panTo(location);
  if (type == 'city' || type == 'administrative') {
    mymap.setZoom(11);
  } else {
    mymap.setZoom(13);
  }

}
