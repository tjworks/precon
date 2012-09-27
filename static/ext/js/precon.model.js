(function(){


		
precon.NetworkGraph = function(){
	this._class = 'networkgraph'
	/****** Internal properties/functions ******/
	this.init()	
	var jq = $({});	
	var networks = []
	var connections = []
	var nodes = []
	var entities = []
	var graphModel = this
	
	var selections = []
	
	
	var _addNetwork = function(netObj){
		var existing = graphModel.findNetwork(netObj.get('_id'));
		if(!existing) networks.push(netObj);
		nnet = netObj
		// load all nodes first
		var ids = []
		var conns = netObj.getConnections()
		conns.forEach(function(con){			
			if(!con.isNodeLoaded())
				ids = ids.concat ( con.getNodeIds() )			
		})
		
		precon.getObjects(ids, function(){				 	
			conns.forEach(function(con){
				graphModel.addConnection(con, netObj, false);
			});			 
			graphModel.trigger('add.network', {
				network:netObj
			})
		})		
		// TBD: add dangling nodes		
	}
	this._select=function(objects, toSelect, keepExisting){
		if(! ('length' in objects)) 
			objects = [objects]
		if(!keepExisting){
			// clear existing selections
			nodes.forEach(function(n){ n.selected = false })
			connections.forEach(function(l){ l.selected = false })
		}
		objects.forEach(function(object){
			object.selected = toSelect
		});
		jq.trigger("selectionchanged",{selected:toSelect, target:objects} );
		return toSelect;
	};		
	
	
	
	
	/****** Public Selection model functions ******/
	this.clearSelection = function(){ 
		selections= [];
		jq.trigger("selectionchanged",{selected:false, target:[]} );
	}
	this.deselect = function(objects){ return this._select(objects, false, true) }
	this.select = function(objects, keepExisting){ return this._select(objects, true, keepExisting) }	
	this.toggle = function(object, keepExisting){ return this._select(object, !object.selected, keepExisting) }
	/**
		
		for(var i=0;i<selections.length;i++){
			var mysel = selections[i]
			if(getId(mysel) == getId(object))
				return graphModel._select(object, false);				
		};
		return graphModel._select(object, true);
		*/
	/**
	 * Return list of selected nodes or connections
	 * @filter: node or connection, if not specified, return both
	 */
	this.getSelections = function(filter){ 
		if("connection" == filter || "link" == filter)
			return _.filter(connections, function(con){ return con.selected });
		else if("node" == filter)
			return _.filter(nodes, function(con){ return con.selected });
		else
			return _.filter(connections, function(con){ return con.selected }).concat(  _.filter(nodes, function(con){ return con.selected }) )
	}
	
	this.trigger=function(){
		jq.trigger.apply(jq, arguments)
		return this;
	}
	this.bind=function(){
		jq.bind.apply(jq, arguments)
		return this;
	};
	this.on =this.bind;
	
	
	/****** public util methods *****/
	/**
	 * Find node by nodeId or entity id
	 */
	this.findNode = function(nodeId, entityId){
		var ret = _.find(nodes, function(n){ return getId(n) == nodeId }) ; // first search by exact id match		
		ret = ret ||  _.find(nodes, function(n){  return n.isMerged(nodeId)		}); // then look for noderefs (see wiki doc)
		if(entityId)
			ret = ret ||   _.find(nodes, function(n){  return n.get('entity') == entityId }); // then look for noderefs (see wiki doc)
		return ret
	};
	this.findConnection = function(conId){
		return _.find(connections, function(n){ return getId(n) == conId })
	};
	this.findNetwork = function(networkId){
		return _.find(networks, function(n){ return getId(n) == networkId })
	}
		
	/****** Public graph model manipulation funcitons *************/
	this.removeAll = function(){
		log.debug("Removing all networks")
		networks.forEach(function(network){
			graphModel.removeNetwork(network)
		})		
	}
	/**
	 * Add network 
	 */
	this.addNetwork=function(netObj){
		var netId = getId(netObj)
		// TBD: check duplicates
		log.debug("adding network "+ netObj)
		var existing = this.findNetwork(netId);
		//if(existing) return;

		if(!isObject(netObj)){
			// load it
			precon.getNetwork(netId, function(net){				
				_addNetwork(net);
			})
		}
		else		
			_addNetwork(netObj)
		return this	
	}
	
	/**
	 * Remove network 
	 */
	this.removeNetwork=function(netObj){
		log.debug("Removing network " +netObj)
		var netId = getId(netObj)
		var netObj= this.findNetwork(netId)
		
		log.debug("removing network", netObj, netObj.get('name') )
		var connectionIds = netObj.getConnectionIds()
		for(var k=0;k<connectionIds.length;k++){
			var referenceCount= 0 
			for(var i=0;i<networks.length;i++)
				if( _.indexOf( networks[i].getConnectionIds(), connectionIds[k] ) >=0) referenceCount++
			if(referenceCount <=1){ // okay to remove
				this.removeConnection(connectionIds[k])
				//log.debug(connectionIds[k] +" removed")
			}
			else {				
				//log.debug(connectionIds[k] +" ref count is "+ referenceCount)
			}
				
		}
		/**
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].getNetworkId() == netId){
				this.removeNode(nodes[i])
				i--;
			}			
		}
		*/
		for(var i=0;i<networks.length;i++){
			if(getId( networks[i]) == netId){
				netObj = networks[i];
				networks.splice(i,1);
				break;
			}							
		}
		
		graphModel.trigger('remove.network', {
			network:netObj
		});
		return this;
	}
	
	/**
	 * Make a connection between existing nodes
	 * @type Link type
	 * @networkId: optional, specify which network this connection belongs to. Default to user's own working network
	 */
	this.connectNodes = function(node1, node2, type, networkId){
		if(! _.isObject(node1)){			
			node1 = findNode(node1)
			node2 = findNode(node2)
		}
		var con = {nodes:[node1, node2]}
		if(networkId) con.network = networkId
		if(type) con.type = type		
		con.owner = window.user ? user.user_id : ''
		var conn  = new precon.Connection(con)
		this.addConnection(conn, networkId)
		return conn
	}
	/**
	 * Add a connection to the graph. Can be a precon.Connection object or id
	 * @con: precon.Connection object or id
	 * @network: optional, network object or id this connection belongs to
	 * 
	 */
	this.addConnection=function(con, network, muted){   // muted: no events
	  log.debug("in model.addConnection")
		var conId = getId(con);
		var existing = this.findConnection(conId)
		if(existing){
			existing.addRef(network, "network")
			return existing;
		}		
		if(isObject(con)){
			if(!(con instanceof precon.Connection) )
				con = new precon.Connection(con)
			con.getNodes(function(nodes){
				con.addRef(con.get('network'), "network");
				var newNodes = []
				nodes.forEach(function(node){ 		
					var n = graphModel.addNode(node, con,network, muted)
					if (_.isObject(n)) newNodes.push( n  ); 
				})
				if(newNodes.length<2){
					log.debug("Too few nodes("+newNodes.length+") for connection ", con, newNodes)
					return;
				}
				//log.debug("New nodes", newNodes)
				connections.push(con);
				con.setNodes(newNodes)		
				if(!muted)
					graphModel.trigger('add.connection', {
						connection:con
					})				
			});			
		}
		else{
			//TBD: load by Id
			throw "add connection by id is not yet implemented"
		}		
		return con
	}
	
	var _deleteNode=function(existing){
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i]
			if(getId(node) == getId(existing)){
				nodes.splice(i, 1)
				return true;
			};
		};
		return false;
	}
	var _mergeNode = function(node1, node2){
		node1.merge(getId(node2))
		return node1
		/**
		var newnode = copy(node1)
		newnode.merge(getId(node2));
		newnode.set("id", precon.randomId("node"))
		newnode.id = newnode.get('id')
		// remove the old node
		_deleteNode(node1)
		return newnode
		*/
	};
	 
	/**
	 * Add a node to the graph. Can be a precon.Node object or nodeId
	 * @node: the precon.Node object or nodeId. If using nodeId the node object must already exists in the graph
	 * @connection: optioanl, if this node is being added as part of the connnection. You should not need to use this as this is used by addConnection function
	 * returns the precon.Node object
	 */
	this.addNode=function(node, connection, network, muted){
		log.debug("in model.addNode "+ node._id)
		var found = null
		if(isObject(node) && !(node instanceof precon.Node) ){
			node = new precon.Node(node)
		}
		var nodeId = getId(node);
		var entityId = isObject(node)?node.get("entity"):''
		var existing = this.findNode(nodeId, entityId)
		if(existing){
			// case 1: same node exists
			if(getId(existing) == nodeId || existing.isMerged(nodeId)){
				
			}
			else{
				// case 2: node with same entity ref exists				
				existing= _mergeNode(existing, node);				 
			}
			existing.addRef(connection, "connection");
			if(connection)
				existing.addRef(connection.get('network'), "network"); 
			return existing;			
		}
		log.debug("in model.addNode Step 2")
		// case 3: not exists at all		
		if(isObject(node) ){
			node.addRef(connection, "connection"); 
			nodes.push(node)
			if(!muted){ 
				graphModel.trigger('add.node', {
					node:node
				})
				log.debug("done triggering events")
		  }
			precon.encache(node); // add to cache so it can looked up later
			if(connection)
				node.addRef(connection.get('network'), "network");
			log.debug("model.addNode done #2")
			return node;
		}
		
		log.debug("in model.addNode Step 3")
		// TBD: using ajax queue to ensure no multiple  requests for same object happen same time
		precon.getObject(nodeId, function(obj){
			obj = new precon.Node(obj)
			obj.addRef(connection, "connection");
			if(connection)
				obj.addRef(connection.get('network'), "network");
			nodes.push(obj)
			if(!muted)
				graphModel.trigger('add.node', {
					node:obj
				})
		})	
		return node;
	};
	
	/**
	 * Remove a node from the graph
	 * @param node: node id or node object, must already exists in the graph
	 * @param force: if set to true will remove node unconditionally (as opposed to check existing ref)
	 * @events: remove.node event will be triggered. 
	 */
	this.removeNode = function(node, connection, force, muted){
		
		var nodeId = getId(node);
		log.debug("Removing nodes: "+ nodeId)
		var existing = this.findNode(nodeId);
		if(!existing) return
		if(connection){
			existing.delRef(connection,"connection");			
		}
		conids = existing.getRefs("connection")
		if(conids && conids.length>0){
			//log.debug("More refs remain for node ", node)
			if(!force)	return;
			// delete links
			for(var c in conids){
			   var cid = conids[c];
			   this.removeConnection(cid, true, muted);
			}
		} 
		
		if( _deleteNode(existing) && !muted){			
		  log.debug("triggering remove")
			graphModel.trigger('remove.node', {
				node: existing
			})
		};
	};
	/**
	 * Remove a link/connection from the graph
	 * @param con: connection id or connection object, must already exists in the graph
	 * 
	 * @events: remove.connection event will be triggered. 
	 */
	this.removeConnection = function(con, keepNodes, muted){
		//log.debug("Removing connection ", con)
		var conId = getId(con);
		for(var i=0;i<connections.length;i++){
			var con = connections[i];
			if(getId(con) == conId){
			  if(!keepNodes){
			     var nodes = con.getNodes();
           nodes.forEach(function(node){
            graphModel.removeNode(node, con);
           })    
			  }
							
				connections.splice(i,1)
				if(!muted){
				  graphModel.trigger('remove.connection', {
            connection: con
          });
				} // end if
			};
		};
	};
	
	this.getNodes = function(){ return nodes }
	this.getConnections= function(){ return connections }
	this.getNetworks = function(){return networks}
	
	this.setGraphNetwork=function(network, reload){
		// set the main network (used for saving later)
		//_.extend( this.rawdata, network.getRawdata())
		if(reload){
			this.removeAll();
			this.addNetwork(network)
		}
		this.graphNetwork = network
		jq.trigger('change.graphnetwork')
		
	}
	this.getGraphNetwork = function(){ 
		return this.graphNetwork
	}
	/**
	 * Validate the graph in preparation for saving
	 */
	this.validate = function(){		
		var errors = []
		var json = this.toJson()
		if(json._connections.length ==0 && json._nodes.length == 0){
			log.debug("No modified connections/nodes, just save connections")
		}
		log.debug("json obj:", json)
		// checking for dangling nodes
		nodes.forEach(function(node){
			if(node.getRefs('connection').length == 0 )
				errors.push("Cannot save unconnected nodes")
		})
		
		if(!json.owner)  errors.push("Network owner must be set")
		if(!json.name)  errors.push("Network name is missing")
		return errors
	};
	
	/**
	 * Save graph to server
	 */
	this.save = function(callback){
		// name
		var json = this.toJson()		
		log.debug("Going to save: ", json)		
		json = JSON.stringify(json)
		$.post("/api/graph/save.json", {'data':json},callback, 'json');
		// flush cache
		precon.flushCache()
	};
	
	this.toJson = function(){
		var obj = null
		if(this.graphNetwork)
			obj = this.graphNetwork.getRawdata()
		else
			obj = this.getRawdata(); // attributes
		
		// connections
		obj._connections  = []
		obj.connections = []
		connections.forEach(function(con){			
			obj.connections.push( con.get("id"))
			// add new or modified connections  (For now we don't allow modify other's connection)
			if( (window.user && user.user_id == con.get('owner') ) || con.isNew() ){
				// self's connection
				obj._connections.push(con.toJson())
			}			
		});
						
		obj.nodes = []
		obj._nodes = []
		nodes.forEach(function(node){
			if( (window.user && user.user_id == node.get('owner') ) || node.isNew()) {
				
				if(node.getRefs('connection').length != 0 ){
					node.set('owner', window.user.user_id)
					obj.nodes.push(getId(node))
					obj._nodes.push(node.toJson())
				}				
			}
		}); // end nodes.forEach
		
		return obj
	}
	return this
}

