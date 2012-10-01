/** User service module */
var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("../lib/util"),
    myutil = require("../lib/myutil"),
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
  if(!req.connection_id) throw  "Invalid request: missing connection id";
  if(!req.user_id) throw  "Invalid request: missing user_id";
  if(!req.comments) throw  "Invalid request: missing comments";
  var type=  req.type || 'commentonly' 
  
  var vote = {comments: req.comments, user_id:req.user_id, type:type, update_time: myutil.formate_date() };
  getCollection('connection', function(col){
      var cursor = col.findOne({_id: req.connection_id}, function(err, item){
          console.log('got link', item)
          var votes = item.votes || []
          for(var i=0;i<votes.length;i++){
            var v = votes[i];
            if(!v) continue;
            if(v.user_id == req.user_id && type!='commentonly'){
              callback( myutil.exception('Double vote not allowed')  )
              return;
            }
          }
          col.update({_id:req.connection_id}, {$push: {votes: vote  }}, {safe:true}, function(err, result){
              if(err) callback(new Exception(err));
              callback("OK");
          } );
      });
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
