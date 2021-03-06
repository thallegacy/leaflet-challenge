


// Function that will determine the color of a cirle based on the depth
function getColor(depth) {
    return depth > 1000 ? '#005a32' :
           depth > 500  ? '#238443' :
           depth > 200  ? '#41ab5d' :
           depth > 100  ? '#78c679' :
           depth > 50   ? '#addd8e' :
           depth > 20   ? '#d9f0a3' :
           depth > 10   ? '#f7fcb9' :
                      '#ffffe5';
}

// Function that will determine the radius of a cirle based on the magnitude
function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    else{
      return magnitude * 4;
    }
};
let earthquakeData, plateData;
// Perform a GET request to the query URL
(async function(){
    var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    var plateUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
    await d3.json(queryUrl, async function(data) {
        earthquakeData = data.features;
        await d3.json(plateUrl, function(data){
            plateData = data.features;
            createFeatures(earthquakeData, plateData);
        });
    });
    

})()
  
function createFeatures(earthquakeData, plateData) {

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
            return new L.circleMarker(location, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: 1.0,
                weight: 1,
                color: "black"
            });
        },
        onEachFeature: onEachFeature
    });

    var plates = L.geoJSON(plateData, {
        color: "orange",
        fillColor: "white",
        fillOpacity:0
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes,plates);
}

function createMap(earthquakes, plates) {

  

    // Define title layer

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });
    
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    
      // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellitemap,
        "Grayscale": grayscalemap,
        "Outdoors": outdoorsmap

    };
    console.log(earthquakes)
    console.log(plates)
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Techtonic Plates": plates
    };
        // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [satellitemap, earthquakes, plates]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
}