Ext.define('xlang.controller.CytoController', {
    extend: 'Ext.app.Controller',
    requires:['xlang.view.NodeEditor'],
    init: function() {
     		console.log("CytoController.init"); 
     		this.control({
     				"#cytopage": {
     					afterrender: function(){
							//console.log("cytopage rendered");
     						initCyto();
     						//doSample();
     						//drawModel(sample_network);
     						
     						Network.search("P4HB", function(network){
     							if(network)
     								drawModel(network)
     						})
     						
     			     		$("#cyoverlay").on("mousedown", lineStart);
     			     		$("#cyoverlay").on("mousemove", lineMove);
     			     		$("#cyoverlay").on("mouseup", lineEnd);
						},
						activate: function(){
							console.log('cytopage activate')
						}
     				}
     		});
     		
     		$(document).on('keydown', 	handleKeyEvents);
     	
     		
     	
    },      
	onLaunch: function(){
		console.log("ChatController.onlaunch")
		
	
	} 
});

function getFlashDimensions() {
	var movieObj = xlang.vis.swf();
	var width = movieObj.TGetProperty("/", 8);
	var height= movieObj.TGetProperty("/", 9);
	console.log("Flash dimension", width, height);
	return {width:width, height:height}
}
function getOverlayDimensions(){
	var width = $("#cyoverlay").css("width");
	var height = $("#cyoverlay").css("height");
	width  = width.replace('px', '');
	height  = height.replace('px', '');
	console.log("overlay dimension", width, height);
	return {width:width, height:height}
}

var startPoint = {};
function lineStart(evt){
	console.log("line start");
	startPoint.x = evt.offsetX;
	startPoint.y = evt.offsetY;
	$("svg").remove();
	//<svg xmlns="http://www.w3.org/2000/svg" version="1.1">  <path d="M0 0 L75 200 L225 200 Z" stroke="red" stroke-width="3"/></svg>
	
}
function lineEnd(evt){
	console.log("line end");
	startPoint = {};
	var fDim = getFlashDimensions();
	var oDim =  getOverlayDimensions();
	
	var x = Math.round( evt.offsetX * fDim.width / oDim.width);
	var y = Math.round( evt.offsetY * fDim.height / oDim.height);
	console.log("node x, y ", x, y);
	
	// now iterate through all the nodes to find the right one based on the x, y
	var nodes = xlang.vis.nodes();
	for(var i=0;nodes && i<nodes.length; i++){
		var nd = nodes[i];
		if( Math.abs(nd.rawX - x) <= (nd.width/2) && Math.abs(nd.rawY - y) <= (nd.height/2) ){
			// found, create edge
			console.log("Adding edge");
			var edge = {directed:true};
			
			var origNode = activeLinkEvent.target;
			if(activeLinkEvent.value.indexOf("To")>=0) { // link to				
				edge.source = origNode.data.id
				edge.target = nd.data.id;
			}
			else if(activeLinkEvent.value.indexOf("From")>=0) { // link to
				edge.target = origNode.data.id
				edge.source = nd.data.id;
			}
			else {  // no direction
				edge.source = origNode.data.id
				edge.target = nd.data.id;
				edge.directed = false;
			}
			edge.id = edge.source+edge.target;				
			
			xlang.history.snapshot();
			xlang.vis.addEdge(edge, true);
		} 
	}
		
	$("#cyoverlay").css("zIndex", -1);
	activeLinkEvent = null;
}
function lineMove(evt){
	console.log("line move");	
	if(typeof  startPoint.x == 'undefined') return;		
	$("svg").remove();
	$("#cyoverlay").append('<svg  xmlns="http://www.w3.org/2000/svg" version="1.1"><line x1="'+ startPoint.x+'" + y1="' + startPoint.y +'" x2="'+ evt.offsetX + '" y2="'+ evt.offsetY+'"  stroke-width="2" stroke="red" /></svg>')
}


