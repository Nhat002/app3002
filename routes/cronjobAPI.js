var Forecast = require('forecast');
var CronJob = require('cron').CronJob;
var Promise = require('promise');
var mongoose = require('mongoose');
var weatherData = mongoose.model('WeatherData');
var forecast = new Forecast({
	service: 'forecast.io',
	key: 'd11c7c57cc4586b39d2f0a287b447879',
	units: 'celcius',
	cache: true,
	ttl:{
		minutes:60
	}
});
function processDataTask(weather,dataProcessed){
	return processWeatherData(weather,dataProcessed).then(function(res){
		console.log(dataProcessed);
		weatherData.remove({}, function(err,docs){
			if(err){
				console.log(err);
				next(err);
			}
			weatherData.insertMany(dataProcessed,function(err,docs){
				if(err){
					console.log(err);
					next(err);
				}
			});
		});
		return res;
	})
}
function processWeatherData(weather,dataProcessed){
	return new Promise(function(fulfill,reject){
			var time = new Date().getTime();
			var hourly_result = weather["hourly"];
			var data = hourly_result["data"];
			for(var i = 0 ; i < 10; ++i){
				var el = new Object();
				var obj = data[i];
				el["updateTime"] = time;
				el["weatherType"] = obj["summary"];
				el["weatherTime"]= obj["time"];
				dataProcessed.push(el);
			}

		try{
			fulfill(dataProcessed);
		}
		catch(ex){
			reject(ex);
		}

	})
}

var weather_job = new CronJob("0 */3 * * * *",function(){
		console.log("start cron\n");
		forecast.get([1.2896700,103.8500700],true,function(err,weather) {
			if (err) return console.dir(err);
			var dataProcessed = [];
			processDataTask(weather,dataProcessed);


		});
	},function(){
	},
	true,
	'Asia/Singapore');
weather_job.start();
module.exports = CronJob;
