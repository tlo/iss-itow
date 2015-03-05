
var express 	= require('express');
var config 		= require('config');
var request  	= require('request');
var moment  	= require('moment');

var app = express();
var devices;

function updateDevices() {

	request(config.iTowXmlUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var now = new moment();
	  	console.log(now.format("HH:mm:ss") + ' : refreshing devices from iTow XML');
		parseItowXml(body);
	  }
	})

}

function parseItowXml(xml) {

	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
		devices =  [];

		// Temperatures
		for (i=1; i<=15; i++) {
	    	if (result.itow['ow_nom_'+i] == undefined) {
				break;
			}
			devices.push(
					{
						"id" : "itow-temp-"+i,
						"name" : config.itowProbes[i].name ? config.itowProbes[i].name : result.itow['ow_nom_'+i][0],
						"type" : "DevTemperature",
						"room" : config.itowProbes[i].room,
						"params" : [
							{
								"key" : "Value",
								"value" : result.itow['ow_temp_'+i][0],
								"unit" : "°C",
								"graphable" : true
							}
				      ]
				    }
			)
	    }

	    // Meters
		for (i=1; i<=5; i++) {
	    	if (result.itow['adco'+i] == undefined) {
				break;
			}
			devices.push(
			 	{
			      "id" : "itow-conso-"+i,
			      "name" : config.itowMeters[i].name,
			      "type" : "DevElectricity",
			      "room" : config.itowMeters[i].room,
			      "params" : [
			        {
						"key" : "Watts",
						"value" : result.itow['kwh'+i][0]*1000,
						"unit" : "W",
						"graphable" : true
					}
			      ]
			    }
		    )

		}
		

	});

}


updateDevices();
setInterval(function() {
	updateDevices();
}, config.get('refreshInterval')*1000);


app.get('/', function (req, res) {
	res.send('ISS iTow');
})

app.get('/system', function (req, res) {
	res.send(config.get('system'));
})

app.get('/rooms', function (req, res) {
	var output = {
    	rooms : config.get('rooms')
  	}
	res.send(output);
})

app.get('/devices', function (req, res) {
	var output = {
    	devices : devices
  	}
	res.send(output)
})

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('ISS iTow app listening at http://%s:%s', host, port);
})