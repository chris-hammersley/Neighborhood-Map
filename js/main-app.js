/**
 * Code to display a Google Map of Hot Grub Spots in New Orleans.
 * Fetches data from the Google Maps API and Foursquare API
 * Tantilizes the user with latest food images from Instagram
 * @author Chris Hammersley
 */

 // SearchMapMarkers lets us search through the map SearchMapMarkers
var searchMapMarkers = function(marker,name, category, position) {
    this.marker = marker,
    this.name = name,
    this.category = category,
    this.position = position
};

var tag = 'noladining'; // to change Instagram pictures

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

/* ======= ViewModel ======= */
function mapView() {
    var self = this;
    var map, initialLocation, infoWindow;
    var neighborhoodMarkers = [];
    var venueMarkers =[];
    var type = 'Grub'; // to change List results in later builds
    var tag = 'noladining'; // to change Instagram pictures in later builds
    var catId = '4d4b7105d754a06374d81259'; // to change the FourSquare results in later builds
    var defaultLocation = "New Orleans";
    var position = new google.maps.LatLng(29.9500, -90.0667);

    self.topPicksList = ko.observableArray([]);
    self.filteredList = ko.observableArray(self.topPicksList());
    self.neighborhood = ko.observable(defaultLocation);
    self.searchterm = ko.observable('');

    // Set Map to Full Window Height
    self.mapSize = ko.computed(function() {
        $('#map-canvas').height($(window).height());
    });

    // Call the Initialize Map Function
    initializeMap();

    // Show Markers when List Items are Clicked
    self.showMarker = function(venue) {
        var venueName = venue.venue.name.toLowerCase();
        for (var i in venueMarkers) {
            if (venueMarkers[i].name === venueName) {
                google.maps.event.trigger(venueMarkers[i].marker, 'click');
                map.panTo(venueMarkers[i].position);
            }
        }
    };

    // Update List Items During Search
    self.displayItems = ko.computed(function() {
        var venue;
        var list = [];
        var searchterm = self.searchterm().toLowerCase();
        for (var i in self.topPicksList()) {
            venue = self.topPicksList()[i].venue;
            if (venue.name.toLowerCase().indexOf(searchterm) != -1 ||
                venue.categories[0].name.toLowerCase().indexOf(searchterm) != -1) {
                list.push(self.topPicksList()[i]);
            }
        }
        self.filteredList(list);
    });

    // Searchterm Updates Markers on Map
    self.displayItems = ko.computed(function() {
        filterMarkers(self.searchterm().toLowerCase());
    });

    // Function to Update/Filter Markers on Map
    function filterMarkers(searchterm) {
        for (var i in venueMarkers) {
            if (venueMarkers[i].marker.map === null) {
                venueMarkers[i].marker.setMap(map);
            }
            if (venueMarkers[i].name.indexOf(searchterm) === -1) {
                venueMarkers[i].marker.setMap(null);
            }
        }
    }

    // Function to Initialize Map, Set Map Options & InfoWindows
    function initializeMap() {
        var mapOptions = {
            zoom: 15,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DEFAULT,
            mapTypeIds: [
                google.maps.MapTypeId.HYBRID,
                google.maps.MapTypeId.ROADMAP
            ]},
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        infoWindow = new google.maps.InfoWindow();
    }

    // Set Map Location & Get Hot Spots from FourSquare API
    function getLocationInfo(place) {
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        var name = place.name;
        var address = place.location.address;
        initialLocation = position;
        map.setCenter(initialLocation);

        // Set the Hot Spot Markers
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: name,
            address: address,
            category: type,
        });
        neighborhoodMarkers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div class="mapTitle">'+this.name+'</div>' + '<div class="mapHead"><div class="mapInfo">'+this.address+'</div>' + '<div class="mapHead"><div class="mapInfo">Best for: '+this.category+'</div>' +'</p></div>');
            infoWindow.setContent(name);
            infoWindow.open(map, marker);
        });

        // Get Hot Spots from FourSquare API
//        var catId = id;
        var category = '&categoryId=' + catId;
        var foursquareApi = 'https://api.foursquare.com/v2/venues/search?near=New+Orleans' + category + '&intent=browse&radius=1000&limit=20&client_id=GDIGYUEJ2F35H1E3BQCCSZVNZEP2OAJBNOTD2BEVHL0IXF3O&client_secret=HIO22Q3EXWKQ12YQ15NHN02X4L4V35NVP1C1GFEPGQ1C5WCW&v=20150301';
        $.getJSON(foursquareApi, function(result) {
            self.topPicksList(result.response.groups[0].items);
            for (var i in self.topPicksList()) {
                createMarkers(self.topPicksList()[i].venue);
            }
        })
    };

    // Remove Location Marker from Map
    function removeLocationMarker() {
        for (var i in neighborhoodMarkers) {
            neighborhoodMarkers[i].setMap(null);
            neighborhoodMarkers[i] = null;
        }
        while (neighborhoodMarkers.length > 0) {
            neighborhoodMarkers.pop();
        }
    }

    // Create Hot Spot Markers
    function createMarkers(venue) {
//        for (var i in locations){
//        var place = locations[i];

        var lat = venue.location.lat;
        var lng = venue.location.lng;
        var name = venue.name;
        var category = id;
        position = new google.maps.LatLng(lat, lng);
//        var position = new google.maps.LatLng(place.location.lat,place.location.lng);
        var address = venue.location.formattedAddress;
        var rating = venue.rating;
    }

    var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: name
    });
    venueMarkers.push(new searchMapMarkers(marker, name.toLowerCase(), position));

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

    // DOM Element for InfoWindow Content
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div class="mapTitle">'+this.name+'</div>' + '<div class="mapHead"><div class="mapInfo">'+this.address+'</div>' + '<div class="mapHead"><div class="mapInfo">Best for: '+this.category+'</div>' +'</p></div>');
            infoWindow.open(map, this);
            map.panTo(position);
    });
}

// Remove Markers from Map when Location is Defined
function removeVenueMarkers() {
    for (var i in venueMarkers) {
        venueMarkers[i].marker.setMap(null);
        venueMarkers[i].marker = null;
    }
    while (venueMarkers.length > 0) {
        venueMarkers.pop();
    }
}

/* Responsive Map Resizing */
google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
});

// Initialize the Bindings
$(function() {
    ko.applyBindings(new mapView());
});