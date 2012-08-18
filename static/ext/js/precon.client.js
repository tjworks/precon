precon =  {}
if (typeof (console) == 'undefined') console = {log:function(){}}
precon.conf = {
	max_objects_per_request:500,
	api_base: 'http://one-chart.com:3000/oc',
	prefix_mapping : {netw:'network' , ntwk:'network', enti:'entity', node:'node', conn: 'connection', publ:'publication',peop:'people'}
}

precon.getObjectType = function(objid){
	if(!objid) return ''
	var prefix = objid.substring(0,4);
	var model = precon.conf.prefix_mapping[prefix]
	if(!model) throw "Unrecognized ID format: "+ objid
	return model
}
var getId = function(obj){ 
	if(_.isObject(obj))
		return obj.get?obj.get('id') : (obj.id ? obj.id : obj._id )
	else
		return obj
};

/**
 * Create a random id
 * @type: one of: network, connection, node, entity, etc
 */
precon.randomId = function(type){
	var prefix = type.substring(0,4).toLowerCase();
	if(!precon.conf.prefix_mapping[prefix])
		throw "Unsupported type: "+type
	return prefix+  (new Date().getTime()) +'' +  Math.round( Math.random( ) * 10000 )
}
/**
 * Search by keywords, such as pubmed id, gene symbol/name, network name or people's name
 * 
 * Results is a list of potential matches, with a mximum of 20. Each potential match is an object. For example, if you search for 'AMP', you will get:
 * 		[
 * 			{label:"Research about AMPK", value:"publ320394726"},   // matched a publication with id: publ320394726
 * 			{label:"AMPK", value:"enti_up_P20394"}, // matched an entity with id enti_up_P20394
 *          ...
 *       ]
 * 
 */
precon.quickSearch = function(query, callback, filter){
	// only entity is supported for now
	if(!query) throw "Must specify query string"
	
	//qstr = escape('{_id:{$regex:/^TOKEN/}}'.replace("TOKEN", query.toLowerCase()))
	url = "/search.json?term="+ query
	if(filter) url+="&filter="+filter
	var timer = new Timer("ajax "+ url)
	$.ajax({
		  url: url,
		  dataType: 'json',	
		  cacheJStorage: true,
		  cacheTTL: 60,
		  success: function(results){
			  timer.elapsed()
			  callback(results)
		  } 
		});	
}
 
precon._ajax = function(url, callback){
	//console.log("Performing ajax query: "+ unescape(url))
	var timer = new Timer("ajax " + url)
	if($.jStorage.get(url)){
		timer.elapsed()
		callback(JSON.parse( $.jStorage.get(url)) )
		return
	}	
	$.ajax({
		  url: url,
		  dataType: 'jsonp',
		  success: function(results){
			  timer.elapsed()
			  $.jStorage.set(url, JSON.stringify(results))
			  callback(results)
		  } 
		});	
}
/**
 * Get a list of networks matching specified query
 * @param query  a dict contain the criteria, such as entity, network, pubmed etc. Value must be precon ID. For example:
 *  
 * 					precon.getNetworks( { entity: enti_up_203947 }, callback)
 * 					precon.getNetworks( { network: netw_238887 }, callback)
 * 
 * 
 * 					
 * @return A list of JSON objects represents Network. Note the actually connection objects will be stored in _connections property and the connections property only has the IDs. 
 *   	   In addition, the nodes property for each connection contains the IDs only. You need to call getObject(node_id) to get the details about the node
 */
