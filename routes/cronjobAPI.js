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
var job = new CronJob("00 00 04 * * *",function(){
		forecast.get([1.2896700,103.8500700],true,function(err,weather){
			if(err) return console.dir(err);
			var hourly_result = weather["hourly"];
	},function(){
	},
	true,
	'Asia/Singapore'
);
