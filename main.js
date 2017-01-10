/**
 * Stravasicht
 *
 * A simple (but configurable) widget to display Strava data.
 *
 * Author: Dragan Marjanovic - marjanovic.io
 */


// User configuration and Global Variables
// Set your access token here
accessToken: "",

refreshFrequency: 1000, // How often to refresh the widget

// Options: distance, elapsed_time, average_speed, max_speed
metric: "distance", // The metric to track and display

rate_tracker: 0,

httpGet: function(url) {
    var xmlHttp = new XMLHttpRequest(); // Create the request object
    xmlHttp.open("GET", url, false); // Make the request
    xmlHttp.send(null);
    return xmlHttp.responseText; //Return the response
},

getData: function () {
    var baseURL = "https://www.strava.com/api/v3/athlete/activities";
    var requestURL = baseURL + "?access_token=" + this.accessToken;
    this.rate_tracker++;
    return this.httpGet(requestURL);
},

getDayCount: function(now) {
    var start = new Date(now.getFullYear(), 0, 0);
    console.log("Start: " + start);
    console.log("Now: " + now);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    console.log("Frac: " + (diff/oneDay) + "Diff:" + diff + "oneDay" + oneDay);
    return Math.floor(diff / oneDay);
},

command: function (callback) {
    requestData = this.getData();
    // Feed the data back to the renderer for processing
    callback(0, requestData);
},

render: function (output) {
    // Initialise the Chart library and canvas container
    content = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js\"></script>"
    content += '<canvas id="myChart"></canvas>'
    return content;
},

afterRender: function(domEl) {
    var ctx = document.getElementById('myChart');

    activityData = JSON.parse(this.getData());


    var trackedMetricData = [];
    var labelData = []

    var day = this.getDayCount(new Date());

    for (var i = 0; i < day; i++) {
        labelData.push("");
        trackedMetricData.push(0.001);
    }
    console.log(trackedMetricData);

    for (var i=0; i < activityData.length; i++) {
        var activity = activityData[i];
        var dayBin;

        // activityDate = new Date(activity.start_date_local);
        activityDate = new Date(activity.start_date);
        if (activityDate.getFullYear() >= new Date().getFullYear()) {
            var sdLocal = activity.start_date_local;
            var date = sdLocal.substring(0, sdLocal.indexOf("T"));
            dayBin = this.getDayCount(new Date(date)) - 1;
            switch (this.metric) {
                case "elapsed_time":
                    trackedMetricData[dayBin] += activity.elapsed_time/60;
                    break;
                case "average_speed":
                    averageKilometres = activity.average_speed * 60 * 60 / 1000;
                    trackedMetricData[dayBin] += averageKilometres;
                    break;
                case "max_speed":
                    maxKph = activity.max_speed * 60 * 60 / 1000;
                    trackedMetricData[dayBin] += maxKph;
                    case "distance":
                default: // Default should be distance
                    console.log("Bin: " + dayBin + "\n" + "Distance:" + activity.distance/1000);
                    trackedMetricData[dayBin] += activity.distance/1000;
                    break;
            }
        }

    }


    console.log(trackedMetricData);
    var dataz = {
        labels: labelData,
        datasets: [{
            data: trackedMetricData,
            backgroundColor: 'rgba(255, 255, 255, 1)',
        }]
    }

    config = {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 5,
        scales: {
            xAxes: [{ display: false }],
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
        legend: { display: false }
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: dataz,
        options: config
    });
    this.refreshFrequency = 100000;
},

style: "            \n\
  bottom: .25%      \n\
  left: 0.25%       \n\
  height: 200px     \n\
  width: 99%        \n\
"
