


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
	var observable = $({})
	
	this.on = function(eventType,  handler){
		observable.on(eventType, handler);
	}
	this.setModel=function(graphModel){
		this.model = graphModel		
		this.model.bind('add.connection', this._addLink)
		this.model.bind('add.node', this._addNode)
		this.model.bind("selectionchanged", this._selectionChanged)
	}
	this.getModel =function(){
		return this.model
	}	
	// register internal events handler	
	this.on('mouseover', function(evt, target){
		var r = $d(target).attr('r')
		console.log("Mouseover", $d(target))
		$d(target).classed('state-highlight', true).attr('r', r*2  )		
	})
	this.on('mouseout', function(evt, target){
		var r = $d(target).attr('r')
		$d(target).classed('state-highlight', false).attr('r', r/2  )				
	});
	this.on('click', function(evt, target){		
		graph.model.toggle(target.__data__)
	});	
	this._selectionChanged = function(evt, sel){
		//console.log("selected: ",sel.selected,  sel.target.getId(), $d( "[name="+ sel.target.getId() +"]" ))
		/**
		sel.target.forEach(function(target){
			$d( "[name="+ target.getId() +"]" ).classed('state-selected', sel.selected);
		})
		*/
		if(!graph.model) return
		var selections = graph.model.getSelections()
		nodearray.forEach(function(mynode){
			var selected = false;
			for(var i=0; i <selections.length; i++){
				var hisel =  selections[i]
				if(mynode.getId() == hisel.getId())
					selected = true;
			}	
			$d( "[name="+ mynode.getId() +"]" ).classed('state-selected', selected);
		});
		
				
	}
    // Add and remove elements on the graph object
    this.addNode = function (node, attrs) {
    	var id = null;
    	if(typeof(node ) == 'string'){
    		id = node
    		node={}
    	}
    	else{
    		id = node.getId()    		    	
    	}   
    	node.id = id
    	if(findNode(id)) return;    	
        nodearray.push(node);
        update();
    }
    this._addNode = function(evt, data){
    	//console.log("Adding node", data.node)
    	if(data.node)
    		graph.addNode(data.node)
    }
    this._addLink= function(evt, data){
    	console.log("Adding connection", data.connection, data.connection.getNodes())
    	if(data.connection ){
    			var nodes = data.connection.getNodes()
    			if(nodes && nodes.length ==2){    		
    				//console.log("Adding link "+ nodes[0]+", "+ nodes[1])
    				var link = data.connection
    				link.source = findNode(nodes[0].getId())    				
    				link.target= findNode(nodes[1].getId())
    				if(link.source && link.target && link.source!=link.target){
    					for(var i=0;i<linkarray.length;i++){
    					//	if(linkarray[i].getId() == link.getId()) return
    					}    					
    					//linkarray.push(link)
    					graph.addLink(nodes[0].getId(), nodes[1].getId(), data.connection.getType(), data.connection.getId())
    				}    					
    				//graph.addLink(nodes[0].getId(), nodes[1].getId(), data.connection.getType())
    			}
    	}    		    	
    }

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < linkarray.length) {
            if ((linkarray[i]['source'] == n)||(linkarray[i]['target'] == n)) linkarray.splice(i,1);
            else i++;
        }
        nodearray.splice(findNodeIndex(id),1);
        update();
    }
     //sid: the source id; did: the target id; flag: source/target order is ignored if true;
	 this.removeLink = function (sid,did,flag) {
        var i = 0;
        while (i < linkarray.length) {
        	if (typeof flag!="undefined") {
        		if (flag) {
        			if (((linkarray[i]['source'].id == sid) && (linkarray[i]['target'].id == did))||((linkarray[i]['source'].id == did) && (linkarray[i]['target'].id == sid))) 
        				linkarray.splice(i,1);
        			else 
        				i++;
        			}
        		else if ((linkarray[i]['source'].id == sid) && (linkarray[i]['target'].id == did)) 
        				linkarray.splice(i,1);
        			else 
        				i++;
        		}
        	else
        		if ((linkarray[i]['source'].id == sid) && (linkarray[i]['target'].id == did)) 
        			linkarray.splice(i,1);
            	else 
            		i++;
        }
        update();
    }
    
    this.addLink = function (source, target,type, id) {
    	if (findNode(source)!=null && findNode(target)!=null&&findNode(source)!=findNode(target)) {
    		var linkobj = {"source":findNode(source),"target":findNode(target), "type":type, "id":id, getId:function(){return this.id}, _id:id}
        	linkarray.push(linkobj);
    		update();
    	}
    }
     
    var findNode = function(id) {
        for (var i in nodearray) {if (nodearray[i]["id"] === id) return nodearray[i]};
        return null;
    }

    var findNodeIndex = function(id) {
        for (var i in nodearray) {if (nodearray[i]["id"] === id) return i};
    }

    // set up the D3 visualisation in the specified element
 
    
   // var w = $(el).innerWidth(),
   //     h = $(el).innerHeight(),
    
     var  r=6;
        
	var fisheye = d3.fisheye.circular()
	    .radius(10)
	    .distortion(2);
	
	//Create the SVG Canvas Environment    
    var vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("name","forcenet")
        .attr("height", h);
    
        /*
        .on("mousemove", function() {
                     console.log("moving...&calling fisheye");
                      fisheye.focus(d3.mouse(this));
                                                   vis.selectAll("circle").each(function(d) { d.fisheye = fisheye(d); })
                          .attr("cx", function(d) { return d.fisheye.x; })
                          .attr("cy", function(d) { return d.fisheye.y; })
                          .attr("r", function(d) { return d.fisheye.z * 4.5; });
                                               vis.selectAll("path").attr("d", function(d) { 
                              //console.log(d.target.fisheye);
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
    	
    	if(d3.event.detail >1){
    		console.log("It's a 2" + d3.event.detail)
    		observable.trigger('dblclick', d3.event.target, d3.event )
    	}
    	else{
    		observable.trigger(d3.event.type, d3.event.target, d3.event)
    	}    	
    	
    }
    var force = d3.layout.force()
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
    
    var update = function () {
	     //console.log(linkarray);
	     //console.log(nodearray);
	     //console.log("Updating")
	     var svg = d3.select(el).select("svg")
	     if(svg) svg.remove()
	     var vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("name","forcenet")
        .attr("height", h);
        
	       //Create the Marker for path arrow
	     var defs = vis.append("svg:defs");
     	 defs.selectAll("marker")
			.data(["decreases", "beinguptaken", "activates", "inhibits", "stimulats", "association", "physical_interaction", "predicted", "activates", "pathway"])
  			.enter()
  			.append("svg:marker")
		    .attr("id", String)
		    .attr("viewBox", "0 -3 13 13")
		    .attr("refX", 15)
		    .attr("refY", -1.5)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		    .append("svg:path")
		    .attr("d", "M0,-3L13,0L0,3");
	    
	      // if (typeof linkg =="undefined")
		  linkg=vis.append("svg:g");
		  link=linkg.selectAll("path")
	    	   .data(linkarray, function(d){return d.id});
	      link.enter()
	      .append("svg:path")
  		  .attr("id",function(d){return d.source.id+"---"+d.target.id})
		  .attr("class",function(d){return "link "+d.type;})
		  .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
	   
	      link.on("click", eventsProxy ).on("mouseover", eventsProxy ).on("mouseout", eventsProxy ).on("contextmenu", eventsProxy)
	      link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodearray, function(d) { return d.id;});

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")            
            .call(force.drag);
        
        nodeEnter.on("click", eventsProxy ).on("mouseover", eventsProxy ).on("mouseout", eventsProxy ).on("contextmenu", eventsProxy)

        nodeEnter.append("circle")
            .attr("class", "circle")
            .attr("name",function(d){return d.id})
           .attr("r",r);
           
	    
        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.getLabel()});

        node.exit().remove();
        var lastobj={"lastdr":0,
        			"lastsx":0,
        			"lastsy":0,
        			"lastdx":0,
    				"lastdy":0};
        
        force.on("tick", function() {
       	  link.attr("d", function(d) {
       	  	  
				   var dx = d.target.x - d.source.x,
				       dy = d.target.y - d.source.py,
				       dr = Math.sqrt(dx * dx + dy * dy);
			//	if (withinWindow(d)) { 
		/*
					   lastobj.lastdr=dr;
							   lastobj.lastsx=String.valueOf(d.source.x)
							   lastobj.lastsy=String.valueOf(d.source.y);
							   lastobj.lastdx=String.valueOf(d.target.x);
							   lastobj.lastdy=String.valueOf(d.target.y);*/
		
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
    };
    
    this.redraw = function(){
    	update()
    }
    // Make it all go
    update();
}

