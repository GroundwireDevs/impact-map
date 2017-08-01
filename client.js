// Initalizes map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// Sets the default view of the map
mymap.setView(new L.LatLng(38.1711269, -97.5383369), 5);

// Sets the tile layer from Mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/brandonyates/cj5tvlwng020z2qr7ws0ylg1o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhbmRvbnlhdGVzIiwiYSI6ImNpcTl3a3AzbDAxbmhmeW0xaGYwbmIwNmQifQ.ItJcFDmazEMy-2spCUZrrA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 10,
    id: 'mapbox.streets'
  }).addTo(mymap);


  var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
  }).addTo(mymap);