$(function(){
	
	if( $("#phrase_and_go").size() == 0 && $("#query_line").size() == 0 ){
		return; // ignore this js file if no query area
	}
	
    $(".default_networks_link").live("click", function(){
    	
    	$("#network_selection_select_default").trigger("click");
    	
    	var link = $(this);
   		
		if( link.hasClass("also_submit") ){
			link.parents(".qtip").hide();
			$("#findBtn").click();
		}
    	
    	return false;
    });
    
    $.fn.updateChecktreeItem = function() {
    	var groupId = $(this).attr("group");
    	var organism = $(this).attr("organism");
    	var children_inputs = $(".query_network[group="+groupId+"][organism="+organism+"]").filter(".valid").find("input[type=checkbox]");
    	var parent_input = $(".query_network_group[group="+groupId+"][organism="+organism+"] input[type=checkbox]");
    	var all = children_inputs.size();
    	var checked = children_inputs.filter(":checked").size();
    	
//    	console.log("updateChecktreeItem");
//    	
//    	console.log(this);
//    	
//    	console.log("group: " + groupId);
//    	console.log("organism: " + organism);
//    	
//    	console.log("all: " + all);
//    	console.log("checked: " + checked);
    	
    	parent_input.attr("checked", checked > 0);
    	if (checked == 0 || all == checked) {
    		parent_input.removeClass("half_checked");
    	} else {
    		parent_input.addClass("half_checked");
    	}
    	
    	if( parent_input.is(":checked") && !parent_input.hasClass("half_checked") ){
    		children_inputs.attr("checked", true);
    	} else if( !parent_input.is(":checked") ){
    		children_inputs.removeAttr("checked");
    	}
    	
    	if( all == 0 ){
//    		console.log("remove parent check");
    		parent_input.removeAttr("checked");
    	}
    };
    
    $("#network_selection_select_all").click(function() {
    	$(".query_network_group input").filter("[organism=" + $("#species_select").val() + "]").removeClass("half_checked");
    	$("#networkTree input").filter("[organism=" + $("#species_select").val() + "]").attr("checked", true);
    	
    	var uploaded_group_input = $(".query_network_group input").filter("[organism=" + $("#species_select").val() + "][group=0]");
    	var uploaded_inputs = $(".query_network input").filter("[organism=" + $("#species_select").val() + "][group=0]");
    	if( uploaded_inputs.size() == 0 ){
    		uploaded_group_input.removeAttr("checked");
    	}
    	
    	validateTree();
    	refreshAllGroupCounts(); 
    	
    	return false;
    });
    
    $("#network_selection_select_none").click(function() {
    	$(".query_network_group input").filter("[organism=" + $("#species_select").val() + "]").removeClass("half_checked");
    	$("#networkTree input").filter("[organism=" + $("#species_select").val() + "]").attr("checked", false);
    	validateTree();
    	refreshAllGroupCounts(); 
    	
    	return false;
    });
    
    $("#network_selection_select_default").click(function() {
    	restoreDefaultNetworks();
    	validateTree();
    	refreshAllGroupCounts(); 
    	
    	return false;
    }).addClass("selected_sorting");
    
    $(".query_network, .query_network_group").live("mouseover", function() {
    	$(this).addClass("select_hover")	
    });
    
    $(".query_network, .query_network_group").live("mouseout", function() {
    	$(this).removeClass("select_hover")	
    });
    
	// query networks sorting
	$("#network_sorting_sortByFirstAuthor").click(
    	function() {
    		queryNetworksSortingCriteria = "FirstAuthor";
    		sortQueryNetworks();
    		
    		return false;
    	}
    );
    $("#network_sorting_sortByLastAuthor").click(
    	function() {
    		queryNetworksSortingCriteria = "LastAuthor";
    		sortQueryNetworks();
    		
    		return false;
    	}
    );
    $("#network_sorting_sortByPubDate").click(
    	function() {
    		queryNetworksSortingCriteria = "PubDate";
    		sortQueryNetworks();
    		
    		return false;
    	}
    );
    $("#network_sorting_sortByNetworkSize").click(
    	function() {
    		queryNetworksSortingCriteria = "NetworkSize";
    		sortQueryNetworks();
    		
    		return false;
    	}
    );
   
    
	addNetworkCheckBoxListeners();
	
    
    
});