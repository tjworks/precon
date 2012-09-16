/** User service module */
var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("../lib/util"),
    BSON = mongo.BSONPure,
  	_ = module.parent.exports._;
  	
var _match = function(meId, userService){
	var me = userService.get(meId);
	if(!me) return; 
	console.log("finding match for "+me.getName());
	var idles = userService.listIdle();
	if(idles.length ==0) return;
	
	/**@todo performance and algorithm */
	for(var i in idles){
		var u = userService.get(idles[i]);
		if(!u || u.getId() == meId)
			continue;
		console.log("Found "+ u.getName());
		return u;
	}
	console.log("No match");	
};
exports.hello = function(data){
	return "world"
}
exports.match = function( seeker, socket ){
	  console.log("match: statusUpdate event for user "+ seeker.id);
	  var useeker = userService.get(seeker.id);
	  if(!useeker) {
		  console.error("User no longer active: "+ seeker.id);
		  return;
	  }			  
	//console.log(arguments);
	
	if(seeker.chatStatus == userService.CallReady ){
		// find match
		var matched = _match(seeker.id, userService);
		if(matched){
			useeker.setChatStatus(userService.Calling);
			matched.setChatStatus(userService.Ringing);
			
			socket.emit('pairedUp', matched.getModel());
		}
	}
	
} ;

/**
 * Items: an array of entities to be validated
 */
exports.validate = function(items, callback){	
	console.log("Validating ", items)
	if(!items) return {} 
    for(var i=0;i<items.length;i++){
    	items[i] = items[i] ? items[i].toLowerCase(): ''
    }
	var ret = {}
	console.log("mongodb is ", config.db.name)
	var db = new mongo.Db(config.db.name, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
	db.open(function(err,db) {
		db.authenticate(config.db.username, config.db.password, function () {			
			db.collection('entity', function(err, collection) {	    	  
		    	var query = {symbol: {$in: items } }
		    	collection.find(query, {}, function(err, cursor){
	    		
		    		cursor.toArray(function(err, docs){
		    			// docs contains the exact matches
		    			docs.forEach(function(doc){
		    				ret[doc.symbol] = doc._id; //{_id: doc._id, name:doc.name}
		    			});
		    			//console.log("Return is ", ret, callback)
		                db.close();
		                callback && callback(ret)
		    		}); // end toArray
	    		
		    	}); // end .find    	  
	        });
	      });
    }); // end db.open
}; // end exports.validate