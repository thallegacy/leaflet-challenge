// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 6,
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Function that will determine the color of a cirle based on the magnitude
function chooseColor(magnitude) {
    if (magnitude > 5) {
        return '#ee6c6e'
    } else if (magnitude > 4) {
        return '#eea770'
    } else if (magnitude > 3) {
        return '#f2b957'
    } else if (magnitude > 2) {
        return '#f2db5a'
    } else if (magnitude > 1) {
        return '#e2f15b'
    } else {
        return '#b8f15a'
    }
};

// Function that will determine the radius of a cirle based on the depth
function getRadius(depth) {
    return depth * 18000;
};