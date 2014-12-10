$(document).ready(function() {
  geocoder = new google.maps.Geocoder();

  var heatmap = new google.maps.visualization.HeatmapLayer

  google.maps.event.addDomListener(window, "load", initialize);

  onLinkedInLoad()

});

function onLinkedInLoad() {
  IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth() {
    IN.API.Profile("me")
    .fields("firstName", "lastName","id", "headline", "pictureUrl", "location")
    .result(displayProfiles);

    IN.API.Connections("me")
    .params({"count":50})
    .fields("firstName", "lastName", "id", "location")
    .result(function(result, metadata) {
      setConnections(result.values, metadata);
    });
  }

  var heatmapData = [];
  function setConnections(network) {
    for(i = 0; i < network.length; i++) {
      if (network[i].location != null) {
        console.log(network[i].location.name.replace("Area", '').replace("Greater","").toString())
        codeAddress(network[i].location.name.replace("Area", '').replace("Greater","").toString())
      } else {
        console.log("No location in setConnections");
      }
    }
  }

  function codeAddress(address) {
    setTimeout(  geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.k;
        var lng = results[0].geometry.location.B;
        var location = new google.maps.LatLng(lat, lng)
        heatmapData.push(location);
        drawMap()
      } else {
      }
    }) , 20000 )

  }

  function displayProfiles(profiles) {
    member = profiles.values[0];
    document.getElementById("greeting").innerHTML =
    "<p id=\"" + member.id + "\">Howdy, " +  member.firstName + " " + member.lastName + "</p>";
    document.getElementById("photo").innerHTML =
    "<img src=" + "'" + member.pictureUrl + "'" + ">"

    document.getElementById("info").innerHTML =
    "<p>" +  member.headline + " currently located at " + member.location.name + "</p>";
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