/** define common methods for the precon model objects */
precon.BasePrototype = {
	isNew:function(){
		return this.get("newflag") && this.get("newflag")>0 
	},
	get: function(name){
		this.rawdata = this.rawdata || {}
		if(name == 'id' || name=='_id')
			return this.rawdata['_id'] || this.rawdata['id']
		else
			return this.rawdata[name]
	},
	set: function(name, value){
		this.rawdata = this.rawdata || {}
		this.rawdata[name] = value
		if(name == '_id') this.rawdata['id'] = value
		if(name == 'id') this.rawdata['_id'] = value			
		// TBD: fire events
	},
	rawdata:{},
	init: function(rawdata){
		this.rawdata = rawdata || {}
		this.rawdata.newflag = this.rawdata._id ? 0: 1
		this.rawdata._id = this.rawdata._id || precon.randomId(this._class)
		this.rawdata.id =  this.rawdata._id
	},
	getRawdata: function(){
		return this.rawdata
	},
	setRawdata: function(rawdata){
		this.rawdata = rawdata
	},
	// used by nodes, keep track how many duplicated nodes
	noderefs: [],
	// used by Nodes, keep track how many connections this node belongs to in the graph
	connectionrefs:[],
	// used by connections/nodes, keep track which network this connection belongs to
	networkrefs :[],
	addRef:function(id, refType){
		id = getId(id)
		if(!id) return
		this[ refType+"refs" ] = _.union( this[refType+"refs"], [id]);
	},
	delRef:function(id, refType){
		id = getId(id)
		if(!id) return
		this[ refType+"refs" ] = _.without( this[refType+"refs"], id);		
	},
	getRefs: function(refType){
		return this [refType+"refs"];
	},
	toString:function(){
		var id = this.get("id") || ""
		if(id) return id.substring(0,4).toUpperCase()+"-"+ id.substring(id.length - 6);
		return Object.prototype.toString.call(this)
	},
	getClass:function(){
		return this._class
	}
}