precon.searchNetworks = function(query, callback){
	qstr = ''
	if(!query) throw "No query criteria specified"
	if(typeof(query) == 'string'){
		var prefix = query.substring(0,4);
		var model = precon.conf.prefix_mapping[prefix]
		if(!model) throw "ID format is not supported: "+ query
		var obj = {}
		obj[model] = query
		query = obj 
	}
	if(query.entity)
		qstr = escape('{"entities":"TOKEN"}'.replace("TOKEN",query.entity))
	else if(query.network)
		qstr = escape('{"network":"TOKEN"}'.replace("TOKEN",query.network))
	else if(query.publication)
		qstr = escape('{"refs.pubmed":"TOKEN"}'.replace("TOKEN",query.publication.substring(4)))
	else if(query.people)
		qstr = escape('{"owner":"TOKEN"}'.replace("TOKEN",query.people))
	else{
		console.log("Invalid query:", query)
		throw "Not a valid query specification: "+ query
	}
	query.limit = query.limit || precon.conf.max_objects_per_request;  // maximum 
	
	qstr+="&limit="+ query.limit
	
	if(query.skip) qstr+="&skip="+query.skip
		
	precon.loadConnections(qstr, function(results){
		// results is a list of connections
		if(!results || !results.length) callback(results)
		
		var nets = {}
		var ids = []
		for(var r in results){
			con = results[r]
			if( ids.indexOf(con.network )<0)
				ids.push(con.network)
			var net = nets[con.network] || {} 
			nets[con.network] = net	
			net.connections = net.connections || []  // ids
			net._connections = net._connections || []
			net._connections.push(con)
			net.connections.push(con._id)
			net._id = con.network
		}
		//for(var n in nets)  precon.preload(nets[n])
		if(ids.length == 0  && query.network){
			ids.push(query.network)
			nets[query.network] = {}
		}
			
		if(ids.length>0){
			precon.getObjects(ids, function(networks){
				var network=null
				for(var n in networks){ 
					network = networks[n]
					network._connections = nets[network._id]._connections || []
					network.connections = network.connections || []
					network.connections = network.connections.concat( nets[network._id].connections || [] )					
					network.isComplete = false
					precon.encache(network)
					networks[n] = new precon.Network(network)
				}
				
				if(ids.length == 1 ){
					// this is special case for networks created later which has embedded connection ids, however in the future all network search should start from network
					var unloadedConnections = network.connections
					network._connections.forEach(function(conObj){
						 var cid = getId(conObj)
						 if(_.indexOf(unloadedConnections, cid)>=0)
							 unloadedConnections = _.without(unloadedConnections, cid)
					})
					if(unloadedConnections.length>0){
						var cons = unloadedConnections.join('","')
						cons = '"'+  cons+ '"'					
						qstr = '{"_id":{"$in":[TOKEN]}}'.replace("TOKEN", cons)
						//console.log("Qstr", qstr)
						var qstr = escape(qstr )
						precon.loadConnections(qstr, function(results){
							networks[0].getRawdata()._connections= networks[0].getRawdata()._connections.concat(results)						
							if(callback){ 
								callback(networks)								
							}
						});
					} // end unloaded
					else
						callback && callback(networks)
				}				
				else
					callback && callback(networks)
			})
		}				
	});
}
precon.loadConnections = function(qstr, callback){
	console.log("loadConnections:" ,unescape(qstr))
	url = precon.conf.api_base + "/connection?query="+ qstr
	precon._ajax(url,  function(results){		 
		console.log("###### loadConnections got " + results.length+" records ###########")
		callback && callback(results)
	});
}
precon.preload = function(network){
	console.log("preloading "+ network._id)
    // preload the nodes
	var ids = []
    for(var c in network._connections){
    	var conn = network._connections[c]    	
    	ids = ids.concat (conn.nodes )    	    	
    }   
	if(ids.length>0) precon.getObjects(ids)  // preload cache
}

/**
 * Get all connections belong to the network
 * @param network_id 
 * @return list of connection objects 
 
*/
precon.loadNetwork=function(network_id, callback){
	if(!network_id) throw "network_id must be specified"
	qstr = escape('{"network":"'+ network_id+'"}')
	url = precon.conf.api_base + "/connection?query="+ qstr
	
	precon.getObject(network_id, function(network){			
		// now get connections	
		qstr = escape('{"network":"TOKEN"}'.replace("TOKEN",query.network))
			precon.encache(network)
		
		callback && callback(networks)
	})
	
	precon._ajax(url,  function(results){
		// now we have a list of connections, next we get all the nodes & entities
		
		// Temporary hack, prepare a connection object
		for (var c in results){
			 var con = results[c];
			 var nids = con.nodes;
			 con.nodes = []
			 var entity_ids = con.entities;
			 for(var i =0;nids && i<nids.length;i++){
				var node ={}
				node._id = nids[i];
				node.entity = entity_ids[i]
				if(node.entity)
					node.label = node.entity.substring(8)
				else
					node.label = node._id.replace(/^.*_(\d+)$/, "$1")
				con.nodes[i] = node
			 }			 
		}
		callback && callback(results)		 
	});
}

