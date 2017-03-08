var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//var db = mongojs('mongodb://bp:bp@ds157258.mlab.com:57258/wvuims', ['test']);


var index = require('./routes/index');
var api = require('./routes/api');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', api);

app.listen(3000, function () {
	console.log('Server started on port 3000.');
});
