const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db =  monk('localhost:27017/mongodb_app');


router.get('/', function(req,res){
  db.driver.collectionNames(function(e, names){
  	console.log('app.get(\'/api\') called');
    res.json(names);
  })
});

router.get('/:name', function(req,res){
  console.log('app.get(\'/api/:name\') called with ' + req.params.name);
  
  var collection = db.get(req.params.name);
  var setting = {sort : {timestamp : -1}};
  
  collection.find({}, setting, function(e,docs){
  	if(e) console.log('Error : ' + e);
    res.json(docs);
  })
});

router.get('/:name/:type', function(req,res){
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

module.exports = router;