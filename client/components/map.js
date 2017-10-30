function Map(id, lat, lng, address){
  this.id = id;
  this.lat = lat;
  this.lng = lng;
  this.address = address;
  this.init();
}

Map.prototype.init = function(){
  var myLatlng = new google.maps.LatLng(this.lat, this.lng);
  // set the map options hash
  var mapOptions = {
      center: myLatlng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById(this.id);
  // initialize a new Google Map with the options
  this.targetMap = new google.maps.Map(map_canvas_obj, mapOptions);
  // Add the marker to the map
  var marker = new google.maps.Marker({
      position: myLatlng,
      title: this.address
  });
  //Add the marker to the map by calling setMap()
  marker.setMap(this.targetMap);
}

export default Map;
