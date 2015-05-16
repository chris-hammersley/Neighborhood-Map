/**
 * Code to display a Google Map of Hot Grub Spots in New Orleans.
 * Fetches data from the Google Maps API and Foursquare API
 * @author Chris Hammersley
 */

/* ======= Model ======= */

// Function that creates the basic info necessary to populate Map Markers
var MapMarkerSet = function(marker, name, category, position) {
  "use strict";
  this.marker = marker;
  this.name = name;
  this.category = category;
  this.position = position;
};

// TODO: create neighborhood selector
// TODO: change Instagram images by neighborhood

/* Array of New Orleans neighborhoods
  var neighborhoods = [
    {
        name : 'French Quarter', 
        value : 'French Quarter, New Orleans',
        tagIG : 'frenchquarter'
    },{
        name : 'Marigny',
        value : 'Marigny, New Orleans',
        tagIG : 'marigny'
    },{
        name : 'Bywater',
        value : 'Bywater, New Orleans',
        tagIG : 'bywater'
    },{
        name : 'Central Business District',
        value : 'CBD, New Orleans',
        tagIG : 'cbdnola'
    },{
        name : 'Treme',
        value : 'Treme, New Orleans',
        tagIG : 'treme'
    },{
        name : 'Garden District',
        value : 'Garden District, New Orleans',
        tagIG : 'gardendistrict'
    },{
        name : 'Uptown',
        value : 'Uptown, New Orleans',
        tagIG : 'uptownnola'
    }
  ];
*/

// TODO: create venue type selector using FourSquare catID

/* Array of FourSquare Venue Types
var venueTypes = [
    {
        name : 'Grub Spots',
        foursqCatId: '4d4b7105d754a06374d81259'
    },{
        name : 'Nightlife',
        foursqCatId : '4d4b7105d754a06376d81259'
    },{
        name : 'Music',
        foursqCatId : '4bf58dd8d48988d1e5931735'
    },{
        name : 'Festivals',
        foursqCatId : '4d4b7105d754a06373d81259'
    }
  ];
*/

/* ======= ViewModel ======= */

// TODO: select neighborhood names to change location

/* Make Neighborhood Array Values Observable
var Hood = function (data) {
    this.name = ko.observable(data.name);
    this.value = ko.observable(data.value);
  };
*/

