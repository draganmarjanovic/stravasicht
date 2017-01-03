/**
 * Stravasicht
 *
 * A simple widget to display Strava data.
 *
 * Author: Dragan Marjanovic - marjanovic.io
 */


// User configuration and Global Variables
// Set your access token here
accessToken: "",

refreshFrequency: 500, // How often to refresh the widget

httpGet: function(url) {
    var xmlHttp = new XMLHttpRequest(); // Create the request object
    xmlHttp.open("GET", url, false); // Make the request
    xmlHttp.send(null);
    return xmlHttp.responseText; //Return the response
},


command: function (callback) {
    var baseURL = "https://www.strava.com/api/v3/athlete/activities";
    var requestURL = baseURL + "?access_token=" + this.accessToken;
    // Feed the data back to the renderer for processing
    callback(0, this.httpGet(requestURL));
},

render: function (output) {
    // Process data
    // Render data
    content = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js\"></script>"
    // content += "<div><h6>" + output + "</h6></div>";
    content += '<canvas id="myChart"></canvas>'


    return content;
},

afterRender: function(domEl) {
    var ctx = document.getElementById('myChart');

    var labz = []
    var dats = []
    for (var i = 0; i < 365; i++) {
        labz.push("");
        dats.push(Math.random() * 100);
    }

    var dataz = {
        labels: labz,
        datasets: [{
            data: dats,
            backgroundColor: 'rgba(255, 255, 255, 1)',
        }]
    }

    config = {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 5,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    fontColor: "#FFF",
                    fontSize: 11,
                    fontStyle: "bold"
                },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    display: false
                }
            }]
        },
        legend: {
            display: false
        }
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: dataz,
        options: config
    });
    this.refreshFrequency = 100000;
},

style: "        \n\
  bottom: .25%     \n\
  left: 0.25%    \n\
  height: 200px \n\
  width: 99%    \n\
                \n\
"
