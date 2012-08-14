 var raw = 'source,target\nTJ,MX\nTJ,Mona\nMona,TJ\nSunny, TJ \n Sunny,Oscar\nOscar,XD\n ';
//var raw = 'ABCA8	MEOX2						,ABCA8	CAV1		';


var Default_Node_Schema = [  { name: "_id", type: "string" },
                             { name: "label", type: "string" }, 
                             { name: "color", type: "string" },
                             { name: "color", type:"number", defValue:0 },
                             { name: "shape", type:"string", defValue:'ROUNDRECT' },
                             { name:'weight', type:"number"}];

var Default_Edge_Schema = [  { name: "_id", type: "string" },
                             { name: "label", type: "string" },
					         { name: "bar", type: "string" },
					         { name: "directed", type: "boolean", defValue: true} ,
					         { name: "color", type:"number", defValue:0 },
					         { name: "style", type:"string", defValue:'SOLID' },
					         { name: "width", type:"number", defValue:1 }
					         
					        ];
var Network = function(nodes,edges, nodeSchema, edgeSchema){
	
	this.ns = nodeSchema || Default_Node_Schema;
	this.es = edgeSchema || Default_Edge_Schema;
	this.nodes = nodes;
	this.edges = edges;
} 
Network.prototype.getModel = function(){
	return {
		dataSchema: { 
			nodes: this.ns, 
			edges: this.es
		},
		data: {
			nodes:this.nodes,
			edges:this.edges
		}
	}	
}

Network.import = function(rawdata){
	
	var entries = rawdata.split(/[\r\n]+/);
	var edges =[],  nodes = [], tally = '', count = 20;
	if(!entries || entries.length == 0 )
		throw "Empty file detected";			
	var flag = '', inNodeSection = false, inEdgeSection = false, line = 0;
	
	var nodesText = edgesText = '';
	var inNodeSection=inEdgeSection = false;
	for(var i =0; i< entries.length; i++){
		var line = entries[i] || "";				
		line = line.trim();
		if(line.length  == 0 || line.indexOf('#') == 0) continue;
		
		if(line.indexOf('id,') == 0){
			nodeSectionStart = i;
			inNodeSection = true;
			inEdgeSection = false;			
		}
		else if(line.indexOf('source') == 0){			
			edgeSectionStart = i;
			inNodeSection = false;
			inEdgeSection = true;			
		}		
		if(inNodeSection)	nodesText+= line +"\n";
		if(inEdgeSection)	edgesText+= line +"\n";
	}
	
	var nodeLines = parseCSV(nodesText);
	var edgeLines = parseCSV(edgesText);
	
	if(!edgeLines || edgeLines.length == 0 ) throw "Invalid data, no edge definition found"
	console.log("Parsed input file")
	console.log(nodeLines, edgeLines)
	
	 nodesMap = {};
	var edgesMap = {};
	
	// validate
	warning = ''
	// 1) length must agree
	var headers = nodeLines[0];
	if(nodeLines && nodeLines.length>1  &&  $.inArray('id', headers) == -1) throw "id header column is missing"
	for(var i=1; nodeLines && i<nodeLines.length;i++){
		
		var tuple = nodeLines[i];
		var lineDex = nodeSectionStart + i 
		if(tuple.length != headers.length || tuple.length == 0 ) { 
			warning += "Line "+ lineDex +"["+ entries[lineDex]+"]: Number of columns expected to be "+headers.length+", actual parsed is "+ tuple.length+"\n";
			continue;
		}
		var nd = {};
		for(var h in headers){
			nd[ headers[h] ] = tuple[h].trim()			
		}
		if( ! nodesMap[ nd.id ] ){
			nodesMap[ nd.id ] = nd;
			nodes.push(nd);
		}
	}
	var headers = edgeLines[0];
	if( $.inArray('source', headers) == -1 || $.inArray('target', headers) == -1) throw "source or target header is missing"
	for(var i=1;  i<edgeLines.length; i++){
				
		var tuple = edgeLines[i];
		console.log("Edge", tuple)
		var lineDex = edgeSectionStart + i
		if(tuple.length == 0) continue;
		if(tuple.length != headers.length || tuple.length < 2){
			warning += "Line "+ lineDex +"["+ entries[lineDex]+"]: Number of columns expected to be "+headers.length+", actual parsed is "+ tuple.length+"\n";		
			continue;
		}
				
		var edge = {};
		for(var h in headers){
			edge[ headers[h] ] = tuple[h].trim()			
		}
		edge.id = edge.id || (edge.source +"_"+ edge.target);
		if( ! edgesMap[ edge.id ] ){
			edgesMap[ edge.edge_id] = edge
			edges.push(edge);
		}	
		// add node to the node list
		if(typeof nodesMap[ edge.source] !='object'){
			var nd = {id: edge.source}
			nodesMap[ nd.id ] = nd;
			nodes.push(nd);
		}
		if(typeof nodesMap[ edge.target] !='object'){
			var nd = {id: edge.target}
			nodesMap[ nd.id ] = nd;
			nodes.push(nd);
		}
	}
	console.log("Final nodes/edges: ", nodes, edges);
	return new Network(nodes, edges);
}

Network.search = function(token, mycallback){
		
	searchEdges(token, 1,{}, function(data){
		console.log("Got edge data: " +data)
		mydata = data
		network =  Network.fromEdges(data) 
		console.log(network)
		mycallback( network)
	})
		 
	//console.log("done")
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
 

var sample_network =  Network.import(raw); //( nodes, edges);
                
            
//            
//             
//            
//function doSample(){
//	
//	
//	  	var draw_options = {
//              // your data goes here
//              network: network_json,                    
//              // show edge labels too
//              edgeLabelsVisible: true,                    
//              // let's try another layout
//              layout: "Tree",                    
//              // set the style at initialisation
//              visualStyle: vstyle,                    
//              // hide pan zoom
//              panZoomControlVisible: true 
//          };
//          
//          xlang.vis.draw(draw_options);
//	
//}            

function parseCSV (s,sep) {
            // http://stackoverflow.com/questions/1155678/javascript-string-newline-character
            var universalNewline = /\r\n|\r|\n/g;
            var a = s.split(universalNewline);
            for(var i in a){
                for (var f = a[i].split(sep = sep || ","), x = f.length - 1, tl; x >= 0; x--) {
                    if (f[x].replace(/"\s+$/, '"').charAt(f[x].length - 1) == '"') {
                        if ((tl = f[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
                            f[x] = f[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
                          } else if (x) {
                        f.splice(x - 1, 2, [f[x - 1], f[x]].join(sep));
                      } else f = f.shift().split(sep).concat(f);
                    } else f[x].replace(/""/g, '"');
                  } a[i] = f;
        }
        return a;
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
	
	//if(document.locatio)
})

 
     
