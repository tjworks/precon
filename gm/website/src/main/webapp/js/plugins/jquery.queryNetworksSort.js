(function($){  
    $.fn.queryNetworksSort = function(options) {  
        var defaults = {
            criteria: "FirstAuthor",
            descending: false
        };
        var options = $.extend(defaults, options); 
        function sortNetworks(networks, criteria, descendingFlag) {
    	    var keyField;
            if(criteria == "FirstAuthor") {
            	keyField = "input[id^='networkAuthors']";
        	    descending = descendingFlag
            } else if(criteria == "LastAuthor") {
            	keyField = "input[id^='networkAuthors']";
        	    descending = descendingFlag;
            } else if(criteria == "PubDate") {
            	keyField = "input[id^='networkPubDate']";
        	    descending = !descendingFlag
            } else if(criteria == "NetworkSize") {
            	keyField = "input[id^='networkInteractionCount']";
        	    descending = !descendingFlag;
            }
        	$(".query_network_group").each(         	
               	function() {
            		var id = $(this).attr("id");
            		var groupId = $(this).attr("group");
            		var organism = $(this).attr("organism");
            	    var items = $(".query_networks[group="+groupId+"][organism="+organism+"]").children(".query_network");
            	    items.sort(
        	        	function(x, y) {
        	                var ret;
        	                var xVal = "";
        	                var yVal = "";
        	                if(criteria == "FirstAuthor") {
    	                		xVal = "zzz";
        	                	var xtext = $(x).find(keyField).val();
        	                	if(xtext) {
        	                		xVal = xtext;
        	                		if(xtext.indexOf(", ") > 0) {
        	                			xVal = xtext.substring(0, xtext.indexOf(", "));
        	                		}
        	                	}
    	                		yVal = "zzz";
        	                	var ytext = $(y).find(keyField).val(); 
        	                	if(ytext) {
        	                		yVal = ytext;
        	                		if(ytext.indexOf(", ") > 0) {
        	                			yVal = ytext.substring(0, ytext.indexOf(", "));
        	                		}
        	                	}
        	                } else if(criteria == "LastAuthor") {
    	                		xVal = "zzz";
        	                	var xtext = $(x).find(keyField).val(); 
        	                	if(xtext) {
        	                		xVal = xtext;
        	                		if(xtext.lastIndexOf(", ") > 0) {
        	                			xVal = xtext.substring(xtext.lastIndexOf(", ")+2);
        	                		}
        	                	}
    	                		yVal = "zzz";
        	                	var ytext = $(y).find(keyField).val(); 
        	                	if(ytext) {
            	    	            yVal = ytext;
            	    	            if(ytext.lastIndexOf(", ") > 0) {
            	    	            	yVal = ytext.substring(ytext.lastIndexOf(", ")+2)
            	    	            }
        	                	}
        	                } else if(criteria == "PubDate") {
        	    	            xVal = $(x).find(keyField).val() || "";
        	    	            yVal = $(y).find(keyField).val() || "";
        	                } else if(criteria == "NetworkSize") {
        	    	            xVal = $(x).find(keyField).val() || "";
        	    	            yVal = $(y).find(keyField).val() || "";
        	                }
        	                // use integer values if possible
        	                var xFloat = parseFloat(xVal);
        	                var yFloat = parseFloat(yVal);
        	                if( isFinite(xFloat) && isFinite(yFloat) ) {
        	                    xVal = xFloat;
        	                    yVal = yFloat;
        	                } else {               
        	                    xVal = $.trim(xVal).toLowerCase();
        	                    yVal = $.trim(yVal).toLowerCase();
        	                }
        	                if(xVal < yVal) {
        	                    ret = -1;
        	                } else if ( xVal > yVal ) {
        	                    ret =  1;
        	                } else {
        	                    ret = 0;
        	                }
        	                if(!descending) {
        	                    return ret;
        	                } else {
        	                    return -1 * ret;
        	                }
        	                return ret;
        	        	}
        	        );
                    $.each(items, function(i, val){
                    	$(".query_networks[group="+groupId+"][organism="+organism+"]").append(val);
                    });
               	}
        	);
        }
        return sortNetworks( $(this), options.criteria, options.descending );
    };
})(jQuery);  