function initCyto(){
	    
	 // initialization options
    var options = {
        swfPath: "cytoweb/swf/CytoscapeWeb",
        flashInstallerPath: "cytoweb/swf/playerProductInstall"
    };
    
    var vis = new org.cytoscapeweb.Visualization('cytoscapeweb', options);
    
    vis.ready(function() {
       
            vis.addContextMenuItem("Confirm Link", "edges",  confirmEdge  );
            vis.addContextMenuItem("Delete Link", "edges",  deleteEdge  );
            vis.addContextMenuItem("Add Direction", "edges", addDirection  );
            vis.addContextMenuItem("Remove Direction", "edges",    removeDirection );            
            vis.addContextMenuItem("Reverse Link Direction", "edges",  reverseDirection  );
            
            vis.addContextMenuItem("Edit Node", "nodes",  editNode  );
            vis.addContextMenuItem("Delete Node", "nodes",  deleteNode  );
            vis.addContextMenuItem("Add Link To", "nodes",  addLink  );
            vis.addContextMenuItem("Add Link From", "nodes",  addLink  );
            
            vis.addContextMenuItem("Add Node", "global",  addNode  );
    });
	
    vis.addListener("click", "nodes", function(evt) {
    	
        node = evt.target;
        console.log("Mouse:" , evt.mouseX, evt.mouseY);
        console.log("Obj:" , evt.target.rawX, evt.target.rawY);
        // handles multi-select
        console.log(evt)
        //alert("Node " + node.data.id + " was clicked");
        return true;
    })
     vis.addListener("click", "global", function(evt) {
        // handles multi-select
        console.log(evt.mouseX, evt.mouseY);
        //alert("Node " + node.data.id + " was clicked");
        return true;
    })
    var glow = function(evt) {
        // handles multi-select
        
        obj = evt.target;
        console.log("mouseover: " + obj.data.id);
   
        var bypass = { nodes: { }, edges: { } };
        var props = {};
        if(obj.group == 'nodes'){
        	props = {
                labelFontSize: 12,
                labelFontColor: "#ff0000",
                labelFontWeight: "bold",
                size: 36
        	}
        }
        else{
        	props.width = 3;
        };
        
        bypass[obj.group][obj.data.id] = props;
        vis.visualStyleBypass(bypass);
         
        //alert("Node " + node.data.id + " was clicked");
        return true;
    }
    var unglow = function(evt) {
        vis.visualStyleBypass(null);
        return true;
    }
    vis.addListener("mouseover", "nodes", glow );
    vis.addListener("mouseover", "edges", glow );
    
    vis.addListener("mouseout", "nodes", unglow)
    vis.addListener("mouseout", "edges", unglow)
    xlang.vis = vis;	
    xlang.history = new History();
}



function handleKeyEvents(evt){
	if( Ext.getCmp("pagecontainer").getLayout().getActiveItem().id != 'cytopage') return false;
	var handled = false;
	if(evt.which == 90 && evt.ctrlKey){
		console.log("undo");
		xlang.history.undo();
		handled = true;
	} 
	else if(evt.which == 89){
		console.log("redo");
		handled = true;
	}	
}

function addDirection(evt){
	edge = evt.target;
	
	xlang.history.snapshot();
	xlang.vis.updateData('edges', [edge], {directed:true})
}
function removeDirection(evt){
	console.log('removing directed link')
	edge = evt.target;
	
	xlang.history.snapshot();
	xlang.vis.updateData('edges', [edge], {directed:false})
}
function reverseDirection(evt){
	console.log('reversing directed link')
	edge = evt.target;
	if(!edge.data.directed) return;
		
	var newEdge = {};
	newEdge.directed = true;
	newEdge.source =  edge.data.target;;	
	newEdge.target =edge.data.source;
	newEdge.style = edge.data.style;
	 
	xlang.history.snapshot();
	xlang.vis.removeEdge(edge);	
	xlang.vis.addEdge(newEdge, true);
	console.log('OKay')
}

