var mapFilters = [
        {
            name : 'Food',
        //    clickCount : 0,
        //    imgSrc : 'img/felix.jpeg',
        //    nicknames: ['Hi-Hat']
        },{
            name : 'Bars',
        //    clickCount : 0,
        //    imgSrc : 'img/tom.jpg',
        //    nicknames: ['Pokerface']
        },{
            name : 'Walking Tours',
        //    clickCount : 0,
        //    imgSrc : 'img/josi.jpg',
        //    nicknames: ['Thimblelina']
        },{
            name : 'Entertainment',
        //    clickCount : 0,
        //    imgSrc : 'img/vicki.jpg',
        //    nicknames: ['SexyBabe']
        },{
            name : 'Sights',
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