/**
 * Network model object, can be constructed from a JSON object.
 * 
 * requires _connections (Need to fix)
 * @required fields: TBD
 */

precon.Network = function(rawdata){
	this._class = 'network'	
	if(rawdata) rawdata._id = rawdata._id || precon.randomId('network')
		
	this.init(rawdata);
	var rawdata = this.rawdata
	this.getId = function(){
		return rawdata._id
	}
	this.getTitle = function(){
		return rawdata.title
	}
	
	// return a copy of the connections list that currently loaded
	this.getConnections = function(callback){
		var cons = []
		rawdata._connections.forEach(function(con){ cons.push(con)})
		
		if(callback) callback( cons )
		else return cons
		/**
		if(mycons.length>0){
			callback(mycons)
			return
		}
		// right now we always populates _connections
		if (! rawdata._connections){
			callback([])
			return;
		} 		
		mycons = []
		rawdata._connections.forEach(function(con){
			mycons.push( new precon.Connection(con) )
		})
		callback(mycons)
		*/
	}
	this.getConnectionIds = function(){
		
		if (! rawdata._connections){			
			return []
		}
		var connections= []
		rawdata._connections.forEach(function(con){			
			connections.push( con.get('_id' ))
		})
		return connections
	}
	
	// return a copy of the nodes list
	this.getNodes = function(){
		// TBD
	}	
	return this
}



