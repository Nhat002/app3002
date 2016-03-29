var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DiseaseData = mongoose.model('DiseaseData');
router.get('/',function(req,res,next){
    DiseaseData.find({},function(err, data){
        if(err) {next(err);}
        res.json(data);
    })
});
module.exports = router;