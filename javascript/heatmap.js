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
    .result(function(result,) {
      setConnections(result.values);
    });
  }

  var heatmapData = [];
  var locationHash = {};
  function setConnections(network) {
      network.forEach(function doSetTimeout(connection) {
         if (connection.location != null) {
        console.log(connection.location.name.replace("Area", '').replace("Greater","").toString())
        codeAddress(connection.location.name.replace("Area", '').replace("Greater","").toString())
      } else {
        console.log("No location in setConnections");
      }
    });
  }

  function codeAddress(address) {
    if (locationHash[address] != null) {
      heatmapData.push(locationHash[address]);
      console.log("In Hash")
      drawMap();
    } else {
     setTimeout(geocoder.geocode( {'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        loc = getLatLng(results, status)
        locationHash[address] = loc;
        console.log(loc)
        heatmapData.push(loc);
        drawMap();
      } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        console.log("OVER LIMIT")
      } else {
        console.log("Failed")
      }
    });
     ), 2500);

    }
  }

  // function doSetTimeout(i, network) {
  //   setTimeout(function(x) {
  //     console.log("SET TIMEOUT")
  //     if (network[i].location != null) {
  //       console.log(i)
  //       console.log(network[i].location.name.replace("Area", '').replace("Greater","").toString())
  //       codeAddress(network[i].location.name.replace("Area", '').replace("Greater","").toString())
  //     } else {
  //       console.log("No location in setConnections");
  //     }

  //   }, 10000);
  // }
function getLatLng(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var lat = results[0].geometry.location.k;
      var lng = results[0].geometry.location.B;
      loc = new google.maps.LatLng(lat, lng);
      return loc;
    };
  }

function displayMyLocation(member) {
    var myLocation;
    geocoder.geocode( {'address': member.location.name.replace("Area", "").replace("Greater","")}, function(results, status) {
      myLocation = getLatLng(results, status);
      var marker = new google.maps.Marker({
        position: myLocation,
        map: map,
        title:"Current Location"
      });
    marker.setMap(map);
    });
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

  displayMyLocation(member);
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