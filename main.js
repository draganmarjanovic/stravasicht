/**
 * Stravasicht
 *
 * A simple widget to display Strava data.
 *
 * Author: Dragan Marjanovic - marjanovic.io
 */

command: function (callback) {

    // User Configuration and Variables
    // Set your access token here :)
    var accessToken = "";


    var baseURL = "https://www.strava.com/api/v3/athlete/activities";
    var requestURL = baseURL + "?access_token=" + accessToken;

    // Make the request
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestURL, false);
    xmlHttp.send(null);

    // Feed the data back to the renderer for processing
    callback(0,xmlHttp.responseText);
},

refreshFrequency: 5000,

render: function (output) {
    return "<div><h6>" + output + "</h6></div>";
},

style: "        \n\
  top: 20px     \n\
  left: 20px    \n\
                \n\
  h1            \n\
    color: #fff \n\
"
