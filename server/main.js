var server = require('ws').Server;
var websocket = require('websocket-stream');
var wss = new server({port: 5001});
wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log("Received: "+message);
  		ws.send("data-11012018/results");
	});

	ws.on('close', function() {
		console.log("I lost a client");
	});


	console.log("one more client connected");
});