// Set Up the Google Map ViewModel
function MapViewModel() {
  var self = this;
  var map;
  var service; // Used to filter the Results Set based on Searchterm
  var preferredLocation; // Initial Neighborhood that drives Google Map location
  var infowindow; // Infowindow that displays when Map Marker is clicked
  var mapBounds; // Used to set the display boundaries of the Google Map
  var neighborhoodMarkers = []; // Array of Map Markers for Neighborhoods
  var venueMarkers = []; // Array of Map Markers of FourSquare Venues
  var defaultNeighborhood = 'Marigny, New Orleans'; // Sets Default Map Location
  var catId = "4d4b7105d754a06374d81259"; // Category of FourSquare Venue Results
  var locationLimit = 30; // Number of Venue Results returned from FourSquare
  var tagIG = 'noladining'; // Instagram Tag to Retrieve IG Images from Instafeed
  var venueResults = [];

  self.venueResults = ko.observableArray([]); // Venue List Results returned from FourSquare query
  self.filteredList = ko.observableArray(self.venueResults()); // Venue List Results filtered by Searchterm
  self.neighborhood = ko.observable(defaultNeighborhood); // Neighborhood Value to use with Markers
  self.searchterm = ko.observable(''); // Observable Searchterm to filter Venue List

  // Setup Instafeed API to fetch Images based on IG Tag
  var feed = new Instafeed({
      get: 'tagged',
      tagName: tagIG,
      target: 'instafeed',
      sortBy: 'most-recent',
      limit: 8,
      template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a><br />',
      clientId: 'ecdea4ae8c6f476a9a84e4a47d999170'
  });
  feed.run();

// TODO: change neighborhoods when new name selected

/* 
  //  var defaultNeighborhood = neighborhoods[1].value; // Use to change neighborhoods

  // Set neighborhoodList as an Observable Array // This is the Neighborhood Selection list on Map
  self.neighborhoodList = ko.observableArray([]);

  // Loop through array & populate the Neighborhood Selection list with names and values
  neighborhoods.forEach(function(hoodItem) {
      self.neighborhoodList.push(new Hood(hoodItem));
  });

  // Set the Current Neighborhood as an Observable of the neighborhoodList array (pointer changes as well)
  self.currentHood = ko.observable(this.neighborhoodList()[0]);

  // Set the Current Neighborhood to the Last Selected Value from Neighborhood List on Map
  this.setNeighborhood = function(currentHood) {
    self.currentHood(currentHood);
  };

  console.log(defaultNeighborhood)
*/

  // Set Google Map Size based on Browser Window
  self.mapSize = ko.computed(function() {
    $("#map-canvas").height($(window).height());
  });

  // Call Google Map Initialization Function
  initializeMap();

  // Update the Neighborhood Map Markers from FourSquare Venues that don't match Searchterm
  self.computedNeighborhood = ko.computed(function() {
    if (self.neighborhood() !== '') {
      if (venueMarkers.length > 0) {
        removeVenueMarkers();
      }
      removeNeighborhoodMarker();
      requestNeighborhood(self.neighborhood());
      self.searchterm('');
    }
  });

  // Pan To & Show Marker Infowindow when Venue Name is Clicked from Venue List
  self.clickMarker = function(venue) {
    var venueName = venue.venue.name.toLowerCase();
    for (var i in venueMarkers) {
      if (venueMarkers[i].name === venueName) {
        google.maps.event.trigger(venueMarkers[i].marker, 'click');
        map.panTo(venueMarkers[i].position);
      }
    }
  };

  // Change Venue Results displayed in list to match Searchterm
  self.displayList = ko.computed(function() {
    var venue;
    var list = [];
    var searchterm = self.searchterm().toLowerCase();
    for (var i in self.venueResults()) {
      venue = self.venueResults()[i].venue;
      if (venue.name.toLowerCase().indexOf(searchterm) != -1 ||
        venue.categories[0].name.toLowerCase().indexOf(searchterm) != -1) {
        list.push(self.venueResults()[i]);
    }}
    self.filteredList(list);
  });

  // Change the Map Markers displayed to match Searchterm
  self.displayMarkers = ko.computed(function() {
    filteringMarkersBy(self.searchterm().toLowerCase());
  });

  // Filter Map Markers by Searchterm
  function filteringMarkersBy(searchterm) {
    for (var i in venueMarkers) {
      if (venueMarkers[i].marker.map === null) {
        venueMarkers[i].marker.setMap(map);
      }
      if (venueMarkers[i].name.indexOf(searchterm) === -1 &&
        venueMarkers[i].category.indexOf(searchterm) === -1) {
        venueMarkers[i].marker.setMap(null);
    }}
  }

  // Function to Initialize the Google Map
  function initializeMap() {
    var mapOptions = {
      disableDefaultUI: true,
    };
    if (window.google === undefined) {
      console.log('Uh oh. Google Map has a problem. Better call Houston!')
      var errorPage = document.getElementById('error');
      error.style.display = 'block';
    } else {
      console.log('Success! Google Map has been loaded :)')
      map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
      infowindow = new google.maps.InfoWindow();
    }
  }

  // Add the Neighborhood Markers based on FourSquare Venue Results to Google Map
  function getNeighborhoodInformation(placeData) {
    var lat = placeData.geometry.location.lat();
    var lng = placeData.geometry.location.lng();
    var name = placeData.name;
    var bounds;
    preferredLocation = new google.maps.LatLng(lat, lng);
    map.setCenter(preferredLocation);

    // Add Neighborhood Markers to Map
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });
    neighborhoodMarkers.push(marker);

    // Open Infowindow when Marker has been Clicked
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(name);
      infowindow.open(map, marker);
    });

    // TODO: allow user to change the venue category and number of venues shown with selectors

    // Return FourSquare Venues based on Category & Map Location from FourSquare API
    foursquareBaseURL = "https://api.foursquare.com/v2/venues/explore?ll=";
    initialLatLng = lat + ", " + lng;
    category = "&categoryId=" + catId;
    limit = "&limit=" + locationLimit;
    authorization = "&oauth_token=HG5IOTFR2QGYTMJNHNEW32TL4VISFRKBE1LKS0AXT4SYLDOW&v=20150301";
    
    // Compile FourSquare API Request String based on Variables
    foursquareApiQuery = foursquareBaseURL + initialLatLng + category + limit + authorization;

    // API Request to FourSquare; Venue Results Create Google Map Markers
    $.getJSON(foursquareApiQuery, function(data) {
      self.venueResults(data.response.groups[0].items);
      for (var i in self.venueResults()) {
        createMarkers(self.venueResults()[i].venue);
      }
      // Maximize the Display Zoom Level of Google Map based on FourSquare Result Set
      bounds = data.response.suggestedBounds;
      if (bounds !== undefined) {
        mapBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
          new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng));
        map.fitBounds(mapBounds);
      }        
    })
    .done(function() {
      console.log('Success! Grub Spots have been loaded :)');
    }) // closes done
    .fail(function() {
      console.log('Failure to load grub spots :(');

    // Update Grub Spot List Message on Fail
    $('.no-result').html('It looks like the connection<br />to FourSquare is having<br />problems. Please try<br /> reloading the page to<br /> refresh the grub spot list!');
    });
  }

  // Callback Function to return Neighborhood Location if service is working
  function neighborhoodCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      getNeighborhoodInformation(results[0]);
    }
  }

  // Function to Return Neighborhood
  function requestNeighborhood(neighborhood) {
    var request = {
      query: neighborhood
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, neighborhoodCallback);
  }

  // Remove Neighborhood Marker from Map
  function removeNeighborhoodMarker() {
    for (var i in neighborhoodMarkers) {
      neighborhoodMarkers[i].setMap(null);
      neighborhoodMarkers[i] = null;
  }
    while (neighborhoodMarkers.length > 0) {
      neighborhoodMarkers.pop();
    }
  }

  // Create Map Markers using FourSquare Venues
  function createMarkers(venue) {
    var lat = venue.location.lat;
    var lng = venue.location.lng;
    var name = venue.name;
    var category = venue.categories[0].name;
    var position = new google.maps.LatLng(lat, lng);
    var address = venue.location.address; // Displays Street Address
    var xStreet = venue.location.crossStreet; // Displays Cross Street
    var contact;
    if (venue.contact.formattedPhone === undefined) {
      contact = 'Oops, no phone!'; // Error Handling when Phone is Undefined
    } else {
      contact = venue.contact.formattedPhone;
    }
    var foursquareUrl = "https://foursquare.com/v/" + venue.id;
    var rating = venue.rating; // Displays Venue Rating
    var status; // Displays Current Open or Closed Status
    if (venue.hours === undefined) {
      status = '<b>Open? Closed?</b> Better call...' + contact; // Error Handling when Venue Hours are Undefined
      } else {
      status = venue.hours.status; // Displays if Venue is Open or Closed
      }
    var url = venue.url;
    var slicedUrl;
    if (url && url.slice(0, 7) === 'http://') {
      slicedUrl = url.slice(7);
    } else if (url && url.slice(0, 8) === 'https://') {
      slicedUrl = url.slice(8);
    } else {
      slicedUrl = url;
    }

    // Place FourSquare Venue Details into Map Markers
    var marker = new google.maps.Marker({
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      position: position,
      title: name
    });
    venueMarkers.push(new MapMarkerSet(marker, name.toLowerCase(), category.toLowerCase(), position));

    // Add FourSquare Venue Details to Map Marker Infowindow
    // Section 1 shows the Venue Name (venue name can be filtered with searchterm)
    var section1 = '<div id="iw-container" class="infowindow"><p><span class="iw-title">' + name + '</span></p></div>';
      
    // Section 2 shows the Venue 'Hotness' Rating if available
    var section2;
    if (rating !== undefined) {
      section2 = '<p><strong>Hotness Rating:</strong> <span class="v-rating">' + rating.toFixed(1) + '</span></p>';
    } else {
      section2 = '<p><span class="v-rating"><em>not available</em></span></p>';
    }

    // Section 3 shows the Venue Type, Address & Cross Street if available (venue type can be filtered with searchterm; i.e. creole, american, bakery, diner, etc.)
    // TODO - allow for dynamic venue types based on values in neighborhoods array
    var section3;
    if (xStreet !== undefined) {
      section3 = '<p><em>Grub Type: </em><span>' + category +
      '</span></p><p><span>' + address  + ' (' + xStreet + ')</span></p>'; // Error Handling when Cross Street is Undefined
    } else {
      section3 = '<p><em>Grub Type: </em><span>' + category +
      '</span></p><p><span>' + address  + '</span></p>';
    }

    // Section 4 shows if the Venue is Open or Closed if available
    var section4;
    if (status === undefined) {
      section4 = '<b>Open? Closed?</b> Better call...' + contact; // Error Handling when Venue Hours are Undefined
    } else {
      section4 = '<b>' + status + '</b>';
    }

    // Set the Infowindow with FourSquare Venue Content when Marker is Clicked
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(section1 + section2 + section3 + section4);
      infowindow.open(map, this);
      map.panTo(position);
    });
  }

  // Function to Remove Venue Map Markers
  function removeVenueMarkers() {
    for (var i in venueMarkers) {
      venueMarkers[i].marker.setMap(null);
      venueMarkers[i].marker = null;
  }
    while (venueMarkers.length > 0) {
      venueMarkers.pop();
    }
  }

  // Event Listener to Update Map Boundary when Browser Window is Resized
  window.addEventListener('resize', function(e) {
    map.fitBounds(mapBounds);
    $("#map-canvas").height($(window).height());
  });

