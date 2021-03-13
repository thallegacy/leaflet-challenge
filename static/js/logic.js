
  // Use this link to get the geojson data.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

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

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3>Magnitude:" + feature.properties.mag + "<hr><p>" 
        + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, location) {
            return new L.CircleMarker(location, {
                radius: getRadius(feature.geometry.coordinates[2]),
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 1.0,
                weight: 1,
                color: "white"
            });
        },
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}