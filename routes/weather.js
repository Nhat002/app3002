var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherData = require('./models/WeatherData.js');
router.get('/',function(req,res,next){
    if(err) {next(err);}
    WeatherData.find({},function(err, data){
        res.json(data);
    })
});
module.exports = router;