precon.Connection = function(rawdata){
	this._class = 'connection'
	this.init(rawdata);
	var rawdata = this.rawdata
	
	var nodes =  []
	if(!rawdata._id){
		// create new id
		rawdata._id = precon.randomId("connection")
	}
	if(! (rawdata.nodes && rawdata.nodes.length>1) )
		throw "Must at least provide to nodes"
	rawdata.label = rawdata.label || '' 
	rawdata.refs = rawdata.refs || {}
	rawdata.type = rawdata.type || 'association'
	
	if( rawdata.nodes[0] instanceof precon.Node){
		nodes = rawdata.nodes		
	}
	this.getId = function(){
		return rawdata._id
	}
	this.getType = function(){
		return rawdata.type
	}
	this.getNetworkId=function(){
		return rawdata?rawdata.network :''
	};
	this.getLabel = function() { 
		if(rawdata.label) return rawdata.label
		if(nodes.length>1){
			return nodes[0].get('label') +"-"+ nodes[1].get('label')
		}
		if(rawdata.nodes.length>1)
			return rawdata.nodes[0] +"-"+ rawdata.node[1]
	}
	this.getNodeIds=function(){
		return rawdata.nodes
	};
	this.isNodeLoaded=function(){
		return nodes.length >0
	};
	this.getNodes = function(callback){
		if(nodes.length>0){
			if(callback) callback(nodes)			
			return nodes
		}		
		//log.debug("con nodes", rawdata.nodes)
		// nodes is list of node IDs		
		precon.getObjects(rawdata.nodes, function(objs){
			nodes = _.clone(rawdata.nodes)
			for(var i=0; objs && i<objs.length;i++){
				for(var k=0;k<nodes.length;k++) // doing this to ensure order is same
					if(getId(nodes[k]) == getId(objs[i]) )
						nodes[k] =  new precon.Node(objs[i])
			}			
			callback && callback(nodes);			
		});				
		
		//if(callback)  callback([])
		return []
	}	
	this.setNodes = function(nds){
		//rawdata.nodes = nds
		nodes = nds
	}
	this.toJson = function(){
		// only record ids
		var obj = this.getRawdata()		
		//nodes & entities
		obj.nodes = []		
		obj.entities = []
		nodes.forEach(function(node){
			obj.nodes.push(getId(node))
			obj.entities.push((node.get('entity') || ''))
		})
		return obj
	};	
	/**
	 * Save connection to server
	 */
	this.save = function(callback){
		// name
		var json = this.toJson()		
		log.debug("Going to save: ", json)		
		json = JSON.stringify(json)
		$.post("/api/graph/save.json", {'data':json},callback, 'json');
		// flush cache		
		precon.flushCache()
		
		
	};
	return this
}

