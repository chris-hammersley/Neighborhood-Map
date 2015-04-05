// API Calls
function loadData() {

//    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
//    var $nytHeaderElem = $('#nytimes-header');
//    var $nytElem = $('#nytimes-articles');
//    var $greeting = $('#greeting');

    // Clear Existing Data Before New Request
    $wikiElem.text("");
//    $nytElem.text("");

    // Assign Searchbar Value to Variable
    var searchStr = $('#searchbar').val();
//    var latStr = '29.9500';
//    var lngStr = '-90.0667';
//    var locationLatLong = 'lat=29.9500&lng=-90.0667';
//    var cityStr = $('#city').val();
//    var address = streetStr + ', ' + cityStr;

    // Initiate Instagram Request
  //  var instagramPic = 'https://api.instagram.com/v1/locations/search?lat=' + latStr + '&lng=' + lngStr;

    // https://api.instagram.com/v1/locations/search?lat=29.9500&lng=-90.0667&client_id=ecdea4ae8c6f476a9a84e4a47d999170

    // Initiate Wikipedia AJAX Request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + searchStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",

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

// Open Links in Modal after Document is Ready
$(document).ready(function() { init() })

function init() {
    $('#overlay').click(function() { closeDialog(); })
}

var feed = new Instafeed({
    get: 'tagged',
    tagName: 'instagramnola',
    target: 'instafeed',
    sortBy: 'most-recent',
    limit: 8,
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
    clientId: 'ecdea4ae8c6f476a9a84e4a47d999170'
});
feed.run();

var mapFilters = [
        {
            name : "Grub",
        //    clickCount : 0,
        //    imgSrc : 'img/felix.jpeg',
        //    nicknames: ['Hi-Hat']
        },{
            name : "Booze",
        //    clickCount : 0,
        //    imgSrc : 'img/tom.jpg',
        //    nicknames: ['Pokerface']
        },{
            name : "Walking Tours",
        //    clickCount : 0,
        //    imgSrc : 'img/josi.jpg',
        //    nicknames: ['Thimblelina']
        },{
            name : "What's Crazy",
        //    clickCount : 0,
        //    imgSrc : 'img/vicki.jpg',
        //    nicknames: ['SexyBabe']
        },{
            name : "Sights",
        //    clickCount : 0,
        //    imgSrc : 'img/bebop.jpg',
        //    nicknames: ['Jumper']
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