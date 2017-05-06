'use strict';
var course = '';
var group = '';

function chooseCourse() {
    var courseEl = document.getElementById('course');
    course = courseEl.options[courseEl.selectedIndex].text;
}

function chooseGroup() {
    var groupEl = document.getElementById('group');
    group = groupEl.options[groupEl.selectedIndex].text;
}

function getCourse() {
    var courseEl = document.getElementById('course');
    return courseEl.options[courseEl.selectedIndex].text;
}
function getGroup() {
    var groupEl = document.getElementById('group');
    return groupEl.options[groupEl.selectedIndex].text;
}


function pushUrl() {
    var url = '/timetable/' + course + '/' + group + '/';
    if (history.state === null) {
        history.pushState(null, null, url);
    }else {
        history.replaceState(null,null, url);
    }

}


function showTimetable() {
    pushUrl();
    var url = "http://localhost:3000/timetable/" + course + "/" + group;
    fetch(url)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        renderTable(json);
    });
}

function renderTable(json) {
    $('#table').empty();
    var $table = $('<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp"/>');
    $table.append('<tr><th>Group</th><th>Subject</th><th>Start Time</th><th>Finish Time</th></tr>');
    json.timetable.map((day, i) => {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let newDate = hours + ":" + minutes;
        if(day.timeStart <= newDate && day.timeFinish >= newDate){
            $table.append('<tr><td>' + json.name + '</td><td>' + day.subject + '</td><td>' + day.timeStart + '</td><td>' + day.timeFinish + '</td></tr>');
        }
    });
    $('#table').append($table);
    getWeather();
}

function getWeather() {
    var url = "http://localhost:3000/weather/Grodno/current";
    fetch(url)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        renderWeather(json);
    });
}

function renderWeather(json) {
    $('#weather').empty();
    var temperature = parseInt(json.main.temp) - 273;
    var main = json.weather[0].main;
    var description = json.weather[0].description;
    var icon = json.weather[0].icon;
    var humidity = json.main.humidity;
    var pressure = json.main.pressure;
    var wind = json.wind.speed;

    var weatherDiv = $('#weather');
    weatherDiv.append('<div id="icon">' + '<img style="width: 100px" src="http://openweathermap.org/img/w/' + icon + '.png"></div>');
    weatherDiv.append('<div id="main">' + main + '</div>');
    weatherDiv.append('<div id="description">' + description + '</div>');
    weatherDiv.append('<div id="temp">' + temperature + '<sup>o</sup>C</div>');
    weatherDiv.append('<div id="humidity">' + humidity + '%</div>');
    weatherDiv.append('<div id="pressure">' + pressure + 'hPa</div>');
    weatherDiv.append('<div id="wind">' + wind + 'm/s</div>');
}

function showG() {
    $.ajax({
        url: "http://localhost:3000/timetable-groups/" + $('#course').val() + "/",
        context: document.body,
        data: 'json',
        success: function (data) {
            $.each(data, function (key, value) {
                $.each(value, function (index, groupValue) {
                    $('#group')
                        .append($('<option>', {value: groupValue}).text(groupValue));
                })
            });
        }
    });
    chooseCourse();
}

document.getElementById("course").addEventListener("change", function () {
    showG();
});

document.getElementById("group").addEventListener("change", function () {
    chooseGroup();
});
document.getElementById("btn").addEventListener("click", function () {
    showTimetable();
});

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3000/timetable/getallcourses",
        context: document.body,
        data: 'json',
        success: function (data) {
            $.each(data, function (key, value) {
                $.each(value, function (index, courseValue) {
                    $('#course')
                        .append($('<option>', {value: courseValue})
                            .text(courseValue));
                })
            });
        }
    });
});
