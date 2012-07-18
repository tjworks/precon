;(function($){
    
	var options;
	var map = {};
	
    $.i18n = function(opts){
    	var defaults = {
            file: "/i18n"
        };
        
    	if( typeof(opts) == "string" ){ 
    		var message = opts;
    		
    		return map[message];
    	} else {
    		options = $.extend(defaults, opts);
    		
    		$.ajax({
    			url: options.file,
    			cache: false, // never cache the file to avoid sync issues
    			async: false,
    			contentType: "text/plain",
    			dataType: "text",
    			mimeType: "text/plain",
    			success: function(data){
    				var lines = data.match(/.+/g);
    			
	    			for(var i = 0; i < lines.length; i++){
	    				var line = lines[i];
	    				
	    				var match = line.match(/(\S+)\s*\=\s*(.+)/);
	    				
	    				if( !match ){
	    					continue;
	    				}
	    				
	    				var variable = match[1];
	    				var value = match[2];
	    				
	    				if( value.match(/^\s+$/) ){
	    					value = null;
	    				}
	    				
	    				map[variable] = value;
	    			}
    			}
    		});    		
    	}
    }
   
    
})(jQuery);  