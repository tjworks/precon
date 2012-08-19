Ext.define('Precon.controller.GraphWin', {
    extend: 'Ext.app.Controller',
    stores:['Networks'],
    models:['Network'],
    views: [
    	'NetworkGrid',
    	'NodeUpdatePanel',
    	'LinkUpdatePanel',
    	'NodeCreatePanel'
    	
    ],
    //the global variable for referencing networkGraph
    _graphModel:null,
    init: function() {
        console.log('initializing graphwindow component');
        //initialized the graphModel
		_graphModel=new precon.NetworkGraph();
		_graphController=this;
        this.control({
   			'#west': {
   				resize: this.onGraphWinResize
   			} ,
   			'#west': {
   				afterrender:this.afterGraphWinRendered
   			},
			  '#ingraph-search': {
				  afterrender:this.autoCompleteSearch
			},
			  'networkgrid': {
				  //afterrender:this.initApp,
				  //itemclick: this.networkGridClicked,
				  itemdblclick:this.networkGridDblClicked,
				  select: this.networkGridSelect,
				  deselect: this.networkGridDeselect,
				  scope: this
		  },
		  'networkgrid > gridview': {
				   refresh: this.initApp,		  	   
		  },
		  '#nodeCreateBtn': {
		  	click: this.onNodeCreateBtn
		  },
		  '#recSelectBtn' : {
		  	toggle: this.onRecSelect
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
				 d3.select('#selectRect')
								 .attr('width',d3.event.layerX-_graphController.rectSelectX0)
								 .attr('height',d3.event.layerY-_graphController.rectSelectY0);
					//			.attr('width',200)
					//			.attr('height',200);
			}
    	}
    	
    	if (flag=='up') {
			visg.on('mousemove',null);
			d3.select('#selectRect').remove();
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
   autoCompleteSearch: function() {
   	    console.log("!!! setup auto")
	    $( "#ingraph-search-inputEl" ).autocomplete({
	          source: validateKeyword,
	          minLength:2,
	          select: function(event, ui) {
	              console.log("selected ", ui)
	              precon.searchNetworks(ui.item._id, function(networks){ loadNetworks(networks, false)})
	          }         
	        });
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
		
		
		objid = this.getObjectIdFromUrl()	
		if (objid){
			//Ext.Function.bind(this.initNetwork,this);
			precon.searchNetworks(objid, this.initNetwork);			
		}
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
			_graphModel.setGraphNetwork(networkObjects[0])
		}
		_graphController.loadNetworks(networkObjects, true);
	}, 
	showMainObject:function (){	
		objid = this.getObjectIdFromUrl()
		if(!objid) return
		
		precon.getObject(objid, Ext.Function.bind(function(obj){
			var html = this.renderObject(obj)
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
   /**
	 * 
	 * @param networkObjects
	 * @param toGraph: whether to draw on graph immediately
	 * @param toReplace: remove existing before adding new one
	 */
   loadNetworks: function(networkObjects, toGraph, toReplace){
		if(!networkObjects) return
		if(toReplace){
			_graphModel.removeAll();
			networkStore.removeAll();
		}
		var networkStore=_graphController.getNetworksStore()
		console.log(networkObjects);
		console.log('is the networkobjects');
		networkObjects.forEach(function(network){		
			if(networkStore.findExact("_id", network.get('_id')) <0  ){ // add only if not already exists
				if(toGraph) _graphModel.addNetwork( network);
				obj = network.getRawdata()
				obj.include = toGraph		
				networkStore.add( obj )
				//console.log('load obj into network table ');
				//console.log(obj);
			}		
		})	
	},
	
   networkGridDblClicked: function(view, row){
		//put code here to deal with table double clicked
	    console.log("double Clicked network: " + row.data._id)      
	    _graphController.showObject(row.data)	
   },
   
   networkGridSelect:function(model,record,row,index){  
	   console.log(record.get("_id"));
	   _graphModel.addNetwork(record.get("_id"));
	},
	networkGridDeselect:function(model,record,row,index){  
       console.log('deslecting');
	   _graphModel.removeNetwork(record.get("_id"));
	},
   onGraphWinResize: function() {
   		//put here all codes related with graph window resize related
   },
   
   afterGraphWinRendered: function() {
   		//put here all codes related after render event of graph window
   		console.log("graph window is available now");
   		
   		//start to draw the graph
   		setTimeout(function() {_graphController.createGraph()},300);
   		
   		//Toggle the legend button
   		Ext.getCmp("legendToggleBtn").toggle();
   },
   createGraph: function() {
	   	//console.log("Recreating graph")
	    //
	    //graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		console.log("Creating graph")    
		//Ext.select("svg").remove();
		//graph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
		
		if(!window.mygraph){
			console.log("Creating graph")    
			mygraph = new myGraph("#west-body",Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true));
			mygraph.on("click", function(evt, target){
				//console.log("dblclick", evt, target.__data__)			
			});		
			mygraph.on("dblclick", function(evt, target){
				console.log("dblclick", evt, target.__data__)
				//showObject(target.__data__)
				if(target.__data__ && target.__data__.get('entity'))
			           precon.searchNetworks( target.__data__.get('entity'), function(nets){ _graphController.loadNetworks(nets, true, false) })
			});		
			mygraph.on("contextmenu",function(evt, target){
	            d3.event.preventDefault();
	            console.log("Contexted", target.__data__)
	            contextMenu = createContextMenu(target.__data__)
	            contextMenu.showAt([d3.event.clientX,d3.event.clientY]);
			});
			mygraph.on("mouseover",function(evt, target){
	            // alert('mouse over lines '+d.id);            
	            
	            //showTips(d3.event);
			});
			
			_graphModel = new precon.NetworkGraph()
			mygraph.setModel(_graphModel)
			
		}
		else{
			console.log("Redraw graph")    
			// redraw
			//Ext.select("svg").remove();
			mygraph.redraw(Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true))
		}	
   }
   
});