/**
 * Get the details of any precon object
 * 
 * @param: obj_id Object id(the _id value of the JSON object)
 * 
 * @reutrn: A JSON object contains the detailed attributes of the object, such as name, references, group/type etc.
 */
precon.getObject = function(obj_id, callback){
	if(!obj_id) throw "Obj id must be specified"
	//console.log("getObject: "+ obj_id)	// 
	obj_id = obj_id.trim()
	//TBD: use localStorage cache instead so it can persist
	if(obj_id in precon.cache) {
		console.log("Cache hit: "+ obj_id)
		callback && callback( precon.cache[obj_id] )
		return
	}	
	// mapping
	prefix = obj_id.substring(0,4)
	model = precon.conf.prefix_mapping[prefix]
	if(!model) throw "Invalid or unsupported object id: "+ obj_id		
	url = precon.conf.api_base + "/"+model+"/"+obj_id
	
	precon._ajax(url,  function(results){
		// results should be an object
		precon.encache( results )
		callback && callback(results)		 
	});
}

precon.encache=function(obj){
	precon.cache[obj._id] = obj
}
precon.cache = {}

/**
 * Get list of objects
 * 
 * @param: obj_ids array of Object id(the _id value of the JSON object)
 * 
 * @reutrn: A list of JSON objects contains the detailed attributes of the object
 */
precon.getObjects = function(obj_ids, callback){
	if(!obj_ids || obj_ids.length == 0 ) throw "An array of Obj ids must be specified"
	//console.log("getObjects: "+ obj_ids)	// 
	
	// mapping
	if(!obj_ids[0]) return
	prefix = obj_ids[0].substring(0,4)
	model = precon.conf.prefix_mapping[prefix]
	if(!model) throw "Invalid or unsupported object id: "+ obj_ids
	
	var hits = []
	var misses = []
	obj_ids.forEach(function(id){
		if(id in precon.cache) hits.push(id)
		else misses.push(id)
	})
	if(misses.length == 0){
		results = []
		hits.forEach(function(id){
			results.push( precon.cache[id] )
		})
		callback && callback(results);
		return;
	}
	ids= misses.join('","')
	qstr = escape('{"_id":{"$in": ["TOKEN"]}}'.replace("TOKEN",ids))
	
	url = precon.conf.api_base + "/"+model+"?query="+qstr
	
	precon._ajax(url,  function(results){
		// results should be a list
		for(var r in results){
			var obj = results[r]
			precon.encache(obj)
		}
		hits.forEach(function(id){
			results.push( precon.cache[id] )
		})
		callback && callback(results)		 
	});
}


/**
 * Get a list of valid connection types
 * 
 * @return an array of Association object
 */
precon.getAllAssociations=function(callback){
	url = precon.conf.api_base + "/association"	
	precon._ajax(url,  function(results){	 
		callback && callback(results)
	});
}

/**
 * Get a list of references
 * 
 * @param obj_id connection id
 * @param callback
 * 
 * @return array list of Reference object
 */
precon.getPubmedReferences = function(obj_id, callback){
	
	
}


/**
 * 
 */
precon.annotate= function(obj, annotator_id, comments){
	
	
}
precon.flushCache = function(){
	$.jStorage && $.jStorage.flush()
	console.log("Flushed jstorage cache")
}


/**
 * List objects matching search criteria
 * 
 * Result is an object with all the properties (converted from JSON)
 */
precon.findObject = function(search, callback){
	
}

