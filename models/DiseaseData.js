var mongoose = require('mongoose');

var diseasedataschema = new mongoose.Schema({
    updateTime: Number,
    diseaseContent:String,
    diseaseTitle: String,
    diseaseType:String
});

mongoose.model('DiseaseData',diseasedataschema);