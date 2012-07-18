CytowebUtil.highlightFirstNeighbors = function(nodes) {
		if (nodes == null) {
			nodes = _vis.selected("nodes");
	}
	
	if (nodes != null && nodes.length > 0) {
		var fn = _vis.firstNeighbors(nodes, true);
		var neighbors = fn.neighbors;
		var edges = fn.edges;
		edges = edges.concat(fn.mergedEdges);
		neighbors = neighbors.concat(fn.rootNodes);
        var bypass = _vis.visualStyleBypass() || {};
		
		if( ! bypass.nodes ){
            bypass.nodes = {};
        }
        if( ! bypass.edges ){
            bypass.edges = {};
        }

		var allNodes = _vis.nodes();
		$.each(allNodes, function(i, n) {
		    if( !bypass.nodes[n.data.id] ){
		        bypass.nodes[n.data.id] = {};
		    }
			bypass.nodes[n.data.id].opacity = 0.25;
	    });
		$.each(neighbors, function(i, n) {
		    if( !bypass.nodes[n.data.id] ){
		        bypass.nodes[n.data.id] = {};
		    }
			bypass.nodes[n.data.id].opacity = 1;
		});

		var opacity;
		var allEdges = _vis.edges();
		allEdges = allEdges.concat(_vis.mergedEdges());
		$.each(allEdges, function(i, e) {
		    if( !bypass.edges[e.data.id] ){
		        bypass.edges[e.data.id] = {};
		    }
		    if (e.data.networkGroupCode === "coexp" || e.data.networkGroupCode === "coloc") {
		    	opacity = CytowebUtil.AUX_UNHIGHLIGHT_EDGE_OPACITY;
		    } else {
		    	opacity = CytowebUtil.DEF_UNHIGHLIGHT_EDGE_OPACITY;
		    }
			bypass.edges[e.data.id].opacity = opacity;
			bypass.edges[e.data.id].mergeOpacity = opacity;
	    });
		$.each(edges, function(i, e) {
		    if( !bypass.edges[e.data.id] ){
		        bypass.edges[e.data.id] = {};
		    }
		    if (e.data.networkGroupCode === "coexp" || e.data.networkGroupCode === "coloc") {
		    	opacity = CytowebUtil.AUX_HIGHLIGHT_EDGE_OPACITY;
		    } else {
		    	opacity = CytowebUtil.DEF_HIGHLIGHT_EDGE_OPACITY;
		    }
			bypass.edges[e.data.id].opacity = opacity;
			bypass.edges[e.data.id].mergeOpacity = opacity;
		});

		_vis.visualStyleBypass(bypass);
		CytowebUtil.neighborsHighlighted = true;
		
		$("#menu_neighbors_clear").removeClass("ui-state-disabled");
		

	}
};

CytowebUtil.clearFirstNeighborsHighlight = function() {
	if (_vis) {
		var bypass = _vis.visualStyleBypass();
		bypass.edges = {};
		
		var nodes = bypass.nodes;
		for (var id in nodes){
			var styles = nodes[id];
			delete styles["opacity"];
			delete styles["mergeOpacity"];
		}
		
		_vis.visualStyleBypass(bypass);
		CytowebUtil.neighborsHighlighted = false;
		$("#menu_neighbors_clear").addClass("ui-state-disabled");
	}
};