precon =  {}
if (typeof (console) == 'undefined') console = {log:function(){}}
precon.conf = {
	api_base: 'http://mongo.one-chart.com:3000/oc',
	prefix_mapping : {netw:'network' , ntwk:'network', enti:'entity', node:'node', conn: 'connection', publ:'publication'}
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
precon.quickSearch = function(query, callback){
	// only entity is supported for now
	if(!query) throw "Must specify query string"
	
	//qstr = escape('{_id:{$regex:/^TOKEN/}}'.replace("TOKEN", query.toLowerCase()))
	url = "/search.json?term="+ query
	console.log("searching: " + url)
	$.ajax({
		  url: url,
		  dataType: 'json',	
		  success: function(results){
			  callback(results)
		  } 
		});	
}
 
precon._ajax = function(url, callback){
	console.log("Performing ajax query: "+ unescape(url))
	$.ajax({
		  url: url,
		  dataType: 'jsonp',	
		  success: function(results){
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
	if(query.entity)
		qstr = escape('{"entities":"TOKEN"}'.replace("TOKEN",query.entity))
	else if(query.network)
		qstr = escape('{"network":"TOKEN"}'.replace("TOKEN",query.network))
	else if(query.pubmed)
		qstr = escape('{"refs.pubmed":"TOKEN"}'.replace("TOKEN",query.pubmed))
	else if(query.owner)
		qstr = escape('{"owner":"TOKEN"}'.replace("TOKEN",query.owner))
	else
		throw "No query criteria specified"
	
	url = precon.conf.api_base + "/connection?query="+ qstr
	
	precon._ajax(url,  function(results){
		// results is a list of connections
		if(!results || !results.length) callback(results)
		console.log("############  got " + results.length+" records ###########")
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
		// now get network properties
		if(ids && ids.length)
			precon.getObjects(ids, function(networks){			
				for(var n in networks){ 
					var network = networks[n]
					network._connections = nets[network._id]._connections
					network.connections = nets[network._id].connections
					precon.preload(network)
				}
				callback && callback(networks)
			})
		
	});
}

precon.preload = function(network){
	console.debug("preloading "+ network._id)
    // preload the nodes
	var ids = []
    for(var c in network._connections){
    	var conn = network._connections[c]    	
    	ids = ids.concat (conn.nodes )    	    	
    }   
	if(ids.length>0)
		precon.getObjects(ids)  // preload cache
}

/**
 * Get all connections belong to the network
 * @param network_id 
 * @return list of connection objects 
 

precon.getNetworkConnections=function(network_id, callback){
	if(!network_id) throw "network_id must be specified"
	qstr = escape('{"network":"'+ network_id+'"}')
	url = precon.conf.api_base + "/connection?query="+ qstr
	
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
*/
/**
 * Get the details of any precon object
 * 
 * @param: obj_id Object id(the _id value of the JSON object)
 * 
 * @reutrn: A JSON object contains the detailed attributes of the object, such as name, references, group/type etc.
 */
precon.getObject = function(obj_id, callback){
	if(!obj_id) throw "Obj id must be specified"
	console.log("getObject: "+ obj_id)	// 
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
	console.log("getObjects: "+ obj_ids)	// 
	
	// mapping
	if(!obj_ids[0]) return
	prefix = obj_ids[0].substring(0,4)
	model = precon.conf.prefix_mapping[prefix]
	if(!model) throw "Invalid or unsupported object id: "+ obj_ids
	
	ids= obj_ids.join('","')
	qstr = escape('{"_id":{"$in": ["TOKEN"]}}'.replace("TOKEN",ids))
	
	url = precon.conf.api_base + "/"+model+"?query="+qstr
	
	precon._ajax(url,  function(results){
		// results should be a list
		for(var r in results){
			var obj = results[r]
			precon.encache(obj)
		}
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
    		var tmp = obj[p].substring(0,4)
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