


/***
 * 
 * Events:
 * 	selectionchanged
 *  mouseover
 *  mouseout
 *  click
 *  dblclick
 *  
 *  
 * 
 * @param el
 * @param w
 * @param h
 * @returns
 */
function myGraph(el,w,h) {
	$d = d3.select;
	var graph = this;
	var rectSelectMode = true; // by default drag mode is true
	var observable = $({})
	var graphZoom, graphDrag;
	
	this.on = function(eventType,  handler){
		observable.on(eventType, handler);
	}
	this.setModel=function(graphModel){
		this.model = graphModel		
		this.model.bind('add.connection', this._addLink)
		this.model.bind('add.node', this._addNode)
		this.model.bind("selectionchanged", this._selectionChanged);
		
		this.model.bind('remove.connection',this._removeLink);
		this.model.bind('remove.node', this._removeNode);
				
		//this.model.bind('add.network', function(){ update()  })
	}
	this.getModel =function(){
		return this.model
	}	
	// register internal events handler	
	this.on('mouseover', function(evt, target){
		var r = $d(target).attr('r')
		$d(target).classed('state-highlight', true)		
	})
	this.on('mouseout', function(evt, target){
		var r = $d(target).attr('r')
		//$d(target).classed('state-highlight', false).attr('r', r/2  )
		$d(target).classed('state-highlight', false)				
	});
	this.on('click', function(evt, target){
		
		if(! target.__data__ || (target.__data__._class!='connection' && target.__data__._class!='node' )) return
		//log.debug("clicked", target)
		if(d3.event.ctrlKey || d3.event.shiftKey){
			log.debug("Ctrl clicked", target.__data__)
			stuff = target.__data__
			graph.model.select(target.__data__, true)
		}
		else
			graph.model.toggle(target.__data__, false)
	});	
	
	this.highlight = function(objId, on){
		var selector = ''
		if(objId.indexOf('netw') == 0 )
			selector = '[network*='+ objId +']'
		else if(objId.indexOf('publ') == 0)
			selector = '[refs*='+ objId.substring(4) +']'
		else return
				
		_.each( $('path'+ selector),  function(em){
			$d(em).classed("state-highlight", on)
		})
		_.each( $('circle'+ selector),  function(em){
			$d(em).classed("state-highlight", on)
		})
		//$("path").fi
	}
	
	this.setRectSelectMode=function(mode){
		rectSelectMode = mode
		console.log("rectSelectMode :", mode)
		if(rectSelectMode){
			// we use d3.behavior.drag() behavior events to perform the rect select drawing
			viszoompang.call(graphDrag)			

			// disable zoom
		    viszoompang.on("mousedown.zoom", null)		 
		        //.on("mousewheel.zoom", null)
		        .on("mousemove.zoom", null)
		        //.on("DOMMouseScroll.zoom", null)
		        .on("dblclick.zoom", null)
		        .on("touchstart.zoom", null)
		        .on("touchmove.zoom", null)
		        .on("touchend.zoom", null);		        
		}
		else{
			// enable zoom
			viszoompang.call(graphZoom)
			
			// disabling drag behavior because it interferes with zoom's mouse up events			
			viszoompang.on("mousedown.drag", null)
		    viszoompang.on("touchstart.drag", null);
		}		
	},
	
	this._selectionChanged = function(evt, sel){
		/**
		sel.target.forEach(function(target){
			$d( "[name="+ target.getId() +"]" ).classed('state-selected', sel.selected);
		})
		*/
		if(!graph.model) return
		
		nodearray.forEach(function(mynode){		
			//log.debug("node is ", mynode)
			$d( "[id="+ mynode.getId() +"]" ).classed('state-selected', mynode.selected);			
		});
		
		linkarray.forEach(function(mylink){						
			$d( "[id="+ mylink.getId() +"]" ).classed('state-selected', mylink.selected);
		});
				
	}
    this._addNode = function(evt, data){
    	if(!data.node) return
    	var node = data.node
    	//	graph.addNode(data.node)
    	var id = node.get('id')
    	node.id = id
    	if(findNode(id)) return;    	
        nodearray.push(node);
        update();
    }
    this._removeNode=function(evt, data){
    	//log.debug("_removeNode ", data)
    	if(!data.node) return
    	nodearray.splice(findNodeIndex(data.node.getId()),1);
        update();
    }
    this._removeLink = function(evt, data){
    	//log.debug("_remove ", data)
    	if(!data.connection) return
    	linkarray.splice(findLinkIndex(data.connection.getId()),1);
    	update();
    }
    this._addLink= function(evt, data){
    	//log.debug("Adding connection", data.connection)
    	if(data.connection ){
    			var nodes = data.connection.getNodes()
    			if(nodes && nodes.length ==2){    		
    				//log.debug("Adding link "+ nodes[0]+", "+ nodes[1])
    				var link = data.connection
    				
    				link.source = findNode(nodes[0].getId())    				
    				link.target= findNode(nodes[1].getId())
    				if(link.source && link.target && link.source!=link.target){
    					    					
        				var linkobj = {"type":link.get('type'), "id":link.get('id'), getId:function(){return this.id}, "multiplier":processLinkArray(link.source,link.target)}
        				$.extend(link, linkobj);
    					
    					linkarray.push(link)
    					update()
    					//graph.addLink(nodes[0].getId(), nodes[1].getId(), data.connection.getType(), data.connection.getId())
    				}    					
    				//graph.addLink(nodes[0].getId(), nodes[1].getId(), data.connection.getType())
    			}
    	}    		    	
    }
    
    /*
     * This status flat is used to flag if a node/link is double clicked; if not, we can go ahead to zoom in the map 
     */
    this.doubleClicked=false
    
    /*
     * scale defines the scale of the graph
     */
    this.scale=1
    
     //Return true if a directoned link already exists, other return false;
    var processLinkArray=function(s,d) {
    	var count=0;
    	linkarray.forEach(function(alink){
    		if (alink.source.id==s && alink.target.id==d) count++;
    	});
    	var a=Math.random()-0.5;
    	a=a/Math.abs(a);
    	if (count>1) return (1+ Math.random()*6*count);
    	else return 1+Math.random()/10;
    }
    
    var findNode = function(id) {
        for (var i in nodearray) {if (nodearray[i]["id"] === id) return nodearray[i]};
        return null;
    }

    var findNodeIndex = function(id) {
        for (var i in nodearray) {if (nodearray[i]["id"] === id) return i};
    }
    var findLinkIndex = function(id) {
        for (var i in linkarray) {if (linkarray[i]["id"] === id) return i};
    }

    // set up the D3 visualisation in the specified element
 
    
   // var w = $(el).innerWidth(),
   //     h = $(el).innerHeight(),
    
     var  r=12;
        
	var fisheye = d3.fisheye.circular()
	    .radius(10)
	    .distortion(2);
	
	//Create the SVG Canvas Environment    
  /*
    var vis = d3.select(el).append("svg:svg")
          .attr("width", w)
          .attr("name","forcenet")
          .attr("height", h);
      */
  
        /*
        .on("mousemove", function() {
                     log.debug("moving...&calling fisheye");
                      fisheye.focus(d3.mouse(this));
                                                   vis.selectAll("circle").each(function(d) { d.fisheye = fisheye(d); })
                          .attr("cx", function(d) { return d.fisheye.x; })
                          .attr("cy", function(d) { return d.fisheye.y; })
                          .attr("r", function(d) { return d.fisheye.z * 4.5; });
                                               vis.selectAll("path").attr("d", function(d) { 
                              //log.debug(d.target.fisheye);
                            var dx = d.target.fisheye.x - d.source.fisheye.x,
                            dy = d.target.fisheye.y - d.source.fisheye.py,
                            dr = Math.sqrt(dx * dx + dy * dy);
                            return "M" + d.source.fisheye.x + "," + d.source.fisheye.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.fisheye.x + "," + d.target.fisheye.y;
                         }); 
                                                                                   });;*/
        
        
    //draw a reference rectangel
    /*
    vis.append("svg:rect")
           .attr("width",w)
           .attr("height",h)
           .style("stroke","#000")
           .style("fill","none");
    */
    var eventsProxy= function(obj){
    	//console.log("event got", d3.event)
    	if(d3.event.detail >1){    		
    		myGraph.doubleClicked=true
    		observable.trigger('dblclick', d3.event.target, d3.event )
    	}
    	else{
    		observable.trigger(d3.event.type, d3.event.target, d3.event)
    	}    	    	
    };
    
    force = d3.layout.force()
        .gravity(.01)
        .distance(200)
        .charge(-100)
        .size([w, h]);

     nodearray = force.nodes(),
        linkarray = force.links();
    var withinWindow=function(d) {
    	if ((d.target.x<0) || (d.target.y<0) ||(d.target.x>w) ||(d.target.y>h)|| (d.source.x<0) || (d.source.y<0) ||(d.source.x>w) ||(d.source.y>h) ) {
    		return false;}
    	else return true;
    };
    
    /*
     * get point on the edge of circles
     * 
     * @params x1,y1,r1, the parameters for source circle1
     * @params x2,x2,r2, the parameters for source circle2
     * 
     */
    var getPointOnCircle=function(x1,y1,r1,x2,y2,r2) {
		  var dx=x2-x1,                    
		      dy=y2-y1;
		  if ( (r1+r2)*(r1+r2) >= dx*dx+dy*dy ) return null;
		  var a=Math.atan2(dy,dx), 
		  	  c=Math.cos(a), 
		  	  s=Math.sin(a);
		  var result= [{"x":x1+c*r1,"y":y1+s*r1},
		          {"x":x2-c*r2,"y":y2-s*r2}
		  ];
		  return result;
    }
    
   /*
    * initialize the SVG drawing environment
    * 
    */
  
		
    var initSVG=function () {
    	 log.debug("initializing the network graph....");
	     vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("name","forcenet")
        .attr("height", h)
        .attr("pointer-events", "all");
        
        vis.append("svg:defs");
        //Create the Marker for path arrow. Delayed to allow the vis created first
		// vis.select("defs").selectAll("marker").remove();
		 vis.select("defs").selectAll("marker")
		.data(["decreases", "beinguptaken", "activates", "inhibits", "stimulats", "association", "physical_interaction", "predicted", "activates", "pathway"])
 			.enter()
 			.append("svg:marker")
	    .attr("id", String)
	    .attr("viewBox", "0 -4 13 13")
	    .attr("refX", 15)
	    .attr("refY", 0)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	    .append("path")
	    .attr("d", "M0,-4L10,0L0,4");
	   
		graphZoom = d3.behavior.zoom().on("zoom",redraw );
		graphDrag = d3.behavior.drag()
			 	.on('dragstart', eventsProxy)
			 	.on('dragend', eventsProxy)
				.on("drag",eventsProxy)
	 		
		 viszoompang = vis.append('svg:g');
		 viszoompang.call(graphZoom);

			
         visg=viszoompang.append("svg:g");
    			
		 visg.append('svg:rect')
		    .attr('width', w)
		    .attr('height', h)
		    .attr('fill', 'white')
		 vis.on("click", eventsProxy ).on("contextmenu", eventsProxy);
		 		/**
		 
        visg=vis.append('svg:g')
    			.call(d3.behavior.zoom().on("zoom", redraw))
    			.append("svg:g");
    			
		visg.append('svg:rect')
		    .attr('width', w)
		    .attr('height', h)
		    .attr('fill', 'green')
		vis.on("click", eventsProxy ).on("contextmenu", eventsProxy);
		//visg.on('mousedown',recSelect('down')).on('mouseup',recSelect('up')).on('mousemove',recSelect('move'));
		*/		
 	} 
 	  
   var recSelect=function (flag) {
    	if (flag=='down') {
    		log.debug('rectangle selction is on');
    		//visg.on('mousemove',_graphController.recSelect('move'));
    		log.debug(d3.event);
    		if (d3.selectAll('#selectRect')[0].length==0 && d3.event)
	    		selectRectangle=visg.append('svg:rect')
	    							.attr('x',d3.event.clientX)
	    							.attr('y',d3.event.clientY)
	    							.attr('width',200)
	    							.attr('height',200)
	    							.attr('fill','red')
	    							.attr('id','selectRect');
    	}
    		
    	if (flag=='move') {
    		/*
			 d3.selectAll('#selectRect')[0]
							 .attr('width',20)
							 .attr('height',20);*/
			
    	}
    	
    	if (flag=='up') {
			visg.on('mousemove',null);
    	}
   };
 	
 	var redraw=function() {
  		//log.debug("here is the scale: "+d3.event.scale);
  		if (! myGraph.doubleClicked && d3.event.scale>=0.5 && d3.event.scale<=6 ) {
  			myGraph.scale=myGraph.scale
	  		visg.attr("transform",
			      "translate(" + d3.event.translate + ")"
			      + " scale(" + d3.event.scale + ")");
	        force.start();
	        myGraph.doubleClicked=false;
       }
       else 
       		myGraph.doubleClicked=false;
 	}
 	
 	var _combineRefs = function(refs){
 		  if(!refs) return ''
 		  if(typeof(refs) == 'string') return refs
		  var str = ''
		  for(var i in refs){						  
			  if(typeof(refs[i]) == 'string')
				  str+=refs[i]					  	
			  else if(refs[i].length>0) 
				  str+= refs[i].join(",")
			  str+=","
		  }
		  return str
 	}
    /*
     * update the SVG canvas to reflect the data changes
     */
    var _update = function(){
    	clearTimeout(window.graphUpdateTrigger)
    	window.graphUpdateTrigger = null
	     //log.debug(linkarray);
	     //log.debug(nodearray);
	     //log.debug("Updating")
		 timer = Timer("Updating Graph")
		  //Check if SVG has been initialized
	     //if(typeof vis=="undefined") initSVG();
	  
      
		//create links
		link=visg.selectAll("path")
	    	   .data(linkarray, function(d){return d.id});
	      
	    var linkenter=link.enter();
	      
		    linkenter
		    	  //.append("g")
			      //.attr("render-order","-1")
			      .append("path")
		  		  .attr("id",function(d){return d.id})
		  		  .attr("network", function(d){ return d.get('network') })		  		  
				  .attr("class",function(d){return "link "+d.type.replace(" ","").replace("/","_");})
				  .attr("marker-end", function(d) { return "url(#" + d.type.replace(" ","") + ")"; })
				  .attr("refs", function(d){ return _combineRefs(d.get('refs'))});
		    
		   
		    link.on("mouseover", eventsProxy ).on("mouseout", eventsProxy )
		      
		    link.exit().remove();  
	
		
		 var lastobj={"lastdr":0,
        			"lastsx":0,
        			"lastsy":0,
        			"lastdx":0,
    				"lastdy":0};
        
            var node = visg.selectAll("g.node").remove();
            
            var node = visg.selectAll("g.node")
            .data(nodearray, function(d) { return d.id;});
		
   			var nodeEnter = node.enter();
	        var nodeEnterg=nodeEnter.append("g")
	            //.attr("render-order","1")
	            .attr("class", "node")
	            .attr("network", function(d){
	            	return d.networkrefs+""
	            })
	            .call(force.drag);
	          
	        nodeEnterg.append("circle")
	            .attr("class", "circle")
	            .attr("name",function(d){return d.id})           
	            .attr("id",function(d){return d.id})
	            .attr("network", function(d){
	            	return d.networkrefs+""
	            })
	            .attr("r",r);
	            
	        nodeEnterg.append("text")
	            .attr("class", "nodetext")
	            .attr("dx", -r)
	            .attr("dy", ".35em")
	            .text(function(d) {return d.getLabel()});
	            
	        nodeEnterg.on("mouseover", eventsProxy ).on("mouseout", eventsProxy )
        	 	
        node.exit().remove();
	    
		
        force.on("tick", function() {
       	  link.attr("d", function(d) {
       	  	       //insert a random disturbance to allow multiple links between two points. 
				   var dx = d.target.x - d.source.x,
				       dy = d.target.y - d.source.py,
				       dr = Math.sqrt(dx * dx + dy * dy)*d.multiplier;
				   
				  
				  
			//	if (withinWindow(d)) { 
		/*
					   lastobj.lastdr=dr;
							   lastobj.lastsx=String.valueOf(d.source.x)
							   lastobj.lastsy=String.valueOf(d.source.y);
							   lastobj.lastdx=String.valueOf(d.target.x);
							   lastobj.lastdy=String.valueOf(d.target.y);*/
				   	   if(!d.source.x) log.debug
				   	   var pnts=getPointOnCircle(d.source.x,d.source.y,r,d.target.x,d.target.y,r);
				   	   if (pnts) {
					   	   var a=pnts[0];
					   	   var b=pnts[1];
					   	   return "M" + a.x + "," + a.y + "A" + dr + "," + dr + " 0 0,1 " + b.x + "," + b.y;
				   	  }
				   	  else
					   return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
			//	}
			 //   else {
			//           return "M" + lastobj.lastsx + "," + lastobj.lastsy + "A" + lastobj.lastdr + "," + lastobj.lastdr + " 0 0,1 " + lastobj.lastdx + "," + lastobj.lastdy;
			           
			//    }
		  });
		  
          //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
        	  .attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y)); })
        	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });;
          
        });

        // Restart the force layout.
        force.start();
        
        graph._selectionChanged()
        
        timer.elapsed("Graph size: " + nodearray.length +" nodes, "+ linkarray.length+" links")        
    };
    var update = function () {
    	if(!window.graphUpdateTrigger)
    		graphUpdateTrigger = setTimeout(_update, 50);    	
    };
    
    // delete this?
    this.resize = function(width, height){
    	w= width
    	h=height
    	if(vis){
    		vis.remove()
    		visg.remove()
    		initSVG()
    	}
    	update()
    }
    
    // Make it all go
    initSVG();
    update();
}
