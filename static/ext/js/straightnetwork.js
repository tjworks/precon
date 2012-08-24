function myGraph(el,w,h) {

    // Add and remove elements on the graph object
    this.addNode = function (id) {
        nodearray.push({"id":id});
        update();
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
    
    this.addLink = function (source, target,type) {
    	if (findNode(source)!=null && findNode(target)!=null&&findNode(source)!=findNode(target)) {
        	linkarray.push({"source":findNode(source),"target":findNode(target), "type":type});
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
	    
    var vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("name","forcenet")
        .attr("height", h);
        
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
    var force = d3.layout.force()
        .gravity(.01)
        .distance(200)
        .charge(-100)
        .size([w, h]);

    var nodearray = force.nodes(),
        linkarray = force.links();
    var withinWindow=function(d) {
    	if ((d.target.x<0) || (d.target.y<0) ||(d.target.x>w) ||(d.target.y>h)|| (d.source.x<0) || (d.source.y<0) ||(d.source.x>w) ||(d.source.y>h) ) {
    		return false;}
    	else return true;
    };
    
    var update = function () {
	      //log.debug(linkarray);
	      //log.debug(nodearray);
	      
	     // if (typeof linkg =="undefined")
		      linkg=vis.append("svg:g");
		  link=linkg.selectAll("path")
	    	   .data(linkarray);
          link.enter().append("svg:path")
           		   .attr("id",function(d){return d.source.id+"---"+d.target.id})
        		   .attr("class",function(d){return "link "+d.type;});
       

          link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodearray, function(d) { return d.id;});

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("circle")
            .attr("class", "circle")
            .attr("name",function(d){return d.id})
           .attr("r",r);
           
	    
        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) {return d.id});

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
        
        //create the context menu
    };
    

    // Make it all go
    update();
}