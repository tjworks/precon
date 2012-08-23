
Ext.define('Precon.controller.GraphWin', {
    extend: 'Precon.controller.BaseController',
    stores:['Networks'],
    models:['Network'],
    views: [
    	'NetworkGrid',
    	'NodeUpdatePanel',
    	'LinkUpdatePanel',
    	'NodeCreatePanel',
    	'ReferenceGrid',
    	'SaveGraphWindow'
    	
    ],    
    init: function() {
        console.log('initializing graphwindow component');
        //initialized the graphModel
		_graphController=this;
		_graphModel = this.getGraphModel();
        this.control({   			
   			'#west': {
   				afterrender:this.afterGraphWinRendered,
   				resize: this.onGraphWinResize
   			},			  
		  '#nodeCreateBtn': {
		  	click: this.onNodeCreateBtn
		  },
		  '#linkCreateBtn':{
			click: this.onLinkCreateBtn  
		  },
		  '#recSelectBtn' : {
		  	toggle: this.onRecSelect
		  },
		  '#saveGraphBtn': {
			click: this.saveGraph
		  }
        });
   },  
   onRecSelect: function(btn,pressed) {
   	console.log('rectangle selction is '+pressed);
   	    if (pressed) {
   	    	
   			Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'crosshair'});
   			//visg.on('mousedown',_graphController.recSelect('down')).on('mouseup',_graphController.recSelect('up')).on('mousemove',_graphController.recSelect('move'));
   			visg.on('mousedown',function(){_graphController.recSelect('down')}).on('mouseup',function(){_graphController.recSelect('up')}).on('mousemove',function(){_graphController.recSelect('move')});

   		}
   		else {
   			Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'default'});
   			visg.on('mousedown',null).on('mouseup',null).on('mousemove',null);
   			d3.select('#selectRect').remove();
   		}
   },
   recSelect: function (flag) {
    	if (flag=='down') {
    		visg.on('mouseup',function(){_graphController.recSelect('up')}).on('mousemove',function(){_graphController.recSelect('move')});
    		console.log('rectangle selction is on');
    		console.log(d3.event);
    		if (d3.selectAll('#selectRect')[0].length==0 && d3.event)
    			_graphController.rectSelectX0=d3.event.layerX;
    			_graphController.rectSelectY0=d3.event.layerY;
	    		selectRectangle=visg.append('svg:rect')
	    							.attr('x',d3.event.layerX)
	    							.attr('y',d3.event.layerY)
	    							.attr('width',2)
	    							.attr('height',2)
	    							.attr('fill','none')
	    							.attr('stroke','red')
	    							.attr('stroke-width',2)
	    							.attr('stroke-dasharray','2 2 2 2')
	    							.attr('id','selectRect');
    	}
    		
    	if (flag=='move') {
    		console.log('mouse moving');
    		if (d3.event) {
    			if (d3.event.layerX-_graphController.rectSelectX0<0)
	    			d3.select('#selectRect')
	    							 .attr('x',d3.event.layerX)
	    							 .attr('y',d3.event.layerY)
									 .attr('width',Math.abs(d3.event.layerX-_graphController.rectSelectX0))
									 .attr('height',Math.abs(d3.event.layerY-_graphController.rectSelectY0));
				 else
					 d3.select('#selectRect')
					 				 .attr('x',_graphController.rectSelectX0)
	    							 .attr('y',_graphController.rectSelectY0)
									 .attr('width',Math.abs(d3.event.layerX-_graphController.rectSelectX0))
									 .attr('height',Math.abs(d3.event.layerY-_graphController.rectSelectY0));
						//			.attr('width',200)
						//			.attr('height',200);
			}
    	}
    	
    	if (flag=='up') {
			visg.on('mousemove',null);
			d3.selectAll('#selectRect').remove();
			Ext.ComponentQuery.query('#recSelectBtn')[0].toggle();
			setTimeout(function() {
							Ext.ComponentQuery.query('#recSelectBtn')[0].toggle();
							_graphController.rectSelectX0=null;
				    		_graphController.rectSelectY0=null;
				   },100);
    	}
   },
   
   onNodeCreateBtn: function() {
   		if (typeof nodecreatepanel=='undefined')
   			nodecreatepanel=Ext.widget('nodecreatepanel',{renderTo:Ext.getBody()});
   			nodecreatepanel.show();
   },
   onLinkCreateBtn: function(){
	   
   },
   
   /**
	 * Call precon.client.quickSearch to get a list of networks
	 * 
	 * No returns. This function will initialize/update the network table.
	 * 
	 */
	initApp: function() {
		console.log('initializing app');
		//select all networks in the network table NOTE: this might need to be changed
		setTimeout(function(){Ext.ComponentQuery.query('networkgrid')[0].getSelectionModel().selectAll()},200);
		
		// events binding 
		$(document).bind(precon.event.ViewportCreated, this.showMainObject)
		
		
		
		this.showMainObject()
	},
 	
 	//
 	onNetworkGridRefresh: function() {
 		alert('ha ha loaded');
 		console.log('network is refreshing...');	
 	},
 	
	// get the object id from the URL, if it's available
	getObjectIdFromUrl: function(){
		var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
		if(matcher) return matcher[1]
		return ''
	},
	
	/**
	 * Call precon.client.quickSearch to get a list of networks
	 * 
	 * No returns. This function will initialize/update the network table.
	 * 
	 */
	initNetwork:function (networkObjects) {
	// sample static data for the store
	   console.log('here is the returns from JT. ');
	   console.log(networkObjects);
		if(!networkObjects || networkObjects.length == 0){
			console.log("Error: no result")
			return
		}
		var getObjectIdFromUrl=function() {
				var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
				if(matcher) return matcher[1]
				return ''
		};
		if(networkObjects.length == 1 && getObjectIdFromUrl()== networkObjects[0].get('id')){
			this.getGraphModel().setGraphNetwork(networkObjects[0])
		}
		_graphController.loadNetworks(networkObjects, true);
	}, 
	showMainObject:function (){	
		objid = this.getObjectIdFromUrl()
		if(!objid) return
		var self = this
		precon.getObject(objid, Ext.Function.bind(function(obj){
			var html = self.renderObject(obj)
			var title =  obj.name || obj.title || obj.label
			Ext.getCmp("west").setTitle( precon.getObjectType(objid) + ": "+  title)
			title = precon.util.shortTitle(title)
			var tab = Ext.getCmp("infopanel").add({
				title:'Summary',
				html:html,
				autoScroll:true,
				closable:true
			})
			Ext.getCmp("infopanel").setActiveTab(tab)	
			
			$("#publication-abstract").find(".entity-name").click(this.addNodeFromAbstract)
		},this)); 
	},
	
    addNodeFromAbstract:function(evt, obj){
		var label = $(this).text() 
		var group = $(this).attr("group")	
		nodeCreate( {label:label, group:group}  )
		
		//label.replace(/[()\s]/g, '')
		//graphModel.addNode( {_id:id, label: label } )
	},
	
	renderObject:function(obj){
		//console.log("Rendering object: ", obj)
		if(precon.getObjectType(obj._id) =='publication' ){
			var authors = ''
			if(obj.authors){
				obj.authors.forEach(function(author){
					if(authors) authors+=", ";
					authors += (author.first?author.first.substring(0,1):'') +" "+ author.last
				});			
			}
			
			
			html="<table><tr><th>Title:</td><td>"+obj.name+"</td></tr>"
			html+="<tr><th>Authors:</th><td>" + authors +"</td></tr>"
			
			var entities = obj.entities || [];
			ab = obj.abstract;
			// sort by character length of the entity then alphabetically, this is to address one entity name is a substring of the other
			entities = _.sortBy(entities, function(name){ (name.length + 100) + name  })
			for(var i=0;i<entities.length;i++){
				var en = entities[entities.length-1-i]			
			}
			entities.forEach(function(en){
				var re = new RegExp("\\b" + en.name+"\\b", 'gi')
				console.log("Replacing " + en.name)
				ab = ab.replace(re, '<a href="#" class="entity-name" group="' +en.group+'">'+ en.name+'</a>')  
			});
			
			html+="<tr><th>Abstract:</th><td id='publication-abstract'>" + ab +"</td></tr>"		
			
			html+="</table>"
			return html
		}	
		else if(precon.getObjectType(obj._id) =='connection' ){
			//TBD: temp hack
			//obj.label = obj.source.getLabel() + " - " + obj.target.getLabel()
			obj.label = obj.nodes[0] + " - " + obj.nodes[1] 
		}
	
	    //stop rendering node, switch it panel items	
		if (precon.getObjectType(obj._id)!="node")
			return precon.util.formatObject(obj)
		
	},

  
   onGraphWinResize: function() {
	   console.log("resized")
   		//put here all codes related with graph window resize related
	   this.createGraph()
   },
   
   afterGraphWinRendered: function() {
   		//put here all codes related after render event of graph window
   		console.log("graph window is available now");   		
   		//start to draw the graph
   		//setTimeout(function() {_graphController.createGraph()},300);   		
   		//Toggle the legend button
   		Ext.getCmp("legendToggleBtn").toggle();
   },
   onLaunch: function(){
	   console.log("GraphWin.Onlaunch")	   
	   this.createGraph()
	   this.showMainObject()
	   
   },
   createGraph: function() {
	   	//console.log("Recreating graph")
	    //
	    //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		console.log("Creating graph")    
		//Ext.select("svg").remove();
		//graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		var self = this
		if(!window.mygraph){
			console.log("Creating graph ", Ext.get("west-body").getWidth(true), Ext.get("west-body").getHeight(true))    
			mygraph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
			mygraph.on("click", function(evt, target){
				//console.log("dblclick", evt, target.__data__)			
			});		
			mygraph.on("dblclick", function(evt, target){
				console.log("dblclick", evt, target.__data__)
				//showObject(target.__data__)
				if(target.__data__ && target.__data__.get('entity'))
			           precon.searchNetworks( target.__data__.get('entity'), function(nets){ 
			        	   var netController = self.getController('NetworkGridController')
			        	   netController.loadNetworks(nets, true, false) 
			        	   })
			});		
			mygraph.on("contextmenu",function(evt, target){
	            d3.event.preventDefault();
	            console.log("Contexted", target.__data__)
	            contextMenu = self.createContextMenu(target.__data__)
	            contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
			});			
			//_graphModel = new precon.NetworkGraph()
			mygraph.setModel(this.getGraphModel())			
		}
		else{
			console.log("Redraw graph")    
			// redraw
			//Ext.select("svg").remove();
			mygraph.resize(Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true))
		}
		this.toggleFullscreenMode()
   },
   toggleFullscreenMode:function(){	   
	    var viewport = Ext.getCmp('viewport')
	    if(!viewport) return
		if(screen.height === window.outerHeight){
			console.log("Switch to fullscreen mode")
			// full screen mode			
			viewport.getLayout().padding = '0 0 0 0'
			viewport.doLayout()			
			Ext.getCmp("west").setWidth(Ext.getBody().getSize().width )		
			
			$("#myheader").hide()
			viewport.fullscreen = true
		}
		else{
			if(viewport.fullscreen){
				viewport.fullscreen = false
				console.log("quit fullscreen mode")			
				viewport.getLayout().padding = '52 0 0 0'
				viewport.doLayout()
				Ext.getCmp("west").setWidth(Ext.getBody().getSize().width *0.6)
				$("#myheader").show()
			}		
		}
	}, // end toggleFullscreen

	createContextMenu:function(obj) {
		contxted = obj
		var self = this
		var items= []
		var label = 'Link'
		if(obj && obj.getClass && obj.getClass() == 'node'){	
			if(obj.get("entity"))
				items.push({
		                    text: 'Expand',
		                    handler:function() {
		                  	  console.log("Centered on", obj)
		                  	  if(obj.get('entity'))
		                      	  precon.searchNetworks( obj.get('entity'), function(nets){ self.loadNetworks(nets, true, true) })
		                    }, 
		                    iconCls:'update'
		                });
			label = 'Node '
		};
			
		if(obj){
			items.push(	               
		              {
		                  text: 'View/Edit '+ label,
		                  handler:function(menuItem,menu) {
		                  	self.showObject(obj)
		                  }, 
		                  iconCls:'update'
		              },
		              {
		                  text: 'Remove '+ label+": " + (obj.get('label') || ''),
		                  handler:function(menuItem,menu) {  self.openRemoveWindow(obj) }, 
		                  iconCls:'remove'
		              })
		}
		items.push(	                             
	              
	              {
	                  text: 'Create Node',
	                  handler:function(menuItem,menu) { nodeCreate() }, 
	                  iconCls:'create'
	              },
	              {
	                  text: 'Clear Cached Data',
	                  handler:function(menuItem,menu) { $.jStorage.flush(); alert("Done!"); window.contextMenu && window.contextMenu.hide()}, 
	                  iconCls:'create'
	              }
	              
	         );    

	    contextMenu = new Ext.menu.Menu({items:items});
	    return contextMenu
	   
	}, // end createContext
	openRemoveWindow: function(selected){
		var sel = []
		var graphModel = this.getGraphModel()
		if(selected) sel = [selected]		
		else sel = graphModel.getSelections() 	
		if(sel.length == 0){
			alert("Please select node or link you wish to remove first")
			return
		}
		sel.forEach(function(item){
			if(item._class == 'connection')
				graphModel.removeConnection(item)		
		})	
		sel.forEach(function(item){
			if(item._class == 'node')
				graphModel.removeNode(item, null, true)		
		})
		graphModel.clearSelection()

	},
	saveGraph: function(){
		var self = this
		var f = function(){
			console.log("Continue saveGraph")
			self.saveGraph()
		}
		 	
		if(!window.user || !window.user.user_id){
			$(document).one(precon.event.UserLogin, f)
			$('a.login-window').click()
			return;
		}
		
		console.log("Doing saving")
		var graphModel = this.getGraphModel()
		
		var gNetwork = graphModel.getGraphNetwork() 
		if(!gNetwork || gNetwork.get('owner') != window.user.user_id ){
			gNetwork = gNetwork? _.clone(gNetwork): new precon.Network()
			gNetwork.set('id', precon.randomId('network'))
			gNetwork.set('name','' )
			gNetwork.set('owner', window.user.user_id)
			graphModel.setGraphNetwork(gNetwork)
		}
		
		window.saveGraphWindow = window.saveGraphWindow || this.getView('SaveGraphWindow').create()
		
		//if(! Ext.getCmp("graphname").getValue()) Ext.getCmp("graphname").setValue(gNetwork.get("name"))
		
		saveGraphWindow.show()	
	} // end saveGraph
	
});
