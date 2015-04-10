// Instagram Pics from Instafeed API
var feed = new Instafeed({
    get: 'tagged',
    tagName: 'nola',
    target: 'instafeed',
    sortBy: 'most-recent',
    limit: 8,
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
    clientId: 'ecdea4ae8c6f476a9a84e4a47d999170'
});
feed.run();

// Data Model for Map Categories and Filters
var mapFilters = [
        {
            name : 'Grub',
            foursqCatId: '4d4b7105d754a06374d81259',
            instafeedTagName : ['nolafood', 'eatnola', 'noladining', 'nolafoodies', 'nolaeats', 'frenchmarket', 'killerpoboys', 'coopsplace']
        },{
            name : 'Booze',
            foursqCatId : '4d4b7105d754a06376d81259',
            instafeedTagName : ['nolacocktails', 'handgrenades', 'patobriens', 'erinrose', 'rooseveltbar']
        },{
            name : 'Music',
            foursqCatId : '4bf58dd8d48988d1e5931735',
            instafeedTagName : ['frenchmanstreet', 'preservationhall', 'nolamusic', 'nolajazzfest']
        },{
            name : 'Festivals',
            foursqCatId : '4d4b7105d754a06373d81259',
            instafeedTagName : ['frenchquarterfestival', 'bayouboogaloo', 'satchmofest']
        },{
            name : 'Hoods',
            foursqCatId : '4f2a25ac4b909258e854f55f',
            instafeedTagName : ['bywater', 'marigny', 'treme', 'frenchquarter', 'uptownnola', 'lower9th', 'poydrascorridor', 'gardendistrict']
        },{
            name : 'Cemetaries',
            foursqCatId : '4bf58dd8d48988d15c941735',
            instafeedTagName : ['nolacemetaries']
        },{
            name : 'What\'s Crazy',
            foursqCatId : '4d4b7105d754a06373d81259',
            instafeedTagName : ['nolabulls', 'reddressrunnola', 'neworleansburlesque', 'nola', 'nolamardigras']
        }
             ]

var Filter = function (data) {
    this.name = ko.observable(data.name);
    this.foursqCatId = ko.observable(data.foursqCatId);
    this.instafeedTagName = ko.observableArray(data.instafeedTagName);
}

// Initialize Google Maps
function init() {
var mapOptions = {
  center: new google.maps.LatLng(29.9500, -90.0667),
  zoom: 14,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: google.maps.MapTypeControlStyle.DEFAULT,
  mapTypeIds: [
    google.maps.MapTypeId.HYBRID,
    google.maps.MapTypeId.ROADMAP
  ]
},
zoomControl: true,
zoomControlOptions: {
  style: google.maps.ZoomControlStyle.SMALL
}
};

var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

// Build the FourSquare URL API Call
var client_id = 'GDIGYUEJ2F35H1E3BQCCSZVNZEP2OAJBNOTD2BEVHL0IXF3O';
var client_secret = 'HIO22Q3EXWKQ12YQ15NHN02X4L4V35NVP1C1GFEPGQ1C5WCW';
var base_url = 'https://api.foursquare.com/v2/';
var endpoint = 'venues/search?';
var categoryId = '4d4b7105d754a06374d81259';
var categoryName = 'Grub';
var category = '&categoryId=' + categoryId;
var intent = '&intent=browse';
var radius = '&radius=1000';
var limit = '&limit=15';
var params = 'near=New+Orleans';
var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20150301';
var url = base_url+endpoint+params+category+intent+radius+limit+key;

// FourSquare return results for markers
$.get(url, function (result) {

  // Load the FourSquare Venue Results to Markers Variable
  var markers = result.response.venues;

  // Populate the List with Marker Location Names
  setMarkers(markers);

  // Assign every Venue in Markers Array to a Place Variable
  for (var i in markers){
    var place = markers[i];

  // Assign Marker Variable to New Google Map Marker & Drop at Marker Position
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(place.location.lat,place.location.lng),
    name: place.name,
    address: place.location.address,
    category: 'Grub',
    likes: place.likes,
    map: map
    });

  // Initialize the InfoWindow in Google Maps
  var infowindow = new google.maps.InfoWindow({
        maxWidth: 160,
        content: " "
        });

  // Add Event Listener for Marker Click, then Load InfoWindow Content from Array Variables
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div class="mapTitle">'+this.name+'</div>' + '<div class="mapHead"><div class="mapInfo">'+this.address+'</div>' + '<div class="mapHead"><div class="mapInfo">Best for: '+this.category+'</div>' +'</p></div>');

    // Open InfoWindow with Content
    infowindow.open(map, this);
  });
}});

  // Add FourSquare Marker Names to List View
  function setMarkers(venuesArr){  
      for (var i in venuesArr){
          var venue = venuesArr[i];
          var str = '<p><strong>' + venue.name + '</strong> ' + '</p>';   
          $('#wikipedia-links').append(str);
      }
  }
}

google.maps.event.addDomListener(window, 'load', init);

// Reverse Geocoding to Return City & State Names when we make it interactive
var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=29.9500,-90.0667";

$.getJSON(geocodingAPI, function (json) {
  if (json.status == "OK") {
      
      //Check result 0
      var result = json.results[0];
      
      //look for locality tag and administrative_area_level_1
      var city = "";
      var state = "";
      for (var i = 0, len = result.address_components.length; i < len; i++) {
          var ac = result.address_components[i];
          if(ac.types.indexOf("locality") >= 0) city = ac.long_name;
          if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
        }
      
      //only report if we got Good Stuff
      if(city != '' && state != '') {
        $("#city-name").html("Let's Explore the Beautiful City of "+city+", "+state+"!");
        }
 }
})

// ViewModel
var ViewModel = function () {
    var self = this;

    this.filterList = ko.observableArray([]);

    mapFilters.forEach(function(filterItem) {
        self.filterList.push( new Filter(filterItem) );
    });

    this.currentFilter = ko.observable( this.filterList()[0]);

    this.setFilter = function(clickedFilter) {
        self.currentFilter(clickedFilter)
    };
}

ko.applyBindings(new ViewModel());