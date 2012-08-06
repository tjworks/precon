(function(){
	
precon.NetworkGraph = function(){
	var jq = $(this)
	var networks = []
	var connections = []
	var nodes = []
	var entities = []
	var graphModel = this
	
	var selections = []
	
	var getId = function(obj){ return obj.getId?obj.getId() : obj.id}
	this.deselect = function(objects){ return this._select(objects, false) }
	this.select = function(objects){ return this._select(objects, true) }	
	this.toggle = function(object){ 
		for(var i=0;i<selections.length;i++){
			var mysel = selections[i]
			if(getId(mysel) == getId(object))
				return graphModel._select(object, false);				
		};
		return graphModel._select(object, true);
	}
	
	this._select=function(objects, toSelect){
		var selected = true;	
		if(! ('length' in objects)) 
			objects = [objects]
		//var old = copy(selections)
		objects.forEach(function(object){
			for(var i=0; i<selections.length;i++){
				var sel = selections[i]
				if(getId(sel) == getId(object)){
					selections.splice(i, 1);					
					break;
				}			
			}
			if(toSelect) selections.push(object);
		});
		
		jq.trigger("selectionchanged",{selected:toSelect, target:objects, selections:selections} );
		return selected;
	};		
	this.getSelections = function(){ return selections }
	this.trigger=function(){
		jq.trigger.apply(jq, arguments)
		return this;
	}
	this.bind=function(){
		jq.bind.apply(jq, arguments)
		return this;
	}
	
	this.addNetwork=function(netObj){
		// TBD: check duplicates
		networks.push(netObj);
		this.trigger('add.network', {
			network:netObj
		})
		netObj.getConnections(function(cons){
			cons.forEach(function(con){
				graphModel.addConnection(con);
			});
		});
		return this;
	}
	/**
	 * Add a connection to the graph. Can be a precon.Connection object or a json
	 * When using json, a list of nodes(2 or more) are required. Each node in the nodes array can be id or Node object
	 */
	this.addConnection=function(con){
		var conId = getId(con);
		var found= null
		connections.forEach(function(myCon){
			if(myCon.getId() == conId ) found = myCon; // already have it
		})
		if(found) return found;
		if(isObject(con)){
			if(!(con instanceof precon.Connection))
				con = new precon.Connection(con)
			// add nodes
			con.getNodes(function(nodes){
				nodes.forEach(function(node){ graphModel.addNode(node) })
				con.setNodes(nodes)
				connections.push(con);
				graphModel.trigger('add.connection', {
					connection:con
				})				
			});			
		}
		else{
			//TBD: load by Id
		}		
		return this;
	}
	/**
	 * Add a node to the graph. Can be a precon.Node object or a json. 
	 * If providing a JSON object, must have at least _id, name attributes
	 * returns the precon.Node object
	 */
	this.addNode=function(node){
		var nodeId = getId(node);
		var found = null
		nodes.forEach(function(myNode){
			if(myNode.getId() == nodeId) found = myNode
		});
		if(found) return found;
		
		if(isObject(node) ){
			if(! (node instanceof precon.Node) )
				node = new precon.Node(node)
			nodes.push(node)
			graphModel.trigger('add.node', {
				node:node
			})
			return node;
		}
		// TBD: using ajax queue to ensure no multiple same requests happen same time
		precon.getObject(nodeId, function(obj){
			obj = new precon.Node(obj)
			nodes.push(obj)
			graphModel.trigger('add.node', {
				node:obj
			})
		})	
		return node;
	}	
	
	this.getNodes = function(){ return nodes }
	this.getConnections= function(){ return connections }
	//this result is consumed by Ext store
	this.getNetworkList = function(){
		var array = []		
		networks.forEach(function(net){
			var a = [ net.getRawdata().name, '', net.getRawdata().owner, net.getRawdata().source, net.getRawdata().group  ];
			array.push(a)
		});
		return array
	}
	return this
}



precon.Network = function(rawdata){
	var rawdata = rawdata || {};
	
	this.getId = function(){
		return rawdata._id
	}
	this.getTitle = function(){
		return rawdata.title
	}
	
	// return a copy of the connections list
	this.getConnections = function(callback){
		// right now we always populates _connections
		if (! rawdata._connections){
			callback([])
			return;
		} 		
		var res = []
		rawdata._connections.forEach(function(con){
			res.push( new precon.Connection(con) )
		})
		callback(res)
	}
	
	// return a copy of the nodes list
	this.getNodes = function(){
		// TBD
	}	
	/** do not change the rawdata, it's read only */
	this.getRawdata = function(){
		return rawdata
	}
	return this
}


precon.Connection = function(rawdata){
	var nodes =  []
	var rawdata = rawdata || {}
	if(!rawdata._id){
		// create new id
		rawdata._id = 'conn' + getRandom()
	}
	if(! (rawdata.nodes && rawdata.nodes.length>1) )
		throw "Must at least provide to nodes"
	if( rawdata.nodes[0] instanceof precon.Node){
		nodes = rawdata.nodes		
	}
	this.getId = function(){
		return rawdata._id
	}
	this.getType = function(){
		return rawdata.type
	}
	this.getNodeIds=function(){
		return rawdata.nodes
	}
	this.getNodes = function(callback){
		if(nodes.length>0){
			if(callback) callback(nodes)			
			return nodes
		}		
		console.log("con nodes", rawdata.nodes)
		// nodes is list of node IDs		
		precon.getObjects(rawdata.nodes, function(objs){
			nodes = []
			for(var i=0; objs && i<objs.length;i++){
				nodes.push( new precon.Node(objs[i]) )
			}			
			callback && callback(nodes);			
		});				
		
		//if(callback)  callback([])
		return []
	}	
	this.setNodes = function(nds){
		//rawdata.nodes = nds
	}
	/** do not change the rawdata, it's read only */
	this.getRawdata = function(){
		return rawdata
	}
	return this
}

precon.Node = function(rawdata){	
	var rawdata = rawdata || {}
	if(!rawdata._id || !rawdata.label)
		throw "Missing _id or label"
	
	this.getId = function(){
		return rawdata._id
	}
	this.getLabel = function(){
		return rawdata.label
	}
	this.getEntity = function(){	
		return rawdata.entity // this is entity ID
	}	 
	/** do not change the rawdata, it's read only */
	this.getRawdata = function(){
		return rawdata
	}
	return this
}


/**** Helper functions ****/

	function copy(o){
	  var copy = Object.create( Object.getPrototypeOf(o) );
	  var propNames = Object.getOwnPropertyNames(o);
	 
	  propNames.forEach(function(name){
	    var desc = Object.getOwnPropertyDescriptor(o, name);
	    Object.defineProperty(copy, name, desc);
	  });
	 
	  return copy;
	}
	 
	
	function isObject(obj){
		return typeof(obj) == 'object'
	}

	function getId(obj){
		if(typeof(obj) == 'string') return obj
		if(obj.getId) return obj.getId()
		return obj._id
	}
	
	function getRandom(){
		return new Date().getTime() +'' +  Math.round( Math.random( ) * 1000 )
	}
	

		
})();


/**



Network = {
	_id:'', // 
	name: '', // arbitrary network title
	author_id:'', // author 
	nodes:[],  // list of logical node  ids,
	entities:[], // physcial entity ids
	connections:[], // list of connection objects 		
}

Revision = {
	_id:'', // precon ID
	ver: 1, 
	tstamp: '20120918.120001.394', // timestamp
	// TBD
}

// Node usually wraps a physical entity and provide addition network specific information
Node = {
	_id: '', // preocn id
	object_id:'', // the actual object's precon id
	group:'', 
	type:'',
	comment:'', // commend about the node
	refs:[], // list of references
	role:[], // list of roles this node participates in the network	
}

Connection = {
	_id:'',
	network_id:'', // the network this connection belongs to, can be NULL, index
	source:'',  // node id
	target:'', // node id
	source_obj_id: '', //source object id, index
	target_obj_id: '', //source object id, index
	interaction: 1, // interaction type,  1: physical association 2: 
	weight: 1,  // float, 0-1
	refs:[], // list of references	
	votes:[], // list of people id who voted this connection
}

People = {
	_id:'',
	first:'',
	last:'',
	name:''
	,user_id:'' // precon user id, if registered	
	,publications:[] // list of publication ids this person published/authored	
}
Circle = {
	_id:'',
	name:'',
	owner:'', // precon id, empty indicates system circles
	people:[], // list of people ids
	cstamp:'20120918.120000.001', // creation time stamp,
	ustamp: '' // update timestamp
} 

BioEntity= {
	_id:''
	, name:''
	, group:'' // gene | protein | specie |  
	, type:''
	
}

Alias = {
	_id:''  // Alias id
	,model:'' // subject data type, i.e., Node, Network, Connection, People, User group, Org, Article, Experiment etc
	,precon_id:'' // id of the subject 
	,name:'' // official name used in precon 
	,alias:'' // the alias		
	,source:'' // where the alias is defined, i.e., intact, gm, pubmed, uniprotkb	
	,source_id:''  // id in the source db, if applicable
	,type:''	// alias type,  name | id 	
}

Publication = {
		_id:'',
		name:'',
		pmd_id:'', // pubmed id
		abstract:'', // abstract of the doc
		local: 0, // 1: archived, 0: remote 
		url:'', // for the full text doc
		published: 1, // 0, unpublished, 1: published
		authors:[], // list of People id
}

Experiment = {
	_id:''
	, name:''
	, int_label:'' // shortLabel in IntAct db
	, int_id:'' // id in IntAct db
	, authors:[]
	, url:''  // the source of the experiment
	, year:2009  // the publish year
	, journal: '' 
}

*/

