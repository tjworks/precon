precon =  {}
if (typeof (console) == 'undefined') console = {log:function(){}}
precon.conf = {
	api_base: 'http://mongo.one-chart.com:3000/oc',
	prefix_mapping : {ntwk:'network', enti:'entity', node:'node', conn: 'connection'}
}



/**
 * search for an entity, for instance a gene
 * @param query: a dictionary with following fields:
 * 					- q:  MANDATORY. query string, specify the gene symbol when search for gene.
 * 					- sort: OPTIONAL. sort the result by this field, if applicable
 * 					- limit: OPTIONAL.  limit the number of results to be returned 
 * 					- type: OPTIONAL.  type of entity to search for. i.e., network, entity, people, connection etc
 * @param callback: callback function  
 * @return Callback function will be called with the result, which is an array of objects.Empty array if nothing found   
 */
precon.search = function(query, callback){
	// only entity is supported for now
	if(!query.q) throw "Must specify query string"
	query.type = query.type || 'entity'
	
	qstr = escape('{"symbol":"TOKEN"}'.replace("TOKEN", query.q.toLowerCase()))
	url = precon.conf.api_base + "/" + query.type +"?query="+ qstr
	console.log("searching: " + url)		
	precon._ajax(url, function(results){
		callback && callback(results)	  
	})
}
 
precon._ajax = function(url, callback){
	$.ajax({
		  url: url,
		  dataType: 'jsonp',	
		  success: function(results){
			  callback(results)
		  } 
		});
}
/**
 * Get a list of networks the gene or any entity is part of
 * @param query  precon ID of the entity
 * @return A list of JSON objects represents Network. Note the Network meta info will not be set other than the _id. You must use getObject() to request the details of each Network
 */
precon.getNetworks = function(entity_id, callback){	
	if(!entity_id) throw "Entity id must be specified"
	
	qstr = escape('{"entities":"TOKEN"}'.replace("TOKEN",entity_id))
	url = precon.conf.api_base + "/connection?query="+ qstr
	precon._ajax(url,  function(results){
		// results is a list of connections
		if(!results) callback(results)
		var nets = {}
		for(var r in results){
			con = results[r]
			var net = nets[con.network] || {} 
			nets[con.network] = net
			net.connections = net.connections || []
			net.connections.push(con)			
		}
		networks = []
		for(var n in nets) 
			networks.push(nets[n])
		callback(networks)
	});
}

/**
 * Get all connections belong to the network
 * @param network_id 
 * @return list of connection objects 
 */

precon.getNetworkConnections=function(network_id, callback){
	if(!network_id) throw "network_id must be specified"
	qstr = escape('{"network":"'+ network_id+'"}')
	url = precon.conf.api_base + "/connection?query="+ qstr
	
	precon._ajax(url,  function(results){
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
	console.log("getObject: "+ obj_id)	// 
	
	// mapping
	prefix = obj_id.substring(0,4)
	model = precon.conf.prefix_mapping[prefix]
	if(!model) throw "Invalid or unsupported object id: "+ obj_id		
	url = precon.conf.api_base + "/"+model+"/"+obj_id
	
	precon._ajax(url,  function(results){
		// results should be an object
		//TBD: localStorage cache
		callback && callback(results)		 
	});
}


/**
 * Get a list of references
 * 
 * @param obj_id either the edge id or node id
 * @param callback
 * 
 * @return array list of Reference object
 */
precon.getReferences = function(obj_id, callback){
	
	
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
precon.util.formatObject = function(obj, indent){
    
    indent = indent || 1;
    if(indent==5) return obj+""
    
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