// TODO: allow users to choose another city by making latlng a variable based on new city selection

// Reverse Geocoding API to Return City & State Names
var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=29.9500,-90.0667";
var city, state;

function reverseGeoCityName() {
  $.getJSON(geocodingAPI, function (data) {
    // Load the City & State results
    var result = data.results[0];
    //Look for Locality (city) and Administrative_area_level_1 (state) Tags
    city = "";
    state = "";
    for (var i = 0, len = result.address_components.length; i < len; i++) {
        var ac = result.address_components[i];
        if(ac.types.indexOf('locality') >= 0) city = ac.long_name;
        if(ac.types.indexOf('administrative_area_level_1') >= 0) state = ac.long_name;
    }
  })
  // Display the Dynamic Welcome Message on Success
  .done(function() {
    console.log('Success! Your Location Has Loaded :)');
    if(city !== '' && state !== '') {
      $('#city-name').html('Explore Food in ' + city + '!');
    }
  })
  // Display the Static Welcome Message on Failure
  .fail(function() {
    console.log('Uh oh. Failed to find your location. Are you lost? :(');
    $('#city-name').html('Explore New Orleans Cuisine!');
  });
}
reverseGeoCityName();
}

// Apply Binding to the ViewModel
$(function() {
  ko.applyBindings(new MapViewModel());
});