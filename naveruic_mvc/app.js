
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var ajax = require('./router/ajax');
var main = require('./router/main');

app.listen(8000, function(){
	console.log("start! express server on port 8000");
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use('/ajax', ajax);
app.use('/main', main);
//url routing

app.get('/', function(req,res){
	res.sendFile(__dirname + "/public/main.html");
});