precon.Node = function(rawdata){
	this._class = 'node'
	this.init(rawdata);	
	if(!rawdata._id || !rawdata.label)
		throw "Missing _id or label"	
	
	/**
	 * Check if the nodeId specified has already been merged to current one
	 */
	this.isMerged = function(nodeId){
		return  _.indexOf( this.noderefs, nodeId)>=0
	};
	this.merge = function(nodeId){		
		this.noderefs = _.union(this.noderefs, [nodeId])
	};
	this.getLabel = function() { 
		if(rawdata.label) return rawdata.entity
	}
	this.getNetwork=function(){
		return rawdata?rawdata.network : ''
	}
	this.getEntity = function(){	
		return rawdata.entity // this is entity ID
	}	 
	this.toJson = function(){
		// only record ids
		var obj = this.getRawdata()
		// additional graph attributes
		/**
		index - the zero-based index of the node within the nodes array.
		x - the x-coordinate of the current node position.
		y - the y-coordinate of the current node position.
		px - the x-coordinate of the previous node position.
		py - the y-coordinate of the previous node position.
		fixed - a boolean indicating whether node position is locked.
		weight - the node weight; the number of associated links.
		*/
		var attrs = 'x,y,px,py,fixed,weight,index'.split(',')
		for(var i in attrs)
			if(this.hasOwnProperty(i)) obj[i] = this[i]
		return obj
	}
	/**
	 * Save node to server
	 */
	this.save = function(callback){
		// name
		var json = this.toJson()		
		log.debug("Going to save: ", json)		
		json = JSON.stringify(json)
		$.post("/api/graph/save.json", {'data':json},callback, 'json');
		// flush cache		
		precon.flushCache()
	};	
	return this
}
precon.NetworkGraph.prototype = precon.BasePrototype
precon.Network.prototype = precon.BasePrototype
precon.Node.prototype = precon.BasePrototype
precon.Connection.prototype = precon.BasePrototype

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
		
})();


