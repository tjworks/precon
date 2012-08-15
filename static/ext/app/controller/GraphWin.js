Ext.define('Precon.controller.GraphWin', {
    extend: 'Ext.app.Controller',
    stores:['Networks'],
    models:['Network'],
    views: [
    	'NetworkGrid'
    ],
    graphModel:null,
    init: function() {
        console.log('initializing graphwindow component');
        //initialized the graphModel
		this.graphModel=new precon.NetworkGraph();
		
        this.control({
   			'#west': {
   				resize: this.onGraphWinResize
   			} ,
   			'#west': {
   				afterrender:this.afterGraphWinRendered
   			},
   			'networkgrid': {
   				itemdblclick:this.networkGridDblClicked
   			}    ,
   			'networkgrid': {
   				afterrender:this.initApp
   			}      	
        }
        );
   },
   /**
	 * Call precon.client.quickSearch to get a list of networks
	 * 
	 * No returns. This function will initialize/update the network table.
	 * 
	 */
	initApp: function() {
		console.log('initializing app');
		// events binding 
		$(document).bind(precon.event.ViewportCreated, this.showMainObject)
		
		
		objid = this.getObjectIdFromUrl()	
		if (objid){
			Ext.Function.bind(this.initNetwork(),this);
			precon.searchNetworks(objid, this.initNetwork);			
		}
		this.showMainObject()
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
			this.graphModel.setGraphNetwork(networkObjects[0])
		}
		Ext.Function.bind(this.loadNetworks(networkObjects, true),this);
	}, 
	showMainObject:function (){	
		objid = this.getObjectIdFromUrl()
		if(!objid) return
		precon.getObject(objid, function(obj){
			/*
			var html = renderObject(obj)
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
						
						$("#publication-abstract").find(".entity-name").click( addNodeFromAbstract)*/
			
		});	
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
			graphModel.removeAll();
			networkStore.removeAll();
		}
		networkObjects.forEach(function(network){		
			if(networkStore.findExact("_id", network.get('_id')) <0  ){ // add only if not already exists
				if(toGraph) graphModel.addNetwork( network);
				obj = network.getRawdata()
				obj.include = toGraph		
				networkStore.add( obj )
			}		
		})	
	},
	
   networkGridDblClicked: function(){
		//put code here to deal with table double clicked
		console.log("hey, table row double clicked");   	
   },
   
   onGraphWinResize: function() {
   		//put here all codes related with graph window resize related
   },
   
   afterGraphWinRendered: function() {
   		//put here all codes related after render event of graph window
   		console.log("graph window is available now");
   		
   		//start to draw the graph
   		setTimeout(Ext.Function.bind(function() {this.createGraph()}, this),300);
   		
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
			           precon.searchNetworks( target.__data__.get('entity'), function(nets){ loadNetworks(nets, true, false) })
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
			
			graphModel = new precon.NetworkGraph()
			mygraph.setModel(graphModel)
			
		}
		else{
			console.log("Redraw graph")    
			// redraw
			//Ext.select("svg").remove();
			mygraph.redraw(Ext.get("west-body").getWidth(true),Ext.get("west-body").getHeight(true))
		}	
   }
   
});