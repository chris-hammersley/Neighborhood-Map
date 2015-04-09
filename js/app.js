// API Calls
function loadData() {

    var $wikiElem = $('#wikipedia-links');

    // Clear Existing Data Before New Request
    $wikiElem.text('');

    // Assign Searchbar Value to Variable
    var searchStr = $('#searchbar').val();

    // Initiate Wikipedia AJAX Request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + searchStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('Failed to get Wikipedia resources');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',

        // Callback for JSONP
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">'
                    + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

// loadData();
$('#form-container').submit(loadData);

// Instafeed showing Instagram Pics
var feed = new Instafeed({
    get: 'tagged',
    tagName: 'nolaarchitecture',
    target: 'instafeed',
    sortBy: 'most-recent',
    limit: 8,
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
    clientId: 'ecdea4ae8c6f476a9a84e4a47d999170'
});
feed.run();

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
//    this.nicknames = ko.observableArray(data.nicknames);

/*    this.title = ko.computed(function(){
        var title;
        var clicks = this.clickCount();
        if (clicks < 10) {
            title = 'the Runt';
        } else if (clicks < 20) {
            title = 'the Kitten';
        } else if (clicks < 30) {
            title = 'the Kitty';
        } else if (clicks < 40) {
            title = 'the Cat';
        } else {
            title = 'the Guru';
        }
            return title;
        }, this);
*/
}

// Build the FourSquare API Call
var client_id = 'GDIGYUEJ2F35H1E3BQCCSZVNZEP2OAJBNOTD2BEVHL0IXF3O';
var client_secret = 'HIO22Q3EXWKQ12YQ15NHN02X4L4V35NVP1C1GFEPGQ1C5WCW';
var base_url = 'https://api.foursquare.com/v2/';
var endpoint = 'venues/search?';
var categoryId = '4d4b7105d754a06374d81259';
var category = '&categoryId=' + categoryId;
var intent = '&intent=browse';
var radius = '&radius=1000';
var limit = '&limit=15';
var params = 'near=New+Orleans';
var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20150301';
var url = base_url+endpoint+params+category+intent+radius+limit+key;

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

//        setMarkers(center, radius, map);
//      }

//     function setMarkers(center, radius, map) {

//     }

// FourSquare return results for markers
$.get(url, function (result) {
  $('#msg pre').text(JSON.stringify(result));
  
  var markers = result.response.venues;
  var infowindow = "hello";

  setMarkers(markers);

  for (var i in markers){
    var place = markers[i];

    // initialize infowindow
    infowindow = new google.maps.InfoWindow({
    content: "holding pattern..."
    });

    // add markers to map
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.location.lat,place.location.lng),
        map: map
    });


    // add event listener for marker click
        google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.html);
        infowindow.open(map, this);
    });

  }});

  // Add FourSquare Marker Names to List
  function setMarkers(venuesArr){  
      for (var i in venuesArr){
          var venue = venuesArr[i];
          var str = '<p><strong>' + venue.name + '</strong> ' + '</p>';   
       //   str += venue.location.lat + ',';
       //   str += venue.location.lng;
       //   str += '</p>';
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
      //    console.log("Let's Explore the Beautiful City of " + city + ", " + state + "!");
 }
})

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