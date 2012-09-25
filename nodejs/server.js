/* 
    server.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
		This file is part of mongodb-rest.
*/ 

var fs = require("fs"),
		sys = require("sys"),
		express = require('express');
	
var config = { 
	"db": {
			'port': 27017,
			'host': "one-chart.com",
			'name':'oc'
		},
	'server': {
		'port': 3000,
		'address': "0.0.0.0"
	},
	'flavor': "regular",
	'debug': true
};

var app = module.exports.app = express.createServer();
var io = require('socket.io').listen(app);
var _ = require('underscore')

try {
  //config = JSON.parse(fs.readFileSync(process.cwd()+"/config.json"));
} catch(e) {
  // ignore
}

module.exports.config = config;

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(process.cwd() + '/public'));
    app.use(express.logger());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('jsonp callback', 'callback');
	
	if (config.accessControl){
		var accesscontrol = require('./lib/accesscontrol');
		app.use(accesscontrol.handle);
	}	
});
app.enable("jsonp callback")
require('./lib/main');
require('./lib/command');
require('./lib/rest');

entityService = require('./service/EntityService.js');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config.server.port, config.server.address);
}


io.set('log level',0);

/**
io.configure(function (){
	  io.set('authorization', function (handshakeData, callback) {
		  console.log("authenticating client ", handshakeData.query, handshakeData.address);		  
		  if(handshakeData.query.uid && userService.get(handshakeData.query.uid)){ 
			  console.log("success!")
			  handshakeData.uid =handshakeData.query.uid; 			  
			  callback(null, true); // error first callback style
		  }
		  else{
			  console.log("failed!");
			  callback('Missing userid in handshake query. Append uid in the connect string. i.e., http://host/?uid=xxx', false);
		  }			    
	  });
});
*/

io.sockets.on('connection', function (socket) {
	console.log("connection for uid "+ socket.handshake.uid+" established, setting up listeners");

	socket.emit('news', { hello: 'world' });

	//var user = userService.get(socket.handshake.uid);
	//socket.user = user;
	/**
	user.removeAllListeners('statusUpdated');
	user.on('statusUpdated', function(u){
		 matcher.match(u, socket);
		 // @todo: broadcast to admin user only
		 socket.broadcast.emit('statusUpdated', u);
	});
	*/

	  console.log("entity service " + entityService)
	  socket.on('invoke', function(args, clientCallback){
		  console.log("\n=============== Client invocation  ===============")
		  console.log(args);				   
		  /**@todo: move to separate module*/		  
		  try{
			  if(!args.fn) throw "Function name not specified";
			  var fname = eval( args.fn );
			  fname(args.arg, clientCallback);
			  //console.log("===== Client invocation result: ")			  
			  //clientCallback(ret);
		  }
		  catch(err){
			  //doError(clientCallback, err);
			  console.error("===== Client invocation error: ", err)
			  clientCallback({error: err+""});
		  }
	  });

	    
	  /**@todo: limit client by IP, only debug */
	  socket.on('evil', function(args, clientCallback){
		  console.log("evil:"+ args.stmt)
		    
		  /**@todo: move to separate module*/
		  try{
			  clientCallback(eval(args.stmt));
		  }
		  catch(err){
			  //doError(clientCallback, err);
			  clientCallback({error: err+""});
		  }
	  });
});
