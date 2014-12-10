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

  function drawMap() {
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });
    heatmap.setMap(map);
  }

  function initialize() {
    var heatmapData = [];

    var unitedStates = new google.maps.LatLng(39.8282, -98.5795);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: unitedStates,
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.MAP
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData
    });

    heatmap.setMap(map);
  }