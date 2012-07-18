
CytowebUtil._lastFilter = null; // filter function

CytowebUtil.filterNetworks = function() {

	if (_vis) {
		// Get checked network groups:
		var checkedGr = {};
		var halfcheckedGr = {};
		var count = 0;
		$("#networks_tab .checktree_top_level").each(function() {
			var id = $(this).attr("id").replace("networkGroup", "");
			if ( $(this).find(".checkbox:first").hasClass("checked") ) {
				checkedGr[id] = true;
			}
			if ( $(this).find(".checkbox:first").hasClass("half_checked") ) {
				halfcheckedGr[id] = true;
			}
			if ( $(this).find(".checkbox:first").size() > 0 ) {
				count++;
			}
		});

		// Get checked individual networks: 
		var checkedNet = {};
		for(var grId in halfcheckedGr){			
			$("#networkGroup" + grId).find(".checktree_network").each(function() {
				var id = $(this).attr("id").replace("network", "");
				if ($(this).find(".checked").length > 0) {
					checkedNet[id] = true;
				}
			});
		}
		//console.log("individual networks");
		//console.log(checkedNet);
		//console.log("groups");
		//console.log(checkedGr);
		
		if (count === $("#networks_tab .checktree_top_level > .checkbox.checked").length) {
			//console.log("All of the enabled checkboxes are checked");
			_vis.removeFilter("edges", true);
			CytowebUtil._lastFilter = null;
		} else {
			CytowebUtil._lastFilter = function(edge) {
				//console.log("Checking edge:");
				//console.log(edge);

				var grId = edge.data.networkGroupId;
				//console.log("Check the group " + edge.data.networkGroupId + " first, which is faster:");
				if ( checkedGr[grId] ) {
					//console.log("all of group " + grId + " checked");
					return true;
				} else if( halfcheckedGr[grId] ){
					if( $("#networkGroup" + grId).find(".checkbox.half_checked").size() > 0 ){
						//console.log("Still have to verify each individual network since group " + grId + " is half checked");
						var networksMap = edge.data.networkIdToWeight;
						//console.log("Edge has networks: ");
						//console.log(networksMap);
						
						for (var id in networksMap) {
						    if ( checkedNet[id] ) {
						    	//console.log("The edge (" + edge.data.id + ") has at least one checked network (" + id + ")");
						    	return true;
						    }
						}
					} else {
						//console.log("Group " + grId + " is fully checked so edge is OK");
						return true;
					}''
				} else {
					//console.log("No networks checked for edge");
					return false;
				}
				
			};
			_vis.filter("edges", CytowebUtil._lastFilter, true);
		}
	}
};
