$(document).ready(function() {
  geocoder = new google.maps.Geocoder();

  google.maps.event.addDomListener(window, "load", initialize);

  $('#dropdown').change(function(){
    var value  = $("#dropdown option:selected").text();
    $.ajax({
    url: '/connections',
    type: 'GET',
    data: {location: value},
    dataType: "json"
    }).done(function(response){
      $('#list').empty();
      $.each(response, function(val, text) {
      $('#list').append('<li>' + text +'</li>');
      });
    });
  });
});

function onLinkedInLoad() {
  IN.Event.on(IN, "auth", onLinkedInAuth);
}

function onLinkedInAuth() {
  IN.API.Profile("me")
  .fields("firstName", "lastName","id", "headline", "pictureUrl", "location")
  .result(displayProfiles);

  IN.API.Connections("me")
  .params({"count":10})
  .fields("firstName", "lastName", "id", "location")
  .result(function(result) {
    setConnections(result.values);
  });
}

var heatmapData = [];

function setConnections(network) {
  network.forEach(codeLocation);
  setDropDown(network);
}

function setDropDown(network) {
   $.ajax({
    url: '/connections',
    type: 'POST',
    data: {network: network},
    dataType: "json"
  }).done(function(response){
    $.each(response, function(val, text) {
    $('#dropdown').append( new Option(text,val) );
    });
  });
}

function codeLocation(element) {
  if (element.location != null) {
      codeAddress(element.location.name);
    } else {
      console.log("No location in setConnections");
    }
}

function codeAddress(address) {
  address = address.replace("Area", '').replace("Greater","").trim()
  $.ajax({
    url: '/locations',
    type: 'POST',
    data: {location: address},
    dataType: "json"
  }).done(function(response){
    heatspot = new google.maps.LatLng(response["longitude"], response["latitude"])
    heatmapData.push(heatspot);
    drawMap();
  });

  // if (locationHash[address] != null) {
  //   heatmapData.push(locationHash[address]);
  //   drawMap();
  // } else {
  //   setTimeout(geocoder.geocode( {'address': address}, function(results, status) {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       loc = getLatLng(results, status);
  //       locationHash[address] = loc;
  //       heatmapData.push(loc);
  //       drawMap();
  //     } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
  //       console.log("OVER LIMIT");
  //     } else {
  //       console.log("Failed");
  //     }
  //   }), 2500);
  // }
}

function getLatLng(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    var lat = results[0].geometry.location.k;
    var lng = results[0].geometry.location.D;
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
  $(".login").hide();

  member = profiles.values[0];
  document.getElementById("greeting").innerHTML =
  "<p id=\"" + member.id + "\">Howdy, " +  member.firstName + " " + member.lastName + "</p>" + "<p> Title: " + member.headline + "</p>";
  document.getElementById("photo").innerHTML = "<img src=" + "'" + member.pictureUrl + "'" + ">";

  document.getElementById("info").innerHTML = "<p> You are currently located in " +  member.location.name + "</p>";

  displayMyLocation(member);
}

function drawMap() {
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    radius: 20
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