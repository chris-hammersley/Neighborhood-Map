// Global Variables
var type = 'Grub'; // to change List results
var tag = 'noladining'; // to change Instagram pictures
var id = '4d4b7105d754a06374d81259'; // to change the FourSquare results

// Instagram Pics from Instafeed API
var feed = new Instafeed({
    get: 'tagged',
    tagName: tag,
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

// Initialize Google Maps
function init() {
var mapOptions = {
  center: new google.maps.LatLng(29.9500, -90.0667),
  zoom: 15,
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
// var client_id = '';
// var client_secret = '';
// var base_url = 'https://api.foursquare.com/v2/venues/search?near=New+Orleans'; // TODO: make 'near' a variable that changes when a different city is selected
// var catId = '4d4b7105d754a06374d81259';
var catId = id;
var category = '&categoryId=' + catId;
// var params = '&intent=browse&radius=1000&limit=20'; // intent, radius and results limit
// var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20150301';
// var url = base_url+category+params+key;

var foursquareApi = 'https://api.foursquare.com/v2/venues/search?near=New+Orleans' + category + '&intent=browse&radius=1000&limit=20&client_id=&client_secret=&v=20150301';

// FourSquare return results for markers
$.getJSON(foursquareApi, function (result) {

  // Load the FourSquare Venue Results to Markers as Observable Array
  var self = this;
  self.allEntries = ko.observableArray([]);
  self.allEntries = (result.response.venues);
  // var markers = result.response.venues;

  // Call the setMarketList Function to Populate the List with Marker Location Names
  setMarkerList(self.allEntries);

  // Assign every Venue in Markers Array to a Place Variable
  for (var i in self.allEntries){
    var place = self.allEntries[i];

  // Assign Marker Variable to New Google Map Marker & Drop at Marker Position
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(place.location.lat,place.location.lng),
    name: place.name,
    address: place.location.address,
    category: type,
    map: map
    });

  // Initialize the InfoWindow in Google Maps
  var infowindow = new google.maps.InfoWindow({
        maxWidth: 160,
        content: " "
        });

// Make Markers an Observable Array
// var markers = ko.observableArray([]);

  // Add Event Listener for Marker Click, then Load InfoWindow Content from Array Variables
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div class="mapTitle">'+this.name+'</div>' + '<div class="mapHead"><div class="mapInfo">'+this.address+'</div>' + '<div class="mapHead"><div class="mapInfo">Best for: '+this.category+'</div>' +'</p></div>');

    // Open InfoWindow with Content
    infowindow.open(map, this);
  });
}});

  // Add FourSquare Marker Names to List View
  function setMarkerList(venuesArr){  
      for (var i in venuesArr){
          var venue = venuesArr[i];
          var str = '<p><strong>' + venue.name + '</strong> ' + '</p>';   
          $('#locations').append(str);
      }
  }
}

google.maps.event.addDomListener(window, 'load', init);

// Reverse Geocoding to Return City & State Names when I make it interactive for users to choose another city
var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=29.9500,-90.0667"; // TODO: make 'latlng' a variable that changes when a new city is selected

$.getJSON(geocodingAPI, function (json) {
  if (json.status == "OK") {
      
      //Check Results
      var result = json.results[0];
      
      //Look for Locality and Administrative_area_level_1 Tags
      var city = "";
      var state = "";
      for (var i = 0, len = result.address_components.length; i < len; i++) {
          var ac = result.address_components[i];
          if(ac.types.indexOf("locality") >= 0) city = ac.long_name;
          if(ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
        }
      
      //Display the Welcome Line if Values aren't Null
      if(city != '' && state != '') {
        $("#city-name").html("Let's Explore the Beautiful City of "+city+", "+state+"!");
        }
 }
})

var Filter = function (data) {
    this.name = ko.observable(data.name);
    this.foursqCatId = ko.observable(data.foursqCatId);
    this.instafeedTagName = ko.observableArray(data.instafeedTagName);
};

// ViewModel
var ViewModel = function () {
    var self = this;

    self.searchPhrase = ko.observable('');

    this.filterList = ko.observableArray([]);

    mapFilters.forEach(function(filterItem) {
        self.filterList.push( new Filter(filterItem) );
    });

    this.currentFilter = ko.observable( this.filterList()[0]);

    this.setFilter = function(clickedFilter) {
        self.currentFilter(clickedFilter)
    };

//    this.changeResults = function() {
//        self.currentFilter()
//    };

    self.searchPhrase.subscribe(function(newTerm) {
      if (newTerm== '') return;
      var latlon = app.map.getCenter();
      app.getFoursquareResponse(
        latlon.k, latlon.D,
        newTerm,
        app.processFoursquareResponse
        );
    });
};

ko.applyBindings(new ViewModel());
