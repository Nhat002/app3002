var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var WeatherData = mongoose.model('WeatherData');
router.get('/',function(req,res,next){
    WeatherData.find({},function(err, data){
        if(err) {next(err);}
        res.json(data);
    })
});
module.exports = router;