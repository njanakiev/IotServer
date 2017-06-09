const express = require('express');
const app = new express();
const fs = require('fs');
const path = require('path');
const api = require('./routes/api');
const mongo = require('mongodb');
const monk = require('monk');
const db =  monk('localhost:27017/mongodb_app');

const UDP_PORT = 4000;
const UDP_HOST = '0.0.0.0'; // local network
const dgram = require('dgram');
const server = dgram.createSocket('udp4');


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

app.use('/api', api);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);