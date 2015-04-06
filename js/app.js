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

/* FourSquare
var lat = 29.9500;
var lng = -90.0667;
var location = lat + ',' + lng;        
$.getJSON('https://api.foursquare.com/v2/venues/search', {
    ll: location,
    radius: 100,
    limit: 50,
    intent: 'browse',
    query: 'food',
    categoryId: '4d4b7105d754a06374d81259',
    client_id: 'GDIGYUEJ2F35H1E3BQCCSZVNZEP2OAJBNOTD2BEVHL0IXF3O',
    client_secret: 'HIO22Q3EXWKQ12YQ15NHN02X4L4V35NVP1C1GFEPGQ1C5WCW',
    v: 20130420
 }).done(function(data) {
    $.each(data.response.venues, function(i, item) {
        console.log(item);
        map.data.addGeoJson(item);
    });
});
*/

/* Twitter Trending Tweets
var script = document.createElement('script');
script.src = 'https://api.twitter.com/1.1/geo/search.json?accuracy=0&query=New%20Orleans&granularity=neighborhood&autocomplete=false&trim_place=false';
document.getElementsByTagName('head')[0].appendChild(script);

function tweet_actions(response) {
  map.data.addGeoJson(response);
} */

var mapFilters = [
        {
            name : 'Grub',
            foursqCatId: '4d4b7105d754a06374d81259',
            instafeedTagName : ['nolafood', 'eatnola', 'noladining', 'nolafoodies', 'nolaeats', 'frenchmarket', 'killerpoboys', 'coopsplace'],
        //    imgSrc : 'img/felix.jpeg',
        //    nicknames: ['Hi-Hat']
        },{
            name : 'Booze',
            foursqCatId : '4d4b7105d754a06376d81259',
            instafeedTagName : ['nolacocktails', 'handgrenades', 'patobriens', 'erinrose', 'rooseveltbar'],
        //    imgSrc : 'img/tom.jpg',
        //    nicknames: ['Pokerface']
        },{
            name : 'Music',
            foursqCatId : '4bf58dd8d48988d1e5931735',
            instafeedTagName : ['frenchmanstreet', 'preservationhall', 'nolamusic', 'nolajazzfest', ''],
        //    imgSrc : 'img/bebop.jpg',
        //    nicknames: ['Jumper']
        },{
            name : 'Festivals',
            foursqCatId : '4d4b7105d754a06373d81259',
            instafeedTagName : ['frenchquarterfestival', 'bayouboogaloo', 'satchmofest', '', ''],
        //    imgSrc : 'img/bebop.jpg',
        //    nicknames: ['Jumper']
        },{
            name : 'Hoods',
            foursqCatId : '4f2a25ac4b909258e854f55f',
            instafeedTagName : ['bywater', 'marigny', 'treme', 'frenchquarter', 'uptownnola', 'lower9th', 'poydrascorridor', 'gardendistrict'],
        //    imgSrc : 'img/josi.jpg',
        //    nicknames: ['Thimblelina']
        },{
            name : 'Cemetaries',
            foursqCatId : '4bf58dd8d48988d15c941735',
            instafeedTagName : 'nolacemetaries',
        //    imgSrc : 'img/bebop.jpg',
        //    nicknames: ['Jumper']
        },{
            name : 'What\'s Crazy',
            foursqCatId : '4d4b7105d754a06373d81259',
            instafeedTagName : ['nolabulls', 'reddressrunnola', 'neworleansburlesque', 'nola', 'nolamardigras'],
        //    imgSrc : 'img/vicki.jpg',
        //    nicknames: ['SexyBabe']
        }
             ]

var Filter = function (data) {
//    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
//    this.imgSrc = ko.observable(data.imgSrc);
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

var ViewModel = function () {
    var self = this;

    this.filterList = ko.observableArray([]);

    mapFilters.forEach(function(filterItem) {
        self.filterList.push( new Filter(filterItem) );
    });

    this.currentFilter = ko.observable( this.filterList()[0]);

    this.incrementCounter = function() {
        this.clickCount(this.clickCount() + 1);
    };

    this.setFilter = function(clickedFilter) {
        self.currentFilter(clickedFilter)
    };
}

ko.applyBindings(new ViewModel());