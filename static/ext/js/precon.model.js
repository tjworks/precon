precon.NetworkGraph = function(){
	var jq = $(this)
	var networks = []
	var connections = []
	var nodes = []
	var entities = []
	var graphModel = this
	
	this.trigger=function(){
		jq.trigger.apply(jq, arguments)
	}
	this.bind=function(){
		jq.bind.apply(jq, arguments)
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
	}
	this.addConnection=function(con){
		var conId = isObject(con)? con.getId(): con
		var found= false
		connections.forEach(function(myCon){
			if(myCon.getId() == conId ) found = true; // already have it
		})
		if(found) return;
		if(typeof(con) == 'object'){
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
	}
	this.addNode=function(node){
		var nodeId = typeof(node) == 'object'?node.getId(): node
		var found = false
		nodes.forEach(function(myNode){
			if(myNode.getId() == nodeId) found = true
		});
		if(found) return;
		if( isObject(node) ){
			nodes.push(node)
			graphModel.trigger('add.node', {
				node:node
			})
			return;
		};
		// TBD: using ajax queue to ensure no multiple same requests happen same time
		precon.getObject(nodeId, function(obj){
			obj = new precon.Node(obj)
			nodes.push(obj)
			graphModel.trigger('add.node', {
				target:obj
			})
		})			
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
	this.getRawdata = function(){
		return rawdata
	}
	return this
}


precon.Connection = function(rawdata){
	var nodes = []
	var rawdata = rawdata || {}
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
		if(nodes.length){
			if(callback) callback(nodes)			
			return nodes
		}		
		 
		// nodes is list of node IDs
		if(rawdata.nodes){
			precon.getObjects(rawdata.nodes, function(objs){
				var nodes = []
				for(var i=0; objs && i<objs.length;i++){
					nodes.push( new precon.Node(objs[i]) )
				}
				callback && callback(nodes);
				
			});				
		}
		if(callback)  callback([])
		return []
	}	
	this.setNodes = function(nds){
		nodes = nds
	}
	this.getRawdata = function(){
		return rawdata
	}
	return this
}
precon.Node = function(rawdata){	
	var rawdata = rawdata || {}
	this.getId = function(){
		return rawdata._id
	}
	this.getLabel = function(){
		return rawdata.label
	}
	this.getEntity = function(){	
		return rawdata.entity // this is entity ID
	}	 
	this.getRawdata = function(){
		return rawdata
	}
	return this
}



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
/**
$.Class('precon.DatabaseObject',	
	{
	},	
	{
	  init: function( rawdata ) {	
	    // rawdata from DB
	    this.rawdata = rawdata || {}
	  },
	  
	  getName:function(){
		  return this.rawdata.name || this.rawdata.label
	  },
	  
	  getData: function(){
		  return this.rawdata
	  }
	}
);

precon.DatabaseObject('precon.Network', {
	init: function(rawdata){
		this._super(rawdata)
	},
	getTitle: function(){
		return this.name || this.title
	}	
})

*/

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