precon.util = {}
precon.util.truncate = function(str, length){
	length = length || 12
	if(str.length<length) return str
	return str.substring(0,length)+"..."	
}
precon.util.formatObject = function(obj, indent){
    
    indent = indent || 1;
    if(indent==8) return obj+""
    
    var space = indent * 15
    
    var h='<div>';
    if(obj && obj.length)
    	h+="["
    else
    	h+="{"
    var str=""
    for(var p in obj){
    	str+='<div style="margin-left:'+ (space)+'px">';
    	str+="<font color=green><b>"+ p+"</b></font>: "
    	if(typeof obj[p] == 'string' || typeof obj[p] == 'number'){
    		var tmp = obj[p];
    		tmp = typeof(tmp) == 'string'? tmp.substring(0,4): tmp
    		if(p == '_id' || (obj.length && tmp in precon.conf.prefix_mapping ))
    			str+=  "<a href='#' onclick='showObj(\"" +obj[p]+"\")' style='color:blue'>"+ obj[p]+"</a>";
    		else
    			str+=  obj[p];
        }else{
            str+=  precon.util.formatObject(obj[p], indent+1)
        }
    	str+="</div>"
    }
    if(obj && obj.length)
    	str+="]"
    else
    	str+="}"
    return h+ str + "</div>";
}
precon.util.shortTitle=function(title, max){
	max = max || 20
	return title? title.substring(0, max) +"..." : title// TBD: smarter
}
precon.event = {
	ViewportCreated:'ViewPortCreated',
	UserLogin:'UserLogin'
}
/**

 

Network.fromEdges = function(db_edges){
	nodes = []
	edges= []
	nodesMap = {}
	edgesMap = {}
	
	for(i in db_edges){
		dbedge = db_edges[i]
		
		edge = {}
		edge.id = dbedge._id
		edge.source = dbedge.source
		edge.target = dbedge.target
		
		nd = {}
		nd.id = edge.source
		nodesMap[nd.id] = nd
		nd = {}
		nd.id = edge.target
		nodesMap[nd.id] = nd
		
		edgesMap[edge.id] = edge
	}	
	for (i in nodesMap)
		nodes.push(nodesMap[i])
	for (i in edgesMap)
		edges.push(edgesMap[i])
	return new Network(nodes, edges)
}


function searchEdges(node, level, result, callback){	
	baseurl = "http://one-chart.com:3000/oc/edge"
	query = '{"$or": [{"source":"TOKEN"}, {"target":"TOKEN"}]}'
	url = baseurl + "?query="+ escape( query.replace("TOKEN", node.toUpperCase()) )
	console.log("Calling search edge with: "+node+", level: "+level+"")
	if(! result.cnt) 
		result.cnt =1
	else
		result.cnt +=1
		
	$.ajax({
	  url: url,
	  dataType: 'jsonp',	
	  success: function(edges){
		  console.log("Got edges ")
		  console.log(edges)
		  console.log("cnt was "+ result.cnt+", level is "+ level)
		  
		  for(i =0;edges && edges.length>i;i++){
			  edge = edges[i]
			  if(!result.edges) result.edges = []
			  if(result.edges.indexOf(edge)<0)
				  result.edges.push(edge)
			  if(level>0) {
				  console.log("Recursively search level "+(level-1) )				  				  
				  searchEdges(edge.source, level-1, result, callback)
				  searchEdges(edge.target, level-1, result, callback)
		  	  }			  
		  }
		  result.cnt -=1
		  if(result.cnt == 0){
			  console.log("Calling back with result "+ result)  
			  callback(result.edges)
		  }
	  } 
	});
}
 
 

$(function(){

	$("#btn_search").click(function(){
		g = $("#gene_name").attr("value")
		if(!g){
			alert("Enter gene name and try again. Example: P4HB")
			return
		}
		Network.search(g, function(network){
			if(network && network.nodes && network.nodes.length>0)
				drawModel(network)
			else
				alert("Did not find any data")
		})
	})
	
})

 
     */


/**
 * 
 *  Ignore this
 *  Standard JSON response for returning one object
	{
		"data": {}
		"error": "",
		"total": 1,
		"offset" 0
	}
	
 *  Standard JSON response for returning more than one item
	{
		"data": [  {}, {} ],
		"error": "",
		"total": 2,
		"offset" 0
	}	
 * 
 * 
 */