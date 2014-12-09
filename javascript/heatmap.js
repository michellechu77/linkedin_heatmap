$(document).ready(function() {
  onLinkedInLoad()

  google.maps.event.addDomListener(window, "load", initialize);
  });

  function onLinkedInLoad() {
    IN.Event.on(IN, "auth", onLinkedInAuth);
  }

  function onLinkedInAuth() {
    IN.API.Profile("me")
    .fields("firstName", "lastName", "id","industry", "pictureUrl", "distance", "skills", "positions", "educations", "location")
    .result(displayProfiles);

    IN.API.Connections("me")
      .params({"count":4})
      .fields("firstName", "lastName", "id", "location")
      .result(function(result, metadata) {
      setConnections(result.values, metadata);
    });
  }

  var geocodeData = [];
  function setConnections(network) {
    debugger;
    for(i = 0; i < network.length; i++) {
    if (network[i].location != null) {
      console.log(network[i].location.name.replace("Area", '').toString())
      console.log("*******")
      geocodeData.push(codeAddress(network[i].location.name.replace("Area", '').toString()))
      console.log(geocodeData)
    } else {
      console.log("No location in setConnections");
    }
   }
   return geocodeData
  }

function codeAddress(address) {
  var location = {}
  geocoder.geocode( {'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      //Make sure heatmap variable is accessible in this scope
      heatmap.add()
      location["lat"] = results[0].geometry.location.k;
      location["lng"] = results[0].geometry.location.B;
      location["count"] = 1;
    } else {
      location["fail"] = "FAIL"
    }
  return location;
  });
}

  function displayProfiles(profiles) {
    member = profiles.values[0];
    document.getElementById("greeting").innerHTML =
      "<p id=\"" + member.id + "\">Hello " +  member.firstName + " " + member.lastName + "</p>";
    document.getElementById("profile").innerHTML =
      "<img src=" + "'" + member.pictureUrl + "'" + ">"

    for(i = 0; i < member.positions.values.length; i++) {
      $("#positions ul").append("<li>" + member.positions.values[i].title + " at " + member.positions.values[i].company.name + "</li>")
    }

    for(i = 0; i < member.skills.values.length; i++) {
      $("#skills ol").append("<li>" + member.skills.values[i].skill.name + "</li>")
    }
  }

   function initialize() {
        var myLatlng = new google.maps.LatLng(25.6586, -80.3568);
        // map options,
        var myOptions = {
          zoom: 4,
          center: myLatlng
        };
        // standard map
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // heatmap layer
        heatmap = new HeatmapOverlay(map,
          {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 2,
            "maxOpacity": 1,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
          }
        );
        var testData = {
          max:100,
          min: 0,
          data: [{lat:-77.0277, lng:38.89, count:1}]
        };
        heatmap.setData(testData);
      }