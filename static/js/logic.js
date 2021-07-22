// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Load in earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Grab data with d3, define what properties and colors to use
d3.json(queryUrl, function(data) {
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.properties.mag),
      color: "#000000",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }


  function mapRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 4;
  }
  


  L.geoJson(data, {

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyle,
    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }
  }).addTo(myMap);
})

    // Create legend
    var legend = L.control({
      position: "bottomleft"
  });

  legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

  // Create legend
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + mapColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
  };
  legend.addTo(myMap);


// Create color function
function mapColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return 'magenta'
    }
};