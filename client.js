var map = null;
var legend = document.getElementById('legend');
var lastUpdated;

function initMap() {

  google.charts.load('current', {
  'packages': ['geochart'],
  'mapsApiKey': 'AIzaSyDZPziPjsTK8hiOlr1W-uQiDjIRe87FFP4'
});
}

// Displays the points data provided.
function displayPoints(data) {

  return new Promise(function(resolve, reject) {

 var data = google.visualization.arrayToDataTable([
   ['Country',   'Population', 'Area Percentage'],
   ['France',  65700000, 50],
   ['Germany', 81890000, 27],
   ['Poland',  38540000, 23]
 ]);

 var options = {
   sizeAxis: { minValue: 0, maxValue: 100 },
   region: '155', // Western Europe
   displayMode: 'markers',
   colorAxis: {colors: ['#e7711c', '#4374e0']} // orange to blue
 };

 var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
 chart.draw(data, options);
 resolve('All points processed');
});
}

// https://developers.google.com/web/fundamentals/getting-started/primers/promises
function get(url) {

  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();

    var lastUpdatedString = '';
    if (lastUpdated != null) {
      lastUpdatedString = '?lastupdated=' + lastUpdated;
    }

    lastUpdated = new Date() / 1000;

    req.open('GET', url + lastUpdatedString);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function callPromise() {
  return new Promise(function(resolve, reject) {

  get('/rest/live/read').then(JSON.parse).then(displayPoints).then(function() {
    console.log("callPromise Success!");
    resolve('Success!');
  }, function(error) {
    console.error("callPromise Failed!", error);
    reject(Error(error));
  });
  });
}


// https://gist.github.com/KartikTalwar/2306741
function refreshData() {
  x = 3; // 3 Seconds

  callPromise().then(function() {
    setTimeout(refreshData, x * 1000);
  }, function(error) {
    console.error(error);
    setTimeout(refreshData, x * 1000);
  });
}

refreshData(); // execute function
