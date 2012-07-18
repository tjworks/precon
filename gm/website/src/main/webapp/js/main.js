$(function(){
	function version(str){
		var digits = str.split(".");
		var ret = [];
		
		$.each(digits, function(i, digit){
			ret.push( parseInt(digit) );
		});
		
		ret.sanitize = function(length){		
			for(var i = 0; i < length; i++){
				if( ret[i] == null ){
					ret[i] = 0;
				}
			}
		};
		
		ret.lessThan = function(other){
			var max = Math.max(ret.length, other.length);
			ret.sanitize(max);
			other.sanitize(max);
			
			for(var i = 0; i < max; i++){
				if( ret[i] < other[i] ){
					return true;
				} else if( ret[i] > other[i] ){
					return false;
				}
			}
			
			return false;
		};
		
		ret.equalTo = function(other){
			var max = Math.max(ret.length, other.length);
			ret.sanitize(max);
			other.sanitize(max);
			
			for(var i = 0; i < max; i++){
				if( ret[i] != other[i] ){
					return false;
				}
			}
			
			return true;
		};
		
		ret.greaterThan = function(other){
			return !ret.equalTo(other) && !ret.lessThan(other);
		};
		
		return ret;
	}
	
	var defaultNetworks;
	var minIEVersion = 8;
	var notSupportedIEVersion = minIEVersion - 1;
    
	var minFirefoxVersion = version("6");
	var minWebkitVersion = version("533");
	
    /**********************************************
    disable native language spellcheck
    otherwise, when we add one, there could be
    two underlines at once
    
    NOTE: affects only items with "widget" css
    class
    **********************************************/			
    // firefox fix
    $(".widget").attr("spellcheck", false);
    
   
   
    /**********************************************
    IE fixes
    **********************************************/
    
    if( $.browser.msie && parseInt( $.browser.version ) <= 6 ) {

        // fix images
        $("div, img").each(function(){
            var img;
            var needsFix = false;
            
            var bg = $(this).css("background-image");
            if( bg.match(/url/g) ) {
                img = bg;
                img = img.substring( img.indexOf("\"") + 1 );
                img = img.substring( 0, img.indexOf("\"") );
                needsFix = true;
            } else if( $(this).attr("src") ) {
                img = $(this).attr("src");
                $(this).attr("src", "img/etc/pixel.gif");
                needsFix = true;
            }
            
            if(needsFix) {
                $(this).css({
                    "background-image" : "none",
                    "filter" : "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img + "', sizingMethod='crop')"
                });
            
            }
        });

        
    } 
    
    var old_browser = false;
    
    if( $.browser.msie ) {
        $("#relatedGenes").after("<div id='dont_use_ie' class='line warning'></div>");
        
        $("#dont_use_ie").prepend('<div class="box"></div>');
        
        if( parseInt( $.browser.version ) <= notSupportedIEVersion ){
        	$("#relatedGenes").hide();
    	
        	$("#dont_use_ie .box").append('<p class="text">You have Internet Explorer ' + $.browser.version + ' installed.  \
        	GeneMANIA has conditionally dropped support for versions prior to ' + minIEVersion + '.  Please \
        	<a href="http://microsoft.com/windows/internet-explorer">upgrade Internet explorer</a> or use an \
        	alternate browser&mdash;such as <a href="http://google.com/chrome">Chrome</a>.  If you would like to comment on this, \
        	you can <a href="http://pages.genemania.org/contact">contact us</a>.</p>');
        } else {
        
          $("#dont_use_ie .box").append('<p class="text">We apologise if you experience any glitches or slow script dialog\
			boxes when using our site with Internet Explorer (IE). IE is not a\
			standards-compliant browser and sometimes interprets our instructions\
			in surprising ways.  If these issues interfere with your enjoyment of\
			GeneMANIA, may we suggest you try <a href="http://google.com/chrome">Chrome</a>.</p>');
		}
	} else if( $.browser.webkit ){
    	if( version($.browser.version).lessThan(minWebkitVersion) ){
    		old_browser = true;
    	}
    } else if( $.browser.mozilla ){
    	if( version($.browser.version).lessThan(minFirefoxVersion) ){
    		old_browser = true;
    	}
    } else {
    	$("#relatedGenes").after('<div class="line warning">Your browser is not supported by GeneMANIA. ' +
    		'We recommend you use <a href="http://google.com/chrome">Google Chrome</a>.</div>');
    	
    	$("#relatedGenes").hide();
    }
    
    if( old_browser ){
    	$("#relatedGenes").after('<div class="line warning">We notice that you are running an older version of your browser and we cannot guarantee that all of GeneMANIA\'s ' +
    			'feature will work as designed. We recommend that you upgrade to a newer version to ensure the best possible GeneMANIA experience. Or you can use Google ' +
    			'Chrome which always stays up to date.</div>');
    }
    
    // debug box
    $("#debug_info").dialog({
    	autoOpen: false,
    	title: "Debug information",
    	width: 400,
    	height: 400
    });
    
    $("#debug_info .tabs").tabs();
    
    var timeout;
    var count = 0;
    var times = 3;
    var time = 1000;
    
   
    function toggle_debug(){
    	count = 0;
    	clearTimeout(timeout);
    	
    	if( $("#debug_info").is(":visible") ){
			$("#debug_info").dialog("close");
		} else {
			$("#debug_info").dialog("open");
		}
    }
    
    $("html").bind("keydown", function(e){
		if( e.which == 192 && e.shiftKey ){ // backtab with shift`
			toggle_debug();			
		} else if( e.which == 192 ){
			count++;

			if( count == 1 ){
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					count = 0;
				}, time);
			} else if( count >= times ){
				toggle_debug();
			}
		}
	});
   
   
    $("#debug_info_networks button").click(function(){
    	var networks = $("#debug_info_networks textarea").val().split("\n");
    	var ids = [];
    	
    	$.each(networks, function(i, network){
    		var id = parseInt(network);
    		
    		if( !isNaN(id) ){
    			ids.push(id);
    		}
    	});
    	
    	if( $(".query_network_checkbox[value=" + ids[0] + "]").size() == 0 ){
    		$(this).after(' <span class="done_message">Networks set</span>');
    		return;
    	}
    	
    	$(".query_network_checkbox").attr("checked", null);
    	
    	$.each(ids, function(i, id){
    		$(".query_network_checkbox[value=" + id + "]").attr("checked", true);
    	});
    	
 
    	updateParentChecks();
    	refreshAllGroupCounts();
    	
    	$(this).siblings(".done_message").remove();
    	$(this).after(' <span class="done_message">Networks set</span>');
    	var input = $(this);
    	setTimeout(function(){
    		input.siblings(".done_message").fadeOut(500);
    	}, 2000);
    });
    
});