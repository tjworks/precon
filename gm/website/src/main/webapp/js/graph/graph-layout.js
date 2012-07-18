CytowebUtil.recomputeLayout = function() {
//console.log("recompute layout");
	
	if(_vis) {
		$("#graph").showLoader({ message: "Resetting layout..." });

		var layout = { name: "ForceDirected", options: { weightAttr: "weight", restLength: 15 } };

		// Apply Force Directed Layout, but ignore co-expression and co-localization networks,
		// unless they are the only ones:
		var filterEdges = false;
		var linksToFilterOut = false, linksToFilterIn = false;
		var edges = _vis.edges();
		$.each(edges, function(i, e) {
			if (e.visible) {
				if (e.data.networkGroupCode !== "coexp" && e.data.networkGroupCode !== "coloc") {
					linksToFilterIn = true;
				} else {
					linksToFilterOut = true;
				}
			}
			if (linksToFilterOut && linksToFilterIn) {
				filterEdges = true;
				return true;
			}
		});
		
		if (linksToFilterIn) {
			layout.options.gravitation = -200;
//				layout.options.restLength = 15;
//				layout.options.autoStabilize = false;	
		}
		
		if (filterEdges) {
			var finalFilterListener = function(){
				_vis.removeListener("filter", "edges", finalFilterListener);
				$("#graph").hideLoader();
			}
			
			var layoutListener = function() {
				_vis.removeListener("layout", layoutListener);
				
				_vis.addListener("filter", "edges", finalFilterListener);
				if (CytowebUtil._lastFilter == null) {
					_vis.removeFilter("edges", true);
				} else {
					_vis.filter("edges", CytowebUtil._lastFilter, true);
				}
			};
			
			var filterListener = function(evt) {
				_vis.removeListener("filter", "edges", filterListener);
				_vis.addListener("layout", layoutListener);
				_vis.layout(layout);
			};
			
			_vis.addListener("filter", "edges", filterListener);
			
			_vis.filter("edges", function(e) {
				var current = (CytowebUtil._lastFilter == null || CytowebUtil._lastFilter(e)); // The current filter should be kept!
				return current && e.data.networkGroupCode !== "coexp" && e.data.networkGroupCode !== "coloc"; 
			}, true);
		} else {
			var layoutListener = function() {
				_vis.removeListener("layout", layoutListener);
				$("#graph").hideLoader();
			};
			
			_vis.addListener("layout", layoutListener);
			_vis.layout(layout);
		}
		
	}
	
	
};