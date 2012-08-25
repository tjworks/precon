
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
    	'SaveGraphWindow',
    	'LinkCreateWindow',
    	'GraphLegendWindow',
    	'ObjectView'
    ],    
    requires:['Ext.ux.form.MultiSelect'],
    init: function() {
        log.debug('initializing graphwindow component');
        //initialized the graphModel
		_graphController=this;
		_graphModel = this.getGraphModel();
        this.control({   			
   			'#west': {
   				afterrender:this.afterGraphWinRendered,
   				resize: this.onGraphWinResize
   			},			  
		  '#nodeCreateBtn': {
		  	click: this.nodeCreate
		  },
		  '#linkCreateBtn':{
			click: this.onLinkCreateBtn  
		  },
		  '#recSelectBtn' : {
		  	toggle: this.onRecSelect
		  },
		  '#saveGraphBtn': {
			click: this.saveGraph
		  },
		  '#removeNodeBtn':{
			  click: function(){
				  this.openRemoveWindow()
			  }
		  },
		  '#legendToggleBtn':{
			  toggle: this.toggleLegend
		  }
        });
   },  
   onRecSelect: function(btn,pressed) {
   	log.debug('rectangle selction is '+pressed);
   	    if (pressed) {
   	    	mygraph.setRectSelectMode(true);
   			Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'crosshair'});
   			//visg.on('mousedown',_graphController.recSelect('down')).on('mouseup',_graphController.recSelect('up')).on('mousemove',_graphController.recSelect('move'));
   			//visg.on('mousedown',function(){_graphController.recSelect('down')}).on('mouseup',function(){_graphController.recSelect('up')}).on('mousemove',function(){_graphController.recSelect('move')});
   		}
   		else {
   			mygraph.setRectSelectMode(false);
   			Ext.core.DomHelper.applyStyles(Ext.DomQuery.select('svg')[0],{cursor:'default'});
   			//visg.on('mousedown',null).on('mouseup',null).on('mousemove',null);
   			//d3.select('#selectRect').remove();
   		}
   },
   recSelect: function (flag) {	  
    	if (flag=='down') {
    		visg.on('mouseup',function(){_graphController.recSelect('up')}).on('mousemove',function(){_graphController.recSelect('move')});
    		log.debug('rectangle selction is on');
    		log.debug(d3.event);
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
    		log.debug('mouse moving');
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
   
   nodeCreate: function(nodeData) {
   		if (typeof nodeCreateWindow=='undefined'){   			
   			window.nodeCreateWindow =  this.getView('NodeCreatePanel').create()
   			nodeCreateWindow.show();
   			$( "#entityname-inputEl" ).autocomplete({
  	          source: validateEntity,
  	          minLength:2,
  	          select: function(event, ui) {
  	              log.debug("selected entity", ui)
  	              $( "#entityname-inputEl" ).attr("entityName", ui.item._id)
  	              $( "#entityname-inputEl" ).attr("entityId", ui.item._id)					    	             
  	              //precon.searchNetworks(ui.item._id, function(networks){ loadNetworks(networks, false)})
  	          }, 
  	          search:function(){
  	        	  $( "#entityname-inputEl" ).attr("entityName", '')
  	              $( "#entityname-inputEl" ).attr("entityId", '')
  	          }
  	        });
   		}
   		nodeCreateWindow.show();	
		if(nodeData && nodeData.label)
			$( "#entityname-inputEl" ).attr("value",nodeData.label).keydown()	    
   },
   onLinkCreateBtn: function(){
		//initialize the linkCreateWindow with selections
		var selections = this.getGraphModel().getSelections("node")
		var nodes = []
		selections.forEach(function(obj){
			if(obj instanceof precon.Node) 
				nodes.push(obj)
		})
		if(nodes.length<2){
			alert("Please select two nodes first")
			return;
		}
		window.linkCreateWindow = window.linkCreateWindow || this.getView('LinkCreateWindow').create()
		
		if(nodes.length>=2){
			Ext.getCmp("linkname1_c").setValue(nodes[0].getLabel());
			Ext.getCmp("linkname2_c").setValue(nodes[1].getLabel());
		} 						
		linkCreateWindow.show();	
   },
      
 	//
 	onNetworkGridRefresh: function() {
 		
 	},
 	
	// get the object id from the URL, if it's available
	getObjectIdFromUrl: function(){
		var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
		if(matcher) return matcher[1]
		return ''
	},	
	showMainObject:function (objid){	
		objid = objid || this.getObjectIdFromUrl()
		if(!objid) return
		var self = this
		precon.getObject(objid, function(obj){
			var html = self.renderObject(obj)
			var title =  obj.name || obj.title || obj.label
			Ext.getCmp("west").setTitle( precon.getObjectType(objid) + ": "+  title)
			title = precon.util.shortTitle(title)
			var tab = Ext.getCmp("infopanel").add({
				title:'Summary',
				items:[html],
				autoScroll:true,
				closable:true
			})
			Ext.getCmp("infopanel").setActiveTab(tab)						
		});				
	},
	
    addNodeFromAbstract:function(em){
		var label = $(em).text() 
		var group = $(em).attr("group")	
		this.nodeCreate( {label:label, group:group}  )
		
		//label.replace(/[()\s]/g, '')
		//graphModel.addNode( {_id:id, label: label } )
	},
	
	renderObject:function(obj){
		var objType = precon.getObjectType( getId(obj) )
		var v = this.getView(objType.substring(0,1).toUpperCase()+ objType.substring(1) +'View').create({object:obj})
		log.debug("View is ", v)
		return v;		
	},
  
   onGraphWinResize: function() {
	   log.debug("resized")
   		//put here all codes related with graph window resize related
	   this.createGraph()
   },
   
   afterGraphWinRendered: function() {
   		//put here all codes related after render event of graph window
   		log.debug("graph window is available now");   		
   		//start to draw the graph
   		//setTimeout(function() {_graphController.createGraph()},300);   		
   		//Toggle the legend button
   		//Ext.getCmp("legendToggleBtn").toggle();
   },
   onLaunch: function(){
	   log.info("GraphWin.Onlaunch")	   
	   this.createGraph()
	   this.showMainObject()

	   // bind graph events 
	   var self = this
	   $(document).on("mined-entity-clicked", function(evt, em){
		   log.debug("mined click", arguments)
		   self.addNodeFromAbstract(em)
	   })
   },
   createGraph: function() {
	   	//log.debug("Recreating graph")
	    //
	    //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		log.debug("Creating graph")    
		//Ext.select("svg").remove();
		//graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		var self = this
		if(!window.mygraph){
			log.debug("Creating graph ", Ext.get("west-body").getWidth(true), Ext.get("west-body").getHeight(true))    
			mygraph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
			mygraph.on("click", function(evt, target){
				//log.debug("dblclick", evt, target.__data__)			
			});		
			mygraph.on("dblclick", function(evt, target){
				log.debug("dblclick", evt, target.__data__)
				//showObject(target.__data__)
				if(target.__data__ && target.__data__.get('entity'))
			           precon.searchNetworks( target.__data__.get('entity'), function(nets){ 
			        	   var netController = self.getController('NetworkGridController')
			        	   netController.loadNetworks(nets, true, false) 
			        	   })
			});		
			mygraph.on("contextmenu",function(evt, target){
	            d3.event.preventDefault();
	            log.debug("Contexted", target.__data__)
	            contextMenu = self.createContextMenu(target.__data__)
	            contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
			});			
			//_graphModel = new precon.NetworkGraph()
			mygraph.setModel(this.getGraphModel())			
		}
		else{
			log.debug("Redraw graph")    
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
			log.debug("Switch to fullscreen mode")
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
				log.debug("quit fullscreen mode")			
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
		                  	  log.debug("Centered on", obj)
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
		log.debug("remove node", selected)
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
			log.debug("Continue saveGraph")
			self.saveGraph()
		}
		 	
		if(!window.user || !window.user.user_id){
			$(document).one(precon.event.UserLogin, f)
			$('a.login-window').click()
			return;
		}
		
		log.debug("Doing saving")
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
	,
	showObject: function(ob){
		var self = this
		if('getRawdata' in ob) obj = ob.getRawdata()
		
		
		var tab =  Ext.getCmp("infopanel").getComponent(obj._id)
		if(!tab){			
			var title =  obj.name || obj.title || obj.label
			var title = precon.util.shortTitle(title)
			//process the node rendering
			if (ob.getClass && ob.getClass()=="node") {
				
				tab = Ext.getCmp("infopanel").add(
					{
						title:title,
						layout:'fit',
						id:obj._id,
						closable:true,
						defaults: {
				        	anchor: '100%',
				        	bodyPadding:20
				   		},
						items:[{xtype:'nodeupdatepanel'}],
						fbar: [
					          {
					              text: 'Update Node',
					              handler: function () {
					              	  alert("peng peng");
					                  var tabs = this.up('tabpanel');
					              }
					          }
					      ]
					}
				);
			}
			else if (ob.getClass && ob.getClass()=="connection") {
					//var getName=function(id) {precon.getObject(id,function(obj){obj.name})};
				    var formnodes=[];
				    obj.nodes.forEach(function(anode) {
				    	var label = self.getGraphModel().findNode(getId(anode)).get("label")
				    	formnodes.push([label, label])
				    	//precon.getObject(getId(anode),function(obj){log.debug(obj);formnodes.push([obj.label,obj.label])})
				    	//formnodestemp.push([anode,anode])}
				    	});
					
					tab = Ext.getCmp("infopanel").add(
						{
							title:title,
							layout:'fit',
							id:obj._id,
							closable:true,
							defaults: {
					        	anchor: '100%',
					        	bodyPadding:20
					   		},
					   		items:[{xtype:'linkupdatepanel'}]						
						}
					);
			} else
			{
				tab = Ext.getCmp("infopanel").add({
					title:title,
					items: [self.renderObject(obj)],
					id:obj._id,
					autoScroll:true,
					closable:true
				})
			}
		}
		Ext.getCmp("infopanel").setActiveTab(tab)
	},
	/*
	 * Toggle the show/hide of legend window. If legend window is not created, it will create it first
	 * 
	 */
	toggleLegend:function(item,pressed) {
		if (!window.legendWindow)
			legendWindow= this.getView('GraphLegendWindow').create({ x:2,
																	 y:Ext.getCmp("legendToggleBtn").getEl().getXY()[1]-260,}		)
		if (pressed) {
			legendWindow.show();
			item.setText("Hide Legend");
		}
		else {
			legendWindow.hide();
			item.setText("Show Legend");
		} 
	}  // end of toggleLegend
});
