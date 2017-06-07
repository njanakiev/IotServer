var mongo = require('mongodb');
var express = require('express');
var monk = require('monk');
var db =  monk('localhost:27017/mongodb_app');
var app = new express();
var fs = require('fs');

var UDP_PORT = 5000;
var UDP_HOST = '0.0.0.0'; // local network
var dgram = require('dgram');
var server = dgram.createSocket('udp4');


// UDP Server
server.on('listening', function() {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', function(message, remote) {
	console.log(remote.address + ":" + remote.port + ' - ' + message);
	try{
		json = JSON.parse(message);
		//console.log(json.timestamp);
		if(json.hasOwnProperty('type') && 
		   json.hasOwnProperty('timestamp') && 
		   json.hasOwnProperty('values')){
			data = db.get('data');
			data.insert(json, function(err, doc){
				if (err) console.log('Error : ' + err);
			});
		} else {
			console.log('JSON format not supported');
			console.log(remote.address + ":" + remote.port + ' - ' + message);
		}
	} catch(e) {
		console.log('Error : ' + e);
		console.log(remote.address + ":" + remote.port + ' - ' + message);
	}
});
server.bind(UDP_PORT, UDP_HOST);


// REST API
app.get('/api', function(req,res){
  db.driver.collectionNames(function(e, names){
  	console.log('app.get(\'/api\') called');
    res.json(names);
  })
});

app.get('/api/:name', function(req,res){
  console.log('app.get(\'/api/:name\') called with ' + req.params.name);
  
  var collection = db.get(req.params.name);
  var setting = {sort : {timestamp : -1}};
  
  collection.find({}, setting, function(e,docs){
  	if(e) console.log('Error : ' + e);
    res.json(docs);
  })
});

app.get('/api/:name/:type', function(req,res){
  //console.log('app.get(\'/api/:name\') called with ' + 
  //	req.params.name + '/' + req.params.type + 
  //	' and query : ' + req.query);
  
  // TODO: select device id from query
  var elements = parseInt(req.query.elements);
  if(!isNaN(elements)){
  	var setting = {sort : {timestamp : -1}, limit : elements};
  	//console.log("Elements : " + elements);
  }else{
  	var setting = {sort : {timestamp : -1}};
  }

  var collection = db.get(req.params.name);
  var query = {'type' : req.params.type};
  
  collection.find(query, setting, function(e, docs){
    if(e) console.log('Error : ' + e);
    res.json(docs);
  })
});


// Frontend
// Load static files
function serveStaticFile(res, path, contentType, responseCode) {
	if(!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function(err, data) {
		if(err) {
			console.error(err.stack);
			res.type('text/plain');
			res.status(500);
			res.render('500');
		} else {
			res.type(contentType);
			res.send(data);
		}
	});
}

app.get('/canvas', function(req, res){
	console.log('Loading canvas_index.html');
	serveStaticFile(res, '/public/canvas_index.html', 'text/html');
});
app.get('/d3', function(req, res){
	console.log('Loading d3_index.html');
	serveStaticFile(res, '/public/d3_index.html', 'text/html');
});
app.get('/', function(req, res){
	console.log('Loading index.html');
	serveStaticFile(res, '/public/index.html', 'text/html');
});
app.get('/js/script.js', function(req, res){
	console.log('Loading script.js');
	serveStaticFile(res, '/public/js/script.js', 'text/javascript');
});
app.get('/js/canvas_script.js', function(req, res){
	console.log('Loading script.js');
	serveStaticFile(res, '/public/js/canvas_script.js', 'text/javascript');
});
app.get('/js/d3_script.js', function(req, res){
	console.log('Loading script.js');
	serveStaticFile(res, '/public/js/d3_script.js', 'text/javascript');
});


app.listen(3000);