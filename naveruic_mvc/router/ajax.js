var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

//DATABASE SETTING
var connection = mysql.createConnection({
	host: '192.168.56.101',
	port: 3306,
	user: 'test',
	password: 'pw1234',
	database: 'ddolmatdb' 
});

connection.connect();

//Router !!

router.post('/', function(req, res){
	console.log("ajax ON");
	var responseData = [];

	var query = connection.query('SELECT * FROM NEWS', function(err, rows){
		if(err) throw err;
		if(rows){
			rows.forEach(function(v){
				var temp = {
					title : v.title,
					imgurl : v.imgurl,
					newslist : JSON.parse(v.newslist)
				};
				responseData.push(temp);
				console.log(temp);
			});
		}else{
			responseData.push("none");
		}
		res.json(responseData);
	});
});

module.exports = router;