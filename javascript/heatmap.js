$(document).ready(function() {
  geocoder = new google.maps.Geocoder();

  google.maps.event.addDomListener(window, "load", initialize);

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
  var locationHash = {};
  function setConnections(network) {
    for(i = 0; i < network.length; i++) {
      // setTimeout(function(i, network) { return function(network) {
      if (network[i].location != null) {
        console.log(network[i].location.name.replace("Area", '').replace("Greater","").toString())
        codeAddress(network[i].location.name.replace("Area", '').replace("Greater","").toString())
      } else {
        console.log("No location in setConnections");
      }
    };
    // }(i), 1000)
  }

  function codeAddress(address) {
    if (locationHash[address] != null) {
      heatmapData.push(locationHash[address]);
      console.log("In Hash")
      drawMap();
    } else {
     geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.k;
        var lng = results[0].geometry.location.B;
        var location = new google.maps.LatLng(lat, lng);
        locationHash[address] = location;
        console.log(location)
        heatmapData.push(location);
        drawMap();
      } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        console.log("OVER LIMIT")
      } else {
        console.log("Failed")
      }
    });

    }
  }

  function doSetTimeout(i, network) {
    setTimeout(function(x) {
      console.log("SET TIMEOUT")
      if (network[i].location != null) {
        console.log(i)
        console.log(network[i].location.name.replace("Area", '').replace("Greater","").toString())
        codeAddress(network[i].location.name.replace("Area", '').replace("Greater","").toString())
      } else {
        console.log("No location in setConnections");
      }

    }, 10000);
  }

  function displayProfiles(profiles) {
    $(".login").hide()

    member = profiles.values[0];
    document.getElementById("greeting").innerHTML =
    "<p id=\"" + member.id + "\">Howdy, " +  member.firstName + " " + member.lastName + "</p>" + "<p> Title: " + member.headline + "</p>";
    document.getElementById("photo").innerHTML =
    "<img src=" + "'" + member.pictureUrl + "'" + ">"

    document.getElementById("info").innerHTML =
    "<p> You are currently located in " +  member.location.name + "</p>";
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
  }