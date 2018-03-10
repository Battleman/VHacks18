var express = require('express');
var bodyParser = require("body-parser");
var path = require("path");
var app = express();

var port = process.env.PORT || 3000;

app.use('/css', express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, function () {
	console.log('App listening on port 3000!');
})

app.get('/',function(req, res) {   
	res.sendFile(path.join(__dirname + '/index.html'));
});
