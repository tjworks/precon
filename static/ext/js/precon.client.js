
precon = window.precon || {}

/**
 * Used for demo purpose
 * 
 * @return Sample Network object
 */
precon.getSampleNetwork = function(){	
	
	return new precon.Network()
}

/**
 * Search by gene name
 * @subject: symbol
 * @depth: how many level of relationships will be returned
 * @callback: callback function when data is ready
 * 
 * @return: Network object if found
 * 
 * Upon data ready, callback function will be called with:
 *    callback(network)
 * Or 
 *    callback(null)
 */
precon.getNetwork=function(symbol, depth, callback){
	
	depth = depth || 1;
	searchEdges(symbol, depth,{}, function(data){
		console.log("Got edge data: " +data)
		mydata = data
		//network =  Network.fromEdges(data) 
		//console.log(network)
		//mycallback( network)
		
		callback && callback(new precon.Network())
	})
	
	
}

/**
 * get a list of connections for the node
 * @param node_id
 * @param callback
 * 
 * @return array list of Edge object
 */
precon.getConnections = function(node_id, callback){
	
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
 * Get the details of an entity, can be gene, disease, article, user, relationship, or network
 * 
 * Result is an object with all the properties (converted from JSON)
 */
precon.getObject = function(obj_id, callback){
	
}

/**
 * List objects matching search criteria
 * 
 * Result is an object with all the properties (converted from JSON)
 */
precon.findObject = function(search, callback){
	
}




 

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

 
     