function confirmEdge(evt){
	edge = evt.target;
	
	xlang.history.snapshot();
	xlang.vis.updateData('edges', [edge], {style:'SOLID'});
}
function addLink(evt){
	activeLinkEvent = evt; 
	node = evt.target;
		
	console.log("line start at " + evt.mouseX+", "+evt.mouseY);
	var fDim = getFlashDimensions();
	var oDim =  getOverlayDimensions();
	 
	startPoint.x = Math.round( evt.target.rawX  * oDim.width / fDim.width );
	startPoint.y =  Math.round( evt.target.rawY  * oDim.height / fDim.height );  
	$("#cyoverlay").css("zIndex", 100);
}
function editNode(evt){
	node = evt.target;
	winwin = Ext.create('xlang.view.NodeEditor', {
	    title: 'Edit Node'
	});
	winwin.setNode(node);
	winwin.show();
	
	
}
function addNode(evt){
	var x = evt.mouseX;
	var y = evt.mouseY;
	var win = Ext.create('Ext.window.Window', {
	    title: 'Add New Node',
	    height: 200,
	    width: 400,
	    layout: {type:'vbox', align:'stretch'},
	    items:

	    [{
	        // Fieldset in Column 1 - collapsible via toggle button
	        xtype:'fieldset',	         
	        //title: 'Fieldset 1',
	        collapsible: true,
	        defaultType: 'textfield',
	        defaults: {anchor: '100%'},
	        layout: 'anchor',
	        items :[{
	            fieldLabel: 'Label',
	            name: 'field1',
	            id:"newNodeLabel"
	        }, {
	            fieldLabel: 'Desc',
	            name: 'field2'
	        }]
	    },
	    {
	    	xtype:'button',
	    	text:'Add',
	    	handler: function(){
	    		var label = Ext.getCmp('newNodeLabel').getValue();
	    		if(!label) return;
	    		
	    		xlang.history.snapshot();
	    		xlang.vis.addNode(
	    	    			x, y, {id: label, label: label}, true 
	    	    		)
	    		win.destroy();
	    	}
	    }
	    ]
	    	
	}).show();
}
function deleteNode(evt){
	xlang.history.snapshot();
	var node = evt.target;
	xlang.vis.removeNode(node);
	
}
function deleteEdge(evt){
	xlang.history.snapshot();
	var edge = evt.target;
	xlang.vis.removeEdge(edge);
}


var History = function(){
	this.stack = [];
	this.snapshot  = function(){
		var model = xlang.vis.networkModel();
		this.push(model);
	}
	this.undo = function(){
		var model = this.pop();
		if(model)
			drawModel(model);
	}
	this.push = function(network){
		this.stack.push(network);
	}
	this.pop = function(){
		return this.stack.pop();
	}
	
}


function drawModel(network){
	if(!network) {
		console.error("Network is null ")
		return
	}
	var draw_options = {
	        // your data goes here
	        network: network.getModel? network.getModel(): network  ,                  
	        // show edge labels too
	        edgeLabelsVisible: true,                    
	        // let's try another layout
	        layout: "Tree",                    
	        // set the style at initialisation
	        visualStyle: vstyle,                    
	        // hide pan zoom
	        panZoomControlVisible: true 
	    };
	xlang.vis.draw(draw_options);
}
var vstyle = {
        global: {
            backgroundColor: "#ABCFD6"
        },
        nodes: {
            borderWidth: 3,
            borderColor: "#ffffff",
            size: 25,
            /**{
                defaultValue: 25,
                continuousMapper: { attrName: "weight", minValue: 25, maxValue: 75 }
            },*/
            color: {
            	passthroughMapper: { attrName: "color" }
            },
            label: {
            	passthroughMapper: { attrName: "id" }
            },
            labelHorizontalAnchor: "center",
            shape: {
            	passthroughMapper: { attrName: "shape" }
            }
        },
        edges: {
        	style:'DOT',
            width: 1,
            hoverOpacity:0.5,
            color: {
            	passthroughMapper: { attrName: "color" }
            },
            style:{
            	 discreteMapper: {
                     attrName: "style",
                     entries: [
                         { attrValue: 'DOT', value: "DOT" },                         
                         { attrValue: 'SOLID', value: "SOLID"}
                     ]
                 }
            }
        }
    };
