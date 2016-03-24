var Forecast = require('forecast');
var CronJob = require('cron').CronJob;

var forecast = new Forecast({
	service: 'forecast.io',
	key: 'd11c7c57cc4586b39d2f0a287b447879',
	units: 'celcius',
	cache: true,
	ttl:{
		minutes:60
	}
});
var job = new CronJob("0 */4 * * * *",function(){
	forecast.get([1.2896700,103.8500700],true,function(err,weather){
		if(err) return console.dir(err);
		var hourly_result = weather["hourly"];
		var data = hourly_result["data"];

		console.log(hourly_result);
	},function(){
	},
	true,
	'Asia/Singapore');
});
job.start();
module.exports = CronJob;
