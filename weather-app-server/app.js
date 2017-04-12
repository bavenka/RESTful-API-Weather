var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var index = require('./routes/index');
var users = require('./routes/users');
const cors = require('cors');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

const timetable = [{
    course: "1",
    groups: [{
        name: "Group121",
        timetable: [
            {
                time: "8:30/9:50",
                subject: "Math121"
            },
            {
                time: "13:30/14:50",
                subject: "History121"
            },
            {
                time: "15:30/19:50",
                subject: "Physics121"
            }
        ]
    },
        {
            name: "Group122",
            timetable: [{
                time: "10:05/11:25",
                subject: "Math122"
            }]
        }
    ]
},
    {
        course: "2",
        groups: [{
            name: "Group221",
            timetable: [{
                time: "8:30/9:50",
                subject: "Math221"
            }]
        },
            {
                name: "Group222",
                timetable: [{
                    time: "8:30/9:50",
                    subject: "Math222"
                }]
            }
        ]
    }
];


const weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather';
const weatherApiAPPID = '0bcd51d21bed1ac0981c463585602e75';

app.get('/weather/:city/current', (req, res) => {
    const weatherQuery = weatherApiUrl + '?q=' + req.params.city + '&APPID=' + weatherApiAPPID;
    fetch(weatherQuery)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
        res.json(json);
    });

});


app.get('/timetable/:course/:group', (req, res) => {

    const course = req.params.course;
    const group = req.params.group;
    let time;
    timetable.find((t) => {
        if (t.course === course) {
            time = t.groups.find((g) => g.name === group);
        }
    });
    res.json(time);

});

app.get('/timetable/getallcourses', (req, res) => {

    let courses = {};
    courses['courses'] = [];
    timetable.find((t) => {
        courses["courses"].push(t.course);
    });
    res.json(courses);

});

app.get('/timetable-groups/:course/', (req, res) => {

    const course = req.params.course;
    let groups = {};
    groups['groups'] = [];
    timetable.find((t) => {
        if (t.course === course) {
            t.groups.find((g) => {
                groups["groups"].push(g.name);
            });
        }

    });
    res.json(groups);

});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// "APPID": "0bcd51d21bed1ac0981c463585602e75"
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
