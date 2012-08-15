Ext.define('Precon.controller.GraphWin', {
    extend: 'Ext.app.Controller',
    stores:['Networks'],
    models:['Network'],
    views: [
    	'NetworkGrid'
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
				  afterrender:this.initApp,
				  click: this.networkGridClicked,
				  itemdblclick:this.networkGridDblClicked,
				  scope: this
		  }
        });
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
		// events binding 
		$(document).bind(precon.event.ViewportCreated, this.showMainObject)
		
		
		objid = this.getObjectIdFromUrl()	
		if (objid){
			//Ext.Function.bind(this.initNetwork,this);
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
				console.log('load obj into network table ');
				console.log(obj);
				//_graphController.getNetworksStore().loadData(obj);
			}		
		})	
	},
	
   networkGridDblClicked: function(view, row){
		//put code here to deal with table double clicked
	    console.log("double Clicked network: " + row.data._id)      
	    _graphController.showObject(row.data)	
   },
   
   networkGridClicked:function(view, item){        	
	   console.log(item, item.name, item.value, item.checked)
	   if(item.name == 'networkId' ){
		   if(item.checked)
			   graphModel.addNetwork( item.value )
		    else
			   graphModel.removeNetwork( item.value )
		}
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