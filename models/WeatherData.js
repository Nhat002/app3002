var mongoose = require('mongoose');

var weatherdataSchema = new mongoose.Schema({
    updateTime: Number,
    weatherType: String,
    weatherTime: Number
});
mongoose.model('WeatherData',weatherdataSchema);