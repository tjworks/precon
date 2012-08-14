Ext.define('Precon.controller.GraphWin', {
    extend: 'Ext.app.Controller',
    stores:['Networks'],
    models:['Network'],
    views: [
    	'NetworkGrid'
    ],
    init: function() {
        console.log('initializing graphwindow component');
        this.control({
   			'#west': {
   				resize: this.onGraphWinResize
   			} ,
   			'#west': {
   				afterrender:this.afterGraphWinRendered
   			},
   			'networkgrid': {
   				itemdblclick:this.networkGridDblClicked
   			}       	
        }
        );
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