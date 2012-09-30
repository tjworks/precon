/** User service module */
var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("../lib/util"),
    BSON = mongo.BSONPure,
  	_ = module.parent.exports._;
  	 
exports.hello = function(data){
	return "world"
} 

/**

req spec
=========
  * connection_id:
  * user_id:
  * comments
  * type: up|down|comment
  *
*/
exports.annotate = function(req, callback){
  getCollection('connection', function(col){
      col.find({}, {limit:1}).toArray( function(err, docs){
          callback(docs);
      }  );
  });
}
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


getCollection = function(colName, callback){
  var db = new mongo.Db(config.db.name, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err,db) {
    db.authenticate(config.db.username, config.db.password, function () {     
      db.collection(colName, function(err, collection) { 
          if(err) throw err;
          callback(collection)       
          });
        });
    }); // end db.open
  
  
}
