var Forecast = require('forecast');
var CronJob = require('cron').CronJob;
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');
var mongoose = require('mongoose');
var weatherData = mongoose.model('WeatherData');
var diseaseData = mongoose.model('DiseaseData');


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

var weather_job = new CronJob("0 */10 * * * *",function(){
		console.log("start load forecast data\n");
		forecast.get([1.2896700,103.8500700],true,function(err,weather) {
			if (err) return console.dir(err);
			var dataProcessed = [];
			processDataTask(weather,dataProcessed);


		});
	},function(){
	},
	true,
	'Asia/Singapore');

var dengueJob = new CronJob("0 */10 * * * *",function(){
	request('http://www.dengue.gov.sg',function(err, res, html){
		if(!err && res.statusCode == 200){
			var dailyCase = new Object();
			var cumulativeCase = new Object();
			var time = new Date().getTime();
			var $ = cheerio.load(html);
			$('#month-space-multi').each(function(i,element){
				if(i==0){
					dailyCase["updateTime"] = time;
					dailyCase["diseaseType"] = "dengue";
					dailyCase["diseaseTitle"] = $(this).text().toString().trim();
					dailyCase["diseaseContent"] = $(this).parent().parent().next().find('div').find('font').find('b').text() + " cases";

				}
				else if(i==1){
					cumulativeCase["updateTime"] = time;
					cumulativeCase["diseaseType"] ="dengue";
					cumulativeCase["diseaseTitle"] = $(this).text().toString().trim();
					cumulativeCase["diseaseContent"] = $(this).parent().parent().next().find('div').find('div').find('font').find('b').text() + " cases";
				}

			});
			diseaseData.remove({},function(err,docs) {
				if(err){next(err);}
				diseaseData.create(dailyCase, function (err, doc) {
					if (err) {
						next(err);
					}
					diseaseData.create(cumulativeCase, function (err, doc) {
						if (err) {
							next(err);
						}
					})
				});
			});

		}
	});
});
dengueJob.start();
weather_job.start();
module.exports = CronJob;