/**
Ext.define('precon.BaseModel', {
    extend: 'Ext.data.Model',
    isNew:function(){
		return this.get("newflag") && this.get("newflag")>0 
	},	
	rawdata:{},
	init: function(rawdata){
		this.rawdata = rawdata || {}
		this.rawdata.newflag = this.rawdata._id ? 0: 1
		this.rawdata._id = this.rawdata._id || precon.randomId(this._class)
	},
	getRawdata: function(){
		return this.raw
	},
	setRawdata: function(rawdata){
		this.rawdata = rawdata
	},
	// used by nodes, keep track how many duplicated nodes
	noderefs: [],
	// used by Nodes, keep track how many connections this node belongs to in the graph
	connectionrefs:[],
	// used by connections/nodes, keep track which network this connection belongs to
	networkrefs :[],
	addRef:function(id, refType){
		id = getId(id)
		if(!id) return
		this[ refType+"refs" ] = _.union( this[refType+"refs"], [id]);
	},
	delRef:function(id, refType){
		id = getId(id)
		if(!id) return
		this[ refType+"refs" ] = _.without( this[refType+"refs"], id);		
	},
	getRefs: function(refType){
		return this [refType+"refs"];
	},
	toString:function(){
		var id = this.get("id") || ""
		if(id) return id.substring(0,4).toUpperCase()+"-"+ id.substring(id.length - 6);
		return Object.prototype.toString.call(this)
	},
	getClass:function(){
		return this._class
	} 
});

Ext.define('precon.Connection',{
    extend: 'precon.BaseModel',
    _class: 'connection',
    nodes:[],
    fields:['id', 'type', 'label', 'owner', 'create_tm', 'update_tm', 'refs'],
	getNodeIds: function(){
		return this.raw.nodes
	},
	getNodes: function(callback){
		if(this.nodes.length>0){
			if(callback) callback(nodes)			
			return this.nodes
		}		
		//log.debug("con nodes", rawdata.nodes)
		// nodes is list of node IDs
		var self = this
		precon.getObjects(this.raw.nodes, function(objs){
			nodes = _.clone(self.raw.nodes)
			for(var i=0; objs && i<objs.length;i++){
				for(var k=0;k<nodes.length;k++) // doing this to ensure order is same
					if(getId(nodes[k]) == getId(objs[i]) )
						nodes[k] =  new precon.Node(objs[i])
			}			
			this.nodes = nodes
			callback && callback(nodes);			
		});				
		
		//if(callback)  callback([])
		return []
	},	
	setNodes:  function(nds){
		//rawdata.nodes = nds
		this.nodes = nds
	},
	toJson : function(){
		// only record ids
		var obj = this.raw
		//nodes & entities
		obj.nodes = []		
		obj.entities = []
		this.nodes.forEach(function(node){
			obj.nodes.push(getId(node))
			obj.entities.push((node.get('entity') || ''))
		})
		return obj
	}	
    
})*/