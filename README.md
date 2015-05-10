<h1>How to Use 'In Your Hood'</h1>
<a href="http://chris-hammersley.github.io/Neighborhood-Map/">CLICK HERE</a>


<h3>Project 5 Resources</h3>

<strong>Google Maps API, Knockout & Data Binding</strong>
http://discussions.udacity.com/t/google-maps-allows-data-binding-with-mvc-objects/4277
https://developers.google.com/maps/articles/mvcfun
https://developers.google.com/maps/documentation/javascript/examples/control-options
https://www.airpair.com/knockout/posts/top-10-mistakes-knockoutjs
http://knockoutjs.com/documentation/plugins-mapping.html
http://www.codeproject.com/Articles/351298/KnockoutJS-and-Google-Maps-binding
http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/

<strong>Google Maps & Markers</strong>
https://developers.google.com/maps/documentation/javascript/examples/marker-simple
https://developers.google.com/maps/tutorials/
https://developers.google.com/maps/documentation/javascript/infowindows
http://snippetrepo.com/snippets/multiple-markers-using-json-with-google-maps-api
http://you.arenot.me/2010/06/29/google-maps-api-v3-0-multiple-markers-multiple-infowindows/
http://stackoverflow.com/questions/5137007/trying-to-display-infowindow-data-from-json-on-multiple-markers
http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html

<strong>Reverse Geocoding for Place Names</strong>
https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
http://stackoverflow.com/questions/22704997/how-to-get-city-name-from-latitude-and-longitude-in-phone-gap
http://www.raymondcamden.com/2013/03/05/Simple-Reverse-Geocoding-Example

<strong>Google Maps & Places</strong>
https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests

<strong>Instagram/Instafeed help</strong>
http://instafeedjs.com/
https://github.com/stevenschobert/instafeed.js/labels/question

<strong>FourSquare help</strong>
https://developer.foursquare.com/overview/auth#userless
http://stackoverflow.com/questions/16167176/plot-venues-from-foursquare-on-google-maps
https://developer.foursquare.com/docs/venues/explore
https://developer.foursquare.com/docs/venues/search
https://developer.foursquare.com/docs/responses/venue
https://developer.foursquare.com/categorytree
http://api.jquery.com/jQuery.getJSON/
http://blog.qoyyuum.me/how-to-use-foursquare-api/

<i>https://foursquare.com/oauth2/authenticate?client_id=xxx&response_type=token&redirect_uri=http://chris-hammersley.github.io/Neighborhood-Map/</i>
<i>access_token=HG5IOTFR2QGYTMJNHNEW32TL4VISFRKBE1LKS0AXT4SYLDOW</i>

<strong>Knockout/JSON/jQuery</strong>
http://api.jquery.com/val/
http://knockoutjs.com/documentation/json-data.html
http://knockoutjs.com/documentation/value-binding.html

<strong>CSS Tricks</strong>
http://stackoverflow.com/questions/6509106/css-ways-to-break-list-into-columns-on-page

<strong>The Steps I Need to Follow for the App</strong>
1. initialize a map DONE
    full-screen DONE
    responsive DONE
    error-handling (display a graphic of new orleans map if error)
2. load Instagram API to an array DONE
    responsive DONE
    error-handling (hide the header area if error)
3. load FourSquare API to an array DONE
    error-handling (define a manual list that displays if error)
4. pass foursquare location names from array to list DONE
    responsive
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

<strong>Grading Criteria</strong>
Responsive for desktop, tablet & phone
No errors
Knockout code separation of concerns (MVVM)
Don't update the DOM manually - use observables
Google Maps API
1 other data API (instagram & foursquare)
All data requests async
Error Handling if no connection (to maps/IG/4sq)
Map with locations indicated by Markers
Markers are clickable
Marker style changes to indicate selected status (will infoWindow suffice? or change the color?)
Marker shows additional information (no errors/responsive)
Search bar that filters on the name of each location
Search bar filters the list view
Search bar filters the displayed markers
List view to browse initial content (no errors/responsive)
Code neatly formatted & commented
Comments effectively explain longer code procedures
README file with all steps required to run app

The Model part is your data. Typically this will come in the form of JSON loaded via AJAX.

The View part is your HTML, with any element you want to populate or manipulate given a binding with a “data-bind” attribute.

Finally the View Model is the JavaScript object instance which connects everything together. These are reusable functions, so you can have multiple instances of a View Model in one page, or nest a child model in a parent.



