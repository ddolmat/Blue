var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

//DATABASE SETTING
var connection = mysql.createConnection({
	host: ,
	port: 3306,
	user: ,
	password: ,
	database: 
});

connection.connect();

//Router !!
router.get('/', function(req, res){
	console.log("ajax GET");
	var responseData = [];

	var query = connection.query('SELECT * FROM NEWS', function(err, rows){
		if(err) throw err;
		if(rows){
			rows.forEach(function(v){
				var temp = {
					title : v.title,
					imgurl : v.imgurl,
					newslist : JSON.parse(v.newslist),
					subsOn: v.subsOn
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

router.post('/', function(req, res){
	console.log("ajax POST");
	var title = req.body.title;
	console.log(title);
	var flag = req.body.flag;
	console.log(flag);
	var responseData = [];
	
	var query = connection.query('UPDATE NEWS SET subsOn='+flag+'WHERE title="'+title+'"', function(err, rows){
		if(err) throw err;
	});

	var query2 = connection.query('SELECT * FROM NEWS', function(err, rows){
		if(err) throw err;
		if(rows){
			rows.forEach(function(v){
				var temp = {
					title : v.title,
					imgurl : v.imgurl,
					newslist : JSON.parse(v.newslist),
					subsOn: v.subsOn
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
