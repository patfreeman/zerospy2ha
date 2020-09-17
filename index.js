// What port will this webhook listen on
const serverPort = 8080;
// Static config for Home Assistant
const options = {
		// Where is Home Assistant
		hostname: 'homeassistant.server.name',
		port: '443',
		// What entity are we updating
		path: '/api/states/sensor.zero_battery',
		// The authorization token generate in Home Assistant -> Profile -> Long-Lived Access Tokens
		headers: { 'Authorization': 'Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
		method: 'POST',
};

const http = require('http')
const https = require('https')
const { URL, URLSearchParams } = require('url')

http.createServer(function (req, res) {
	// Grab the state of charge from the incoming request's parameters
	var url = new URL(req.headers.host + req.url);
	var soc = new URLSearchParams(url.search).get('soc');
	if ( Number(soc) ) {
		// Make the JSON Home Assistant expects
		var postData = { "state": soc };
		// Make the request
		var req = https.request( options, (r) => {
			console.log('statusCode: ', r.statusCode);
			r.on('data', (d) => {
				console.log('Home Assistant Response Body: ', d.toString());
			});
		});
		req.on('error', (e) => {
			console.error(e);
		});
		// Send the SOC in the request payload
		req.write(JSON.stringify(postData));
		req.end();
		// Respond to ZeroSpy
		res.write('Request sent on to Home Assistant\n');
	} else {
		res.write('Rejected\n');
	}
	res.end();
}).listen(serverPort)
