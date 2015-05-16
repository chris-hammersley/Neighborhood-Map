# Find Grub In New Orleans Here
http://chris-hammersley.github.io/Neighborhood-Map/

# Resources & Research

> Overcoming Code Rejection
http://stackoverflow.com/questions/1963102/what-does-the-jslint-error-body-of-a-for-in-should-be-wrapped-in-an-if-statemen
http://stackoverflow.com/questions/1740218/error-handling-in-getjson-calls
http://stackoverflow.com/questions/309953/how-do-i-catch-jquery-getjson-or-ajax-with-datatype-set-to-jsonp-error-w

> Google Maps API, Knockout & Data Binding
http://discussions.udacity.com/t/google-maps-allows-data-binding-with-mvc-objects/4277
https://developers.google.com/maps/articles/mvcfun
https://developers.google.com/maps/documentation/javascript/examples/control-options
https://www.airpair.com/knockout/posts/top-10-mistakes-knockoutjs
http://knockoutjs.com/documentation/plugins-mapping.html
http://www.codeproject.com/Articles/351298/KnockoutJS-and-Google-Maps-binding
http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/

> Google Maps & Markers
https://developers.google.com/maps/documentation/javascript/examples/marker-simple
https://developers.google.com/maps/tutorials/
https://developers.google.com/maps/documentation/javascript/infowindows
http://snippetrepo.com/snippets/multiple-markers-using-json-with-google-maps-api
http://you.arenot.me/2010/06/29/google-maps-api-v3-0-multiple-markers-multiple-infowindows/
http://stackoverflow.com/questions/5137007/trying-to-display-infowindow-data-from-json-on-multiple-markers
http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html

> Reverse Geocoding for Neighborhood Name
https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
http://stackoverflow.com/questions/22704997/how-to-get-city-name-from-latitude-and-longitude-in-phone-gap
http://www.raymondcamden.com/2013/03/05/Simple-Reverse-Geocoding-Example

> Google Maps & Places
https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests

> Instagram/Instafeed Insights
http://instafeedjs.com/
https://github.com/stevenschobert/instafeed.js/labels/question

> FourSquare API & Venue Details
https://developer.foursquare.com/overview/auth#userless
http://stackoverflow.com/questions/16167176/plot-venues-from-foursquare-on-google-maps
https://developer.foursquare.com/docs/venues/explore
https://developer.foursquare.com/docs/venues/search
https://developer.foursquare.com/docs/responses/venue
https://developer.foursquare.com/categorytree
http://api.jquery.com/jQuery.getJSON/
http://blog.qoyyuum.me/how-to-use-foursquare-api/

> Knockout/JSON/jQuery
http://api.jquery.com/val/
http://knockoutjs.com/documentation/json-data.html
http://knockoutjs.com/documentation/value-binding.html

# FourSquare Access Token
> https://foursquare.com/oauth2/authenticate?client_id=xxx&response_type=token&redirect_uri=http://chris-hammersley.github.io/Neighborhood-Map/
> access_token=HG5IOTFR2QGYTMJNHNEW32TL4VISFRKBE1LKS0AXT4SYLDOW

## MVVM using Knockout Notes
The Model part is your data. Typically this will come in the form of JSON loaded via AJAX.

The View part is your HTML, with any element you want to populate or manipulate given a binding with a “data-bind” attribute.

Finally the View Model is the JavaScript object instance which connects everything together. These are reusable functions, so you can have multiple instances of a ViewModel in one page, or nest a child model in a parent.

## Steps I Followed to Create the App
1. initialize a map DONE
    full-screen DONE
    responsive DONE
    error-handling (display a graphic of new orleans map if error)
2. load Instagram API to an array DONE
    responsive DONE
    error-handling (hide the footer area if error)
3. load FourSquare API to an array DONE
    error-handling (define a manual list that displays if error)
4. pass foursquare location names from array to list DONE
    responsive DONE
    observable DONE
    need to select marker and open infowindow when clicked DONE
5. pass foursquare location info from array and create markers for each item DONE
6. pass foursquare location details from array and populate item infoWindows DONE
7. create function to display infoWindows when marker or list name is selected DONE
8. searchbar that searches the location names from list DONE
    observable DONE
9. searchbar filters the list display
    after return DONE
    in real-time
10. searchbar filters the map markers
    after return DONE
    in real-time

## Grading Criteria
* Responsive for desktop, tablet & phone - DONE
* No errors - DONE
* Knockout code separation of concerns (MVVM) - DONE
* Don't update the DOM manually - use observables - DONE
* Google Maps API - DONE
* 1 other data API - DONE (FourSquare & Instafeed/Instagram)
* All data requests async - DONE
* Error Handling if no connection to Google Maps API - DONE
* Map with locations indicated by Markers on initial load - DONE
* No Map/Marker load errors - DONE
* Markers are clickable - DONE
* Marker style changes to indicate selected status - DONE
* Marker shows additional information - DONE
* Search bar that filters on the name of each location - DONE
* Search bar filters the list view - DONE
* Search bar filters the displayed markers - DONE
* List view to browse initial content - DONE
* Code neatly formatted & commented - DONE
* Comments effectively explain longer code procedures - DONE
* README file with all steps required to run app - TADA!