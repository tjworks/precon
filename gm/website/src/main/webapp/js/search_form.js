$(function(){
	
	if( $("#phrase_and_go").size() == 0 && $("#query_line").size() == 0 ){
		return; // ignore this js file if no query area
	}
	
    
    /***************************************************************************
	 * species entry behaviour
	 **************************************************************************/
	var validationErrFlag = false;
	
	// autocomplete setup
	
    var species = new Array();
    $("#species_select > option").each(function(){
        species.push( $.trim($(this).text()) );
    });

    var alias = new Array();
    $("#species_select > option").each(function(i){
        var str = $(this).attr("alias");
    	alias.push( $.trim(str) );
    });
    
    var speciesAndAliases = new Array();
    for(var i in species) {
    	speciesAndAliases.push( species[i] );
    }
    for(var i in alias) {
    	speciesAndAliases.push( alias[i] );
    }

    $("#species_text").autocomplete(speciesAndAliases, {
        minChars: 2,
        matchContains: true,
        matchSubset: true,
        max: 5,
        selectFirst: true,
        autoFill: false,
        matchCase: false,
        focusFieldAfterCancel: false,
        focusFieldAfterSelect: false,
        delay: 10,
        onSetValue: updateSpecies,
        scroll: false
    }).bind("keydown", function(e){
    	if( e.which == 13 ){
    		return false; // do not submit form on enter
    	}
    });
    
    function validSpecies(spc) {
        for(var i in species) {
            if( spc == species[i] ) {
                return true;
            }
        }
        return false;
    }
    
    function validAlias(als) {
    	var ret = false;
    	if(als) {
	    	for(var i in alias) {
	            if( als == alias[i] ) {
	                ret = true;
	                break;
	            }
	        }
    	}
        return ret;
    }

    function getSpeciesFromAlias(als) {
    	var ret = null;
    	if(als) {
	    	for(var i in alias) {
	            if(alias[i] == als ) {
	                ret = species[i];
	                break;
	            }
	        }
    	}
        return ret;
    }
    
    function getIdForSpecies(spc){
    	for(var i in species){
    		if( species[i] == spc ){
    			return parseInt(i) + 1;
    		}
    	}
    	
    	return undefined;
    }
    
    function getIdForAlias(als){
    	for(var i in alias){
    		if( alias[i] == als ){
    			return parseInt(i) + 1;
    		}
    	}
    	
    	return undefined;
    }
    
    // clear on click of text box for convenience
    $("#species_text").focus(function() {
        $(this).val("");
    }).blur(function(){
    	updateSpecies();
    });
    
    function updateSpecies() {
        var val;
        
        try{
        	val = $("#species_text").val().trim();
        } catch(e){
        	val = null;
        }
        
//        console.log("--");
//        console.log(val);
        
        if( !val  || val == "" ) {
//        	console.log("grab from select on empty");
            resetSpeciesToSelectBoxVal();
        } else if( validSpecies(val) ) {
//        	console.log("set value to select on valid species");
            $("#species_select").val( getIdForSpecies(val) ).trigger("change");
        } else if( validAlias(val) ) {
//        	console.log("set value to select on valid alias");
            $("#species_text").val( getSpeciesFromAlias(val) );
			$("#species_select").val( getIdForAlias(val) ).trigger("change");
        } else {
//        	console.log("grab from select on invalid");
        	resetSpeciesToSelectBoxVal();
        }
        
    }
    
    $("#species_select").change(function(){
		var value = $(this).val();
		var option = $("#species_select option[value=" + value + "]");
		
		$("#posted_networks").remove();
		
		track("Species", "Change", option.text());
	});
    
    function resetSpeciesToSelectBoxVal() {
    	$("#species_text").val( $("#species_select option:selected").text() );
    }
    
    // on drop down button click, show menu
    $("#species_drop_down_closed").click(function() {
        // replace button
        $(this).hide();
        $("#species_drop_down_open").show();
        
        // replace widget
        $("#species_closed").css("visibility", "hidden");
        $("#species_open").show();
        
        // fancy ani
        $("#species_select").fadeIn(ANI_SPD, function(){
            $(this).focus();
            // $(this).scrollTop( $("#species_select
			// option:selected").offset().top );
        });
    });
    
    // on select blur, show the text box again
    $("#species_select").blur(function(){
        // replace button
        $("#species_drop_down_open").hide();
        $("#species_drop_down_closed").show();
    
        // replace widget
        $("#species_open").fadeOut(ANI_SPD);
        $("#species_closed").css("visibility", "visible");
        
        // fancy ani
        $(this).hide("slide", { direction: "up" }, ANI_SPD);
    });
    
    // close on select of menu
    $("#species_select").click(function(){
        $(this).blur();
    });
    
    // reset text value with value from select
	var prev_species = $("#species_select").val();
    $("#species_select").change(function() {
	    var current_species = $(this).val();
	    
	    if( current_species != prev_species ){
			$("#species_text").val( $("#species_select option:selected").text() );
			
			clearErrors();
			
			if( $("#advanced_options_open").is(":visible") ){
				loadNetworks();
			} 			
			
			invalidateGeneForOrganismChange();
			
			if( genesTouched() ){
				last_organism = $("#species_select").val();
				validateGeneSymbols();
			}
        }
        
	    prev_species = $("#species_select").val();
    });
    
//	if( $("#species_text").val() !="" ){
//    	$("#species_text").trigger("blur");
//    }
    
    
	/***************************************************************************
	 * radio buttons for weighting
	 **************************************************************************/
	$(".network_weighting_group input").change(function(){
		var id = $(this).attr("id");
		var label = $("label[for=" + id + "]");
		
		track("Network weighting", "Change", label.text());
	});
	
	/***************************************************************************
	 * Number of gene results
	 **************************************************************************/
	$("#threshold").change(function(){
		track("Number of gene results", "Change", $(this).val());
	});
	
    /***************************************************************************
	 * gene entry box behaviour
	 **************************************************************************/
    var genesOpen = false;
    
    // on focus of text line, replace with text area (i.e. bigger box)
    $("#gene_text").focus(function(){

        // tab focus fix (i.e. press tab and focus gene_text from gene_area =>
		// creates bad state)
        if(genesOpen) {
            $(this).css("visibility", "visible").blur();
        } else {
        
            // replace widget
            $("#gene_closed").css("visibility", "hidden");
            $("#gene_open").show();
            
            // fancy ani
            $("#gene_area").fadeIn(ANI_SPD, function(){
                $(this).focus(); // must focus after ani
//                var scrollToVal = $(this).attr("scrollHeight");
//                $(this).attr("scrollTop", scrollToVal);
                genesOpen = true;
            });
        
        }
    });
    
    var gene_timeout;
    var gene_delay = 750;
    
    function update_text_from_area(){
		// replace text
        var text = new String( $("#gene_area").val() );

        // remove blank lines
        while( text.search(/\n(\s)*\n/) >= 0 ) {
            text = text.replace(/\n(\s)*\n/g, "\n");
        }
        // left trim
        text = $.trim(text);
                
        // newline <-> ; for gene_text box summary
        var newlineToSemi = text.replace(/\n/g, "; ");
        var noSemiAtEnd = $.trim(newlineToSemi).replace(/;$/, ""); 
        $("#gene_text").val(noSemiAtEnd);
    }
    
    // on blur of text area, show text line instead (i.e. shrink bigger box)
    var gene_area_val;
    
    function trigger_hide_tooltip(){
		$("#gene_area").trigger("hidetooltip");
    }
    
    $(window).bind("blur", function(e){
    	trigger_hide_tooltip();
    });
    
   
    $("body").bind("mousedown mouseup", function(e){ 
    
    	var target = $(e.target);

    	var inside_area = false;
    	var inside_tooltip = false;
    	target.parents().andSelf().each(function(){
    		if(  $(this).hasClass("gene_error_tooltip") ){
    			inside_tooltip = true;
    		}
    	
    		if( $(this).attr("id") == "gene_area" ){
    			inside_area = true;
    		}
    	});
    	
    	if( !inside_area && !inside_tooltip ){
    		trigger_hide_tooltip();
    	} 
    	
    	if( inside_tooltip ) {
    		return false;
    	}
    	
    });
    
    if( $("#gene_area").val() != "" ){
// console.log("some genes already entered");
    	update_text_from_area();
		validateGeneSymbols();
    }
    
    updateGeneCount();
    
    var too_many_genes_message = "<p>Because you have more than " + maxNumberOfGenes() + " genes in your list, the web " + 
	"version of GeneMANIA does not support your query.</p> " +
	"<p>We suggest you try the <a href='page/plugin'>GeneMANIA Cytoscape plugin</a>, which can handle very large number of genes.</p>";

    function adjust_icons_from_scroll(){
    	
    	$("#gene_validation_icons").css({
    		top: -1 * $("#gene_area").scrollTop(),
    		left: -1 * $("#gene_area").scrollLeft()
    	});
    	
    }
    
    
    var last_gene_area_val = "";
    var last_organism = $("#species_select").val();
    var last_valid_max_gene_list = true;
    $("#gene_area").focus(function(){
    	$("#gene_area").trigger("showtooltip");
    	$("#gene_area").trigger("adjusttooltipposition");
    }).blur(function(e){
        // replace widget
    	$("#gene_closed").css("visibility", "visible");
        $("#gene_open").fadeOut(ANI_SPD);

		update_text_from_area();
		validateGeneSymbols();
        
        $(this).hide();
        genesOpen = false; // TODO remove this genesOpen variable and use
							// $("#genes_open").is(':visible') instead
		
    	$("#gene_list").val($("#gene_text").val());
    	
    }).bind("keyup keydown paste change", function(e){	
		
		// console.log("--\ngene key event");
		// console.log(e);
		
		// console.log("caret location: ");
		// console.log("index: ");
		// console.log( $(this).caret() );
		// console.log( $(this).val()[ $(this).caret().end - 1 ] + "|" +
		// $(this).val()[ $(this).caret().end ] );
		
    	if( e.type != "keydown" ){
    	
	    	var number_of_genes = numberOfGenes();
	    	var max_number_of_genes = maxNumberOfGenes();
	    	
	    	updateGeneCount();
  
	    	if( number_of_genes > max_number_of_genes ){
	    		$("#gene_validation_icons .icon").attr("type", "empty").attr("class", "icon empty");
	    		
	    		$("#gene_selection").removeClass("loading");
	    		
	    		if( last_valid_max_gene_list ){
		    		showGeneError("error", "Too many genes", too_many_genes_message);
		    	}
	    		
	    		last_valid_max_gene_list = false;
	    		
	    		return;
	    	} else {
	    		last_valid_max_gene_list = true;
	    	}
    	}
    	
		function key_is_meta(code){
			switch(code){
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
				case 17: // control
				case 18: // alt
				case 91: // command
				case 27: // escape
				case 16: // shift
				case 20: // caps lock
					return true;
				default:
					return false;
			}
		}
		
		function key_is_enter(code){
			return code == 13;
		}
		
		function key_is_backspace(code){
			return code == 8;
		}
		
		function key_is_delete(code){
			return code == 46;
		}
		
		function key_edits(code){
			return !key_is_meta(code);
		}
		
		// don't trigger anything on just a meta key (shift, alt, etc)
		if( !key_edits(e.which) ){
			// do nothing
		} else if( $("#gene_area").is(":visible") ) {
			
			// clear all icons iff blank
			if( $("#gene_area").val() == "" || $("#gene_area").val().match(/^\s*$/g) ){
				// console.log("empty val icons");
				$("#gene_validation_icons .icon").attr("type", "empty").attr("class", "icon").attr("tooltip", "");
				
		    	adjust_icons_from_scroll();
			}
		
			function update_qtip_position(){
				// update position
				$(".qtip[qtipfor=gene_selection]").each(function(){
					$(this).qtip("api").updatePosition();
				});
			}
			
			var cursor_char = $(this).caret().end;
			var val = $(this).val();
			
			function lines(include_last_char){
				var cursor_ch = cursor_char;
				
				if( include_last_char == undefined ){
					include_last_char = true;
				}
				
				if( !include_last_char ){
					cursor_ch--;
				}
			
				var line = 0;
				for(var i = 0; i < val.length && i < cursor_ch; i++){
					if( val[i] == "\n" ){
						line++;
					}
				}
				line_cache = line;
				
				return line;
			}
						
			function adjust_to_line(forwards){		
				adjustValidationIcons( (forwards ? 1 : -1) * line() );
			}
			
			// handle new or removed lines
			if( e.type == "keydown" ){			
				if( key_is_enter(e.which) ){
				
					var line = lines(true);
					
					if( cursor_char > 0 &&  val[ cursor_char - 1 ] == "\n" ){
						// console.log("pressed enter key before newline");
						adjustValidationIcons( line - 1 );	
					} else if( val[ cursor_char ] == "\n" || val.substring(cursor_char).match(/^\s*\n.*/g) ){
						// console.log("pressed enter key after newline");
						adjustValidationIcons( line );
					} else {
						// console.log("just adjust the icons; normal enter key
						// press");
						resetValidationIcon( line );
						resetValidationIcon( line + 1 );
						adjustValidationIcons();
					}
					
					update_qtip_position();
				} else if( key_is_backspace(e.which) && cursor_char > 0 && val[cursor_char - 1] == "\n" ){
					var line = lines(false);
				
					// console.log("pressed backspace key after newline");
					
					if( (val[cursor_char - 1] + "") != "\n" ){
						resetValidationIcon( line );
					}
					
					adjustValidationIcons( -1 * line );
					update_qtip_position();
				} else if( key_is_delete(e.which) && val[cursor_char] == "\n" ){
					var line = lines(false);
				
					// console.log("pressed delete key before newline");
					
					if( ("" + val[cursor_char + 1]) != "\n" && cursor_char - 1 > 0 && val[cursor_char - 1] != "\n" ){
						resetValidationIcon( line );
					}
					
					resetValidationIcon( line + 1 );
					adjustValidationIcons( -1 * line );
					update_qtip_position();
				} 
			}
					
			if( e.type != "keydown" ){
				var new_ga_val = $("#gene_area").val();
				var new_org = $("#species_select").val();
				
		    	if( e.type == "paste" || new_org != last_organism || last_gene_area_val != new_ga_val ){
		    		clearTimeout(gene_timeout);
		    		clip_icons();
		    		setLoadingIconsForGenes();
		    		gene_timeout = setTimeout(function(){
						update_text_from_area();
						last_gene_area_val = new_ga_val;
						validateGeneSymbols();
					}, gene_delay);
		    	}
			}
    	
		}
    });
    
    function hscroll_on(){
    	// remove listener so we don't get a loop
		$("#gene_area").unbind("scroll", scroll_callback);
		
		var scroll = $("#gene_area").scrollLeft();
		var ret = false;
		
		$("#gene_area").scrollLeft(1);
		if( $("#gene_area").scrollLeft() == 1 ){
			$("#gene_area").scrollLeft(scroll);
			ret = true;
		}
		
		// add back the listener
		$("#gene_area").bind("scroll", scroll_callback);
		return ret;
	}
    
    function clip_icons(){
    	if( hscroll_on() ){
    		var height = $("#gene_area").height() - $.scrollBarSize();
    		var top = $("#gene_area").scrollTop();
    		
//    		console.log("scroll is on");
    		$("#gene_validation_icons").css("clip", "rect(" + top + "px,14px," + (top + height) + "px,0px)");
    	} else {
//    		console.log("scroll is off");
    		$("#gene_validation_icons").css("clip", "auto");
    	}
    }
    
    function scroll_callback(){
    	adjust_icons_from_scroll();
    	clip_icons();
    }
    $("#gene_area").bind("scroll", scroll_callback);

    // replace separators with newlines as you type
    // makes the cursor disappear on some browsers
    // won't work if genes need separators in their names
    // $("#gene_area").keypress(sepToNewLine).keydown(sepToNewLine).keyup(sepToNewLine);
    
    // Avoid bug introduced in FireFox 3.6 for Mac OS: the Flash player steals
	// the keydown event,
    // preventing the user from editing the textarea when it overlaps the
	// CytoWeb area.
    var ua = navigator.userAgent;
    var isBuggyFF = ua.indexOf("Firefox") > -1 && ua.indexOf("Mac OS X") > -1;
    var doNotExpand = isBuggyFF && $("#graphBox").length > 0;
     
    
    $("#gene_area").autoexpand({
        minLines: 5,
        maxLines: doNotExpand ? 5 : 20
    });
    
    /***************************************************************************
	 * escape key to blur
	 **************************************************************************/
    
    $("#gene_area").add("#species_select").add("#species_text").keydown(function(e) {
        if(e.which && e.which == 27) {
            $(this).trigger("blur");
        }
    });
    
    /* upload button */

    _uploading = false;
    function process_upload(data, status, request, error){
    	if(error == null){
    		error = data.error;
    	}
//    	console.log(data);
    	showUploadCompleted(data, error);
    	$("#uploadArea").removeClass("disabled");
    	
    	if( data.network != null ){
    		if( error ){
    			track("Upload", "Error", error);
    		} else {
    			track("Upload", "Success");
    		}
    	} else {
    		track("Upload", "Error", "No network was received from the server");
    	}
    	
    	_uploading = false;
    	$("body").trigger("uploadcomplete");
    }
    
    function upload(file, fileName){
    	_uploading = true;
    	
    	var organismId = $("#species_select").val();
    	
    	$("#uploadArea").addClass("disabled");
    	showUploadProgress(fileName);
    	
    	$.ajax({
    		url: absoluteUrl("json/upload_network"),
    		type: "POST",
    		data: { organism_id: organismId, file: file, file_name: fileName },
    		dataType: "json",
    		success: function(data, status, request){
//    			console.log(data);
//    			console.log(status);
//    			console.log(request);
    			
    			process_upload(data, status, request, null);
    		},
    		error: function(request, status, error){
//    			console.log(error);
//    			console.log(status);
//    			console.log(request);
    			
    			process_upload({ error: "no data" }, status, request, error);
    		}
    	});
    }
    jsUpload = function(file, name){
    	track("Upload", "Start", "File size (bytes)", file.length);
    	upload(file, name);
    }
    
    if( FlashDetect.versionAtLeast(MIN_FLASH_VERSION) ) {
    	// Use the flash upload component
    	var options = {
                swfPath: absoluteUrl("swf/Importer"),
                flashInstallerPath: absoluteUrl("swf/playerProductInstall"),
                data: function(data){
//    			console.log(data);
    				
    				track("Upload", "Start", "File size (bytes)", data.bytes.length);
    		
    				var str = "";
    				for(var i = 0; i < data.bytes.length; i++){
//    					console.log("character");
    					
    					var ch = String.fromCharCode( data.bytes[i] );
    					str += ch;
//    					
//    					console.log("character");
//    					console.log(ch);
    				}
//    				console.log(str);
    			
        			upload(str, data.metadata.name);
				},
	            ready: function(){
	            	// when the flash component is loaded
	            },
	            typeFilter: function(){
	                return "*";
	            },
	            binary: function(metadata){
	            	return true; // to return data.string and not data.bytes
	            } 
            };
            
        new org.cytoscapeweb.demo.Importer("uploadOverlay", options);
    } else {
    	$("#uploadOverlay").hide();
    }
    
	$("#uploadBtn").bind("click", function(){
		$('<div><p>You need to have <a href="http://get.adobe.com/flashplayer/">Flash</a> installed ' +
				'to use the upload feature.  Please <a href="http://get.adobe.com/flashplayer/">install Flash</a> ' +
				'and then reload GeneMANIA.</p> ' +
				'<p>You will need <a href="http://get.adobe.com/flashplayer/">Flash</a> installed if you want to view ' +
				'GeneMANIA\'s visualization, anyway.  So, it is advised that you install <a href="http://get.adobe.com/flashplayer/">Flash</a>. ' +
		'</div>').dialog({
			title: "You need Flash to upload",
			buttons: {
				"OK, return me to GeneMANIA": function(){ $(this).dialog("close"); }
			},
			modal: true,
			closeOnEscape: true,
	    	resizable: false,
	    	width: 300,
	    	minHeight: 0
		});
    });

    
    /***************************************************************************
	 * init disable go button and example
	 **************************************************************************/
    
    $(".default_networks_link").live("click", function(){
    	
    	$("#network_selection_select_default").trigger("click");
    	
    	var link = $(this);
   		
		if( link.hasClass("also_submit") ){
			link.parents(".qtip").hide();
			$("#findBtn").click();
		}
    	
    	return false;
    });
    
	$(".default_genes_link").live("mousedown", function(){
    	loadDefaultOrganismGenes();
    	var link = $(this);
    	
    	$("#gene_area").trigger("edit").trigger("paste");
    	
    	update_text_from_area();
    	updateGeneCount();
    	
		// setTimeout(function(){
			
			if( !link.hasClass("open") ){
    			validateGeneSymbols();
    		}
    		
    		if( link.hasClass("also_submit") ){
    			link.parents(".qtip").hide();
    			$("#findBtn").click();
    		}
		// }, gene_delay);
    		
    }).live("click", function(){
    	return false;
    });

    
    
    /***************************************************************************
	 * expandable advanced behaviour
	 **************************************************************************/
    // expand
    $("#advanced_options_closed .advanced_options_toggle a").click(function() {
    	// refreshTreeFlag = false;
    	// switch
        $("#advanced_options_closed").hide();
        $("#advanced_options").show();
        $("#advanced_options_open").show();
        $("#relatedGenes").addClass("advanced_open");
        $("#cytoscape_lite").addClass("advanced_open");
        $("#side_bar").addClass("advanced_open");
        // DO NOT USE the slide option!!! It rebuilds the tree, causing a bug
		// that
        // prevents the default networks to be checked.
        // ***********************************************************************
        // $("#advanced_options_open").show("slide", { direction: "up" },
		// ANI_SPD);
        // ***********************************************************************

        track("Advanced options", "Open");

        return false;
    });
    
    // close advanced on hide
    $("#advanced_options_open .advanced_options_toggle a").click(function() {	
        close_advanced_options();
        
        return false;

    });
    
    if( $("#results_page").size() > 0 ){
    
		$("#cytoscape_lite").add("#side_bar").add("#footer").add(".ui-layout-resizer").bind("mousedown", function(e){
			if( $("#advanced_options_open").is(":visible") ){
				close_advanced_options();
			}
		});
    
    }
    
    function close_advanced_options(){
        // switch
        $("#advanced_options_closed").show();
        $("#advanced_options_open").hide();
        // $("#advanced_options_open").fadeOut(ANI_SPD);
        $("#advanced_options").hide();
        $("#relatedGenes").removeClass("advanced_open");
        $("#cytoscape_lite").removeClass("advanced_open", ANI_SPD);
        $("#side_bar").removeClass("advanced_open", ANI_SPD);
        // DO NOT USE the slide option!!! It rebuilds the tree, causing a bug
		// that
        // prevents the default networks to be checked.
        // ***********************************************************************
        // $("#advanced_options").hide("slide", { direction: "up" }, ANI_SPD);
        // ***********************************************************************
        
        track("Advanced options", "Close");
    }

    /***************************************************************************
	 * network selection
	 **************************************************************************/
    
    var networkHelpDialog = $("#uploadHelpDialog").dialog({
    	autoOpen: false,
    	modal: true,
    	closeOnEscape: true,
    	resizable: false,
    	width: 400,
    	position: ["center", "center"],
    	buttons: {
			"OK, bring me back to GeneMANIA.": function(){ networkHelpDialog.dialog("close"); }
		}
    });
    
	$("#uploadHelpBtn").click(function() {
		networkHelpDialog.dialog("open");
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
    
	// find button setup
   
	$("#stopBtn").hide().bind("click", function(){
		$("#loading_line").css("visibility", "hidden");
		
		if( window.stop ){
			window.stop();
		} else if( $.browser.msie ){
			document.execCommand("Stop");
		}
		
		$("#findBtn").show();
    	$("#stopBtn").hide();
	});
    
    $("#findBtn").click(function(){
// console.log("--\n find button clicked");
    
    	if( isSubmittable() ){
    		$("#loading_line").css("visibility", "visible");
    		
    		// disable stop button for now
    		// $("#findBtn").hide();
    		// $("#stopBtn").show();
// console.log("find button in submittable state");
// console.log("remove networks for other organisms");
    		 $(".query_networks[organism!=" + $("#species_select").val() + "]").remove();
    		 $(".query_network_group[organism!=" + $("#species_select").val() + "]").remove();
    		 
    		$("#relatedGenes").submit();
    	} else {
// console.log("find button in NON submitable state");
    		
    		$("#loading_line").css("visibility", "hidden");
    		
    		function show_tooltip(msg, type){
				$("#findBtn").qtip({
					content: {
						text: msg,
						title: {
							text: 'Warning',
							button: '<div class="ui-state-error ui-corner-all"> <span class="ui-icon ui-icon-close"></span> </div>'
						}
					},
					show: {
						delay: 0,
						when: false,
						effect: { type: "fade", length: 0 },
						ready: true // Show the tooltip when ready
					},
					hide: {
						delay: 0,
						effect: { type: "fade", length: 0 },
						when: { event: "unfocus" }, // Hide when clicking
													// anywhere else
						fixed: true // Make it fixed so it can be hovered over
					},
					style: {
					   border: { width: 1, radius: 8 },
					   width: { min: 0
					   },
					   screen: true,
					   padding: 8, 
					   textAlign: 'left',
					   name: 'red', 
					   tip: true      // Give it a speech bubble tip with
										// automatic corner detection
					},
					position: {
						type: "absolute",
						adjust: { 
							screen: true
						},
						corner: {
						 	target: 'topMiddle',
						 	tooltip: 'bottomRight'
					  	}
					}
				});
				
				var qtip = $("body .qtip:last");
				
				qtip.qtip("api").onHide = function(){
					qtip.qtip("api").destroy();
				};
				
				qtip.attr("qtipfor", "findBtn");
				qtip.attr("errortype", type);
			}
    		
    		if( isValidating() ){
    			$("#loading_line").css("visibility", "visible");
// console.log("validating find button form submission");
    			
    			var interval = setInterval(function(){  			
    				if( !isValidating() ){
    					clearInterval(interval);
    					
    					if( inGeneErrorState() ){
    						$("#loading_line").css("visibility", "hidden");
// console.log("found error after waiting for find button validtion");
    					} else if( isSubmittable() ) {
// console.log("submit after waiting for find button validation");
    						$("#relatedGenes").submit();
    					} else {
// console.log("try again after waiting for find button validation");
    						$("#findBtn").click();
    					}
    					
    					
    				}
    			}, 100);
    		} else if( !validMaxGeneList() ){
    			show_tooltip(too_many_genes_message, "too_many_genes");
    		} else if( noGenesEntered() ){
    			validateGeneSymbols();
    			show_tooltip('<p>Please enter at least one gene, or <a href="#" class="action_link default_genes_link also_submit">try this example gene list</a>.</p>', "empty");
    		} else if( inGeneErrorState() ){
    			show_tooltip('<p>Please enter at least one valid gene, and then try again.</p>', "no_valid_genes");
    		} else if( areNetworksReloading() ) {
    			$("#loading_line").css("visibility", "visible");
// console.log("find button validation waiting for networks to reload");
    			
    			var interval = setInterval(function(){  			
    				if( !areNetworksReloading() ){
    					clearInterval(interval);
    					
    					if( isSubmittable() ){
// console.log("submit after waiting for submit button");
							$("#relatedGenes").submit();
						} else {
// console.log("try again after waiting for submit button");
							$("#findBtn").click();
						}
    				}
    			}, 100);
    		} else if( uploadingNetwork() ) {
    			$("#loading_line").css("visibility", "visible");
    			// console.log("find button validation waiting for networks to reload");
    			    			
    			    			var interval = setInterval(function(){  			
    			    				if( !uploadingNetwork() ){
    			    					clearInterval(interval);
    			    					
    			    					if( isSubmittable() ){
    			// console.log("submit after waiting for submit button");
    										$("#relatedGenes").submit();
    									} else {
    			// console.log("try again after waiting for submit button");
    										$("#findBtn").click();
    									}
    			    				}
    			    			}, 100);
    		} else if( noNetworksSelected() ) {
// console.log("no networks selected for find button");
    			
    			show_tooltip('<p>Please enable at least one network in the advanced options, or <a href="#" class="action_link default_networks_link also_submit">use the default networks</a>.</p>', "no_networks_selected");
    			
    		} else {
// console.log("something else is wrong for submitting the find button");
    		}
    		
    		
    		
    	}
    	
    	
    	
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
   
    
	$("#advanced_options_closed .advanced_options_toggle a").bind("click", function(){
		loadNetworks();
	});
	
	addNetworkCheckBoxListeners();
});



var _load_networks_last_org;
function loadNetworks(){

	$("#posted_networks").remove();
	
	var organism = $("#species_select").val();
	var first_load = $(".query_networks[organism=" + organism + "]").size() == 0;
    
//	console.log("loading networks for organism with id " + organism + " and need to fetch " + first_load);
	
	$("#networks_section_loading").show();
	
	function update_counts(){
		
		$(".query_network_group").each(function(){
			$(this).updateChecktreeItem();			
		});
		refreshAllGroupCounts();
	}
	
	function sort(){
		var sort_method = $("#advanced_options_open .selected_sorting.sort");
		
		if( sort_method.size() == 0 ){
			sort_method = $("#advanced_options_open .sort:first");
		}
		
		sort_method.click();
	}
	
	function show_only_selected_group(){
		var current_group = $(".query_network_group[organism=" + organism + "].selected");
		
		if( current_group.size() == 0 ){
			current_group = $(".query_network_group[organism=" + organism + "]:first");
			current_group.addClass("selected");
		}
		
		var id = current_group.attr("group");
		
		$(".query_network_group[organism=" + organism + "]").show();
		$(".query_network_group[organism!=" + organism + "]").hide();
		
		$(".query_networks[organism=" + organism + "]").filter("[group=" + id + "]").show();
		$(".query_networks[organism=" + organism + "]").filter("[group!=" + id + "]").hide();
		$(".query_networks[organism!=" + organism + "]").hide();
	}
	
	function finshed_loading(){
		
		if( organism == undefined || organism != _load_networks_last_org ){
			setTimeout(function(){
				sort();
				validateNetworks();
				show_only_selected_group();
				update_counts();
				$("#networks_section_loading").hide();
				$("#networks_section").trigger("load");
			}, 10);
			
		} else {
			$("#networks_section_loading").hide();
			$("#networks_section").trigger("load");
		}
		
		_load_networks_last_org = organism;
	}
	
	
	
	if( first_load ){
		
		function populate_cache(network_groups){
			var groups_map = {}; // name => group
			var group_names = [];
			var group_names_to_put_at_end = [];
 //console.log(network_groups);
			
			for(var i in network_groups){
				var group = network_groups[i];
				groups_map[group.name] = group;
				
				if(group.name != "Other" && group.name != "Uploaded"){
					group_names.push(group.name);
				} else {
					group_names_to_put_at_end.push(group.name);
				}
			}
			group_names.sort();
			
			for(var i in group_names_to_put_at_end){
				group_names.push( group_names_to_put_at_end[i] );
			}
			
			for(var i in group_names){
				var name = group_names[i];
        		var group = groups_map[name];
        		
        		$("#groupsPanel").append(
        			'<div id="queryGroup' + group.id + '" class="query_network_group" organism="' + organism + '" group="' + group.id + '">' +
                        '<span class="network-group-count text"><span class="selected_count" organism="' + organism + '" group="' + group.id + '" id="countSelectedNetworksFor' + group.id + '"></span>/<span class="all_count" organism="' + organism + '" group="' + group.id + '" id="countAllNetworksFor' + group.id + '"></span></span>' +
                        	'<input class="query_group_checkbox" type="checkbox" value="' + group.name + '" organism="' + organism + '" group="' + group.id + '" />' +
                        '<label id="networkGroupLabel' + group.id + '">' + group.name + '</label>' +
                    '</div>'
                );
        		
        		$("#networksPanel").append( '<div class="query_networks" id="networksFor' + group.id + '" organism="' + organism + '" + group="' + group.id + '"></div>' );
        		var networks = group.interactionNetworks;
        		
        		var html = "";
        		for(var j in networks){
        			var network = networks[j];
        			html += makeNetworkHtml(organism, group, network);
        		}
        		var container = $("#networksPanel .query_networks[group=" + group.id + "]");
        	    container.append(html);
        	}
			finshed_loading();
		}
		
		$.ajax({
    		cache: false,
    		success: function(data, status, request){
    			//console.log(data);
    			populate_cache(data);
    		},
    		dataType: "json",
    		data: {},
    		type: "GET",
    		url: absoluteUrl("json/network_groups/" + organism)
    	});
	} else {
		finshed_loading();
	}
}

var queryNetworksSortingCriteria = "FirstAuthor";
var queryNetworksDescendingSorting = false;
// var lastSortingCriteria;

function makeNetworkHtml(organism, group, network, error){
	function empty(str){
		if(str == undefined || str == null || str == ""){
			return true;
		} else {
			return false;
		}
	}
	
	function add_commas(nStr)
	{
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
	
	var html = "";
	
	html = 	'<div id="' + network.id + '" class="query_network ' + ( empty(error) ? 'valid' : 'error' ) + '" organism="' + organism + '" group="' + group.id + '" network="' + network.id + '">' +
				( !error ?
						'<input type="checkbox" class="query_network_checkbox" name="networks" value="' + network.id + '" group="' +
		            	group.id + '" organism="' + organism + '" id="net' + network.id + '" '
		            	+ (network.defaultSelected ? ' default="true" ' : ' default="false" ')
		            	+ ( $("#selected_networks [network=" + network.id + "]").size() > 0 ||
		            		( ($("#selected_networks").children().size() == 0 || $("#selected_networks").attr("organism") != $("#species_select").val()) && network.defaultSelected )
		            			?
		            		' checked="true" '
		            			: ''
		            		)
		            	+ '/>' 
					:
						'<span class="uploadError uploadStatusIcon"></span>'
				) +
	
				( network.id <= 0 ?
						'<span class="trashIcn"><span class="ui-icon ui-icon-trash"></span></span>'
					:
						''
				) +
            	            	
            	'<label>' + network.name + ( network.id <= 0 && !empty(network.metadata.comment) ? '<span class="date">&nbsp;' + network.metadata.comment + '</span>' : '' ) + '</label>' +
            	(!empty(network.metadata.authors) ? '<input type="hidden" id="networkAuthors' + network.id + '" value="' + network.metadata.authors + '"/>' : '') + 
            	(!empty(network.metadata.yearPublished) ? '<input type="hidden" id="networkPubDate' + network.id + '" value="' + network.metadata.yearPublished + '"/>' : '') +
            	(!empty(network.metadata.interactionCount) ? '<input type="hidden" id="networkInteractionCount' + network.id + '" value="' + network.metadata.interactionCount + '"/>' : '') +
            	'<div id="descriptionFor' + network.id + '" class="query_network_info text" organism="' + organism + '">' +
            		
            		( !empty(error) ?
            				( network.metadata.interactionCount > 0 ?
            						'<p>' + $.i18n("search_networks.info.error") + '</p>'
            					:
            						'<p>' + $.i18n("search_networks.info.no_interactions") + '</p>'
            				)
            			:
            				''
            		) +
            	
            		( !empty(network.metadata.authors) || !empty(network.metadata.url) || !empty(network.metadata.publicationName) ?
            				'<p class="ref">' + 
            					( !empty(network.metadata.url) && !empty(network.metadata.title) ? ' <a class="external_link" target="_blank" href="' + network.metadata.url + '">' + network.metadata.title + '</a>' : '' ) +
            					( !empty(network.metadata.authors) ? ' <span class="authors">' + network.metadata.authors.substring(0, network.metadata.authors.search(","))  + ' ' +  $.i18n("search_networks.info.etal") + '</span> ' : '' ) +
            					( !empty(network.metadata.yearPublished) ? ' <span class="year">(' + network.metadata.yearPublished + ').</span> ' : '' ) +
            					( !empty(network.metadata.publicationName) ? ' <span class="publication">' + network.metadata.publicationName + '.</span> ' : '' ) + 
            				'</p>'
            			:
            				''
            		) +
            		
            		( !empty(network.metadata.comment) && network.id > 0 ? 
            				'<p class="notice">' +
            					'<b>' + $.i18n("search_networks.info.comment_title") + '</b>' +
            					' <span class="comment">' + network.metadata.comment + '</span> ' +
            				'</p>'
        				:
        					''
            		) +
            		
            		( empty(error) && ( !empty(network.metadata.source) || !empty(network.metadata.processingDescription) ) ?
                			'<p><b>' + $.i18n("search_networks.info.source_title") + '</b>' +
                				( !empty(network.metadata.processingDescription) ? '<a href="page/help#section/network_categories" target="_blank">' + network.metadata.processingDescription + '</a>' : "" ) +
                				( !empty(network.metadata.interactionCount) ? (!empty(network.metadata.processingDescription) ? ' ' + $.i18n("search_networks.info.with") + ' ' : '') + add_commas(network.metadata.interactionCount) + ' ' + $.i18n("search_networks.info.interactions") : '' ) +
                				( network.metadata.source.toLowerCase() != 'collaborator' || !empty(network.metadata.reference) ? 
                						( ' ' + $.i18n("search_networks.info.from") + ' ' ) +
                						( network.metadata.source.toLowerCase() == 'collaborator' || network.id < 0 ?
                								network.metadata.source
                							:
                								' <a class="external_link" target="_blank" href="' + $.i18n("network_source.url." + ( network.metadata.reference != '' ? 'ref.' : '') + network.metadata.source) + '' + network.metadata.reference + '">' + $.i18n("network_source." + network.metadata.source) + '</a> '
                						)
                					:
                						' <span class="reference">' + network.metadata.reference + '</span> '
                				) +
                				( network.id <= 0 && !empty(network.metadata.comment) ?
                						 network.metadata.comment
            						:
            							''
                				) +
                			'</p>'
                		:
                			''
            		);
	
        			if( network.tags != null && network.tags.length > 0 ){
        				html +=	'<p><b>' + $.i18n("search_networks.info.tags_title") + '</b><span class="tags">';
        				
        					for(var k in network.tags){
        						var tag = network.tags[k];
        						html += tag.name.toLowerCase() + ( k < network.tags.length - 1 ? ",&#160;&#160;" : "");
        					}
        				
        				html += '</span></p>';
        			}
        			
        			if( network.metadata.invalidInteractions != null && network.metadata.invalidInteractions.length > 0 ){
        				html += '<p><b>' + $.i18n("search_networks.info.invalid_interactions_title") + '</b>';
        					
        					var interactions = [];
        					for(var k in network.metadata.invalidInteractions){
        						var interaction = network.metadata.invalidInteractions[k];
        						interactions.push(interaction);
        					}
        					
        					interactions.sort();
        					for(var k in interactions){
        						var interaction = interactions[k];
        						html += interaction + "; &#160;";
        					}
        				
        				html += '</p>';
        			}
    html +=     '</div>' +
            '</div>';
    
    
    
    return html;
}


$(function(){
	
	$(".trashIcn").live("mousedown", function(){
		var container = $(this).parents(".query_network");
    	var id = parseInt( container.attr("network") );
    	
    	deleteUserNetwork( container );
    	return false;
    });
	
});

function sortQueryNetworks() {
	// console.log("\nsorting query networks");

// if(lastSortingCriteria == queryNetworksSortingCriteria) {
// queryNetworksDescendingSorting = !queryNetworksDescendingSorting;
// }
	$("#networkTree").queryNetworksSort({criteria: queryNetworksSortingCriteria, descending: queryNetworksDescendingSorting});
	$("#network_sorting_sortByNetworkSize").add("#network_sorting_sortByFirstAuthor").add("#network_sorting_sortByLastAuthor").add("#network_sorting_sortByPubDate").removeClass("selected_sorting");
	$("#network_sorting_sortBy" + queryNetworksSortingCriteria).addClass("selected_sorting");
// lastSortingCriteria = queryNetworksSortingCriteria;
}

function restoreDefaultNetworks() {
	// console.log("--\n setting default networks");

	// reset all networks
	$("#networkTree input[organism=" + $("#species_select").val() + "]").filter("[default=false]").removeAttr("checked");
	// update networks
	$("#networkTree input[organism=" + $("#species_select").val() + "]").filter("[default=true]").attr("checked", "checked");
	// update groups
    $(".query_network_group").each(function() {
    	$(this).updateChecktreeItem();
    });
}

function default_networks_selected() {
	
	var inputs = $(".query_network_checkbox[organism=" + $("#species_select").val() + "]");
	var defaults = inputs.filter("[default=true]");
	var not_defaults = inputs.not("[default=true]");
	var unchecked_defaults = defaults.not(":checked");
	var checked_not_defaults = not_defaults.filter(":checked");
	
	return unchecked_defaults.size() == 0 && checked_not_defaults.size() == 0;
}

function refreshNetworks() {
	// console.log("refresh networks...");
	
	// restore previously selected networks
    var checkedList = window["checkedQueryNetworks"];

    if (checkedList != null) {
    	$(".query_networks input[type=checkbox]").attr("checked", false);
    	$.each(checkedList, function(i, id) {
            $("#"+id).attr("checked", true);
        });
        window["checkedQueryNetworks"] = null;
    }
	
    // Complete the networks tree styles:
    $(".query_network_group").each(function() {
    	$(this).updateChecktreeItem();
    	var grpId = $(this).attr("id").substring("queryGroup".length);
    	refreshCounts(grpId);
    });
    
    // validate again:
    validateNetworks();
}

function addNetworkCheckBoxListeners(){
	$(".query_network_group").live("click", function(evt) {
		if( $(evt.target).hasClass("query_group_checkbox") ){
			return;
		}
		
		var orgId = $(this).attr("organism");
		var groupId = $(this).attr("group");
		
		$(".query_networks").hide();
		$(".query_networks[organism=" + orgId + "][group=" + groupId + "]").show();
	
		// Highlight this item...
		$(".query_network_group, .query_network").removeClass("selected");
		$(this).removeClass("select_hover");
		$(this).addClass("selected");
		// ...and the info:
		$(".query_network_info[organism=" + $("#species_select").val() + "]").hide();
		
	    // adjust long network names
		$(".query_network label").each(function() {
			if($(this).width() > 270) {
				$(this).attr("tooltip", $(this).text());
			}
		});
	});
	
	$(".query_network_group input").live("click", function() {
		var checked = $(this).attr("checked") || $(this).hasClass("half_checked");
		
		var orgId = $(this).attr("organism");
		var groupId = $(this).attr("group");
		
		$(".query_networks[organism=" + orgId + "][group=" + groupId + "] input:checkbox").attr("checked", checked);
		
		$(this).updateChecktreeItem();
		validateTree();
		refreshCounts(groupId);
	});
	
	$(".query_network input").live("click", function(evt) {
		var groupId = $(this).attr("group");
		var organism = $(this).attr("organism");
		$(this).updateChecktreeItem();
		validateTree();
		refreshCounts(groupId);
		evt.stopPropagation();
	});
	
	$(".query_network").live("click", function(evt) {
		if( $(evt.target).hasClass("query_network_checkbox") || $(evt.target).parents().andSelf().hasClass("query_network_info") ){
			return;
		}
		
		var info = $(this).find(".query_network_info");
		
		$(".query_network").removeClass("selected");
		var visible = info.is(":visible");
		$(".query_network_info").filter("[organism=" + $("#species_select").val() + "]").hide();
		if (!visible) {
			$(this).addClass("selected");
			info.show();
			$(this).parent(".query_networks").scrollTo($(this), 50);
		}
	});
}

function updateInputNetworks() {
    refreshAllGroupCounts();
}

// #################################################################################################

function refreshCounts(grpId) {
	// console.log("refresh indiv");

	var allNetworks = $(".query_network.valid").find("input[type=checkbox][organism=" + $("#species_select").val() + "][group=" + grpId + "]");
	var allNetworksCount = allNetworks.size();
	var selectedNetworksCount = allNetworks.filter(":checked").size();
	$("#countAllNetworksFor" + grpId).text(allNetworksCount);
	$("#countSelectedNetworksFor" + grpId).text(selectedNetworksCount);
}

function refreshAllGroupCounts() {
	// console.log("refresh all");

	var inputs = $(".query_network_checkbox[organism=" + $("#species_select").val() + "]");
	var totalNetworksCount = inputs.size();
	var totalSelectedNetworksCount = inputs.filter(":checked").size();
	
	$(".query_network_group").each(function() {
		var grpId = $(this).attr("group");
		if(grpId != 0){
			refreshCounts(grpId);
		}
	});
	$("#totalNetworksCount").text(totalNetworksCount);
	$("#totalSelectedNetworksCount").text(totalSelectedNetworksCount);
	
	if( totalNetworksCount == totalSelectedNetworksCount ) {
	    $("#network_selection_select_all").addClass("selected_sorting");
	    $("#network_selection_select_none").add("#network_selection_select_default").removeClass("selected_sorting");
	} else if( totalSelectedNetworksCount == 0 ) {
	    $("#network_selection_select_none").addClass("selected_sorting");
	    $("#network_selection_select_default").add("#network_selection_select_all").removeClass("selected_sorting");
	} else if( default_networks_selected() ) {
	    $("#network_selection_select_default").addClass("selected_sorting");
	    $("#network_selection_select_none").add("#network_selection_select_all").removeClass("selected_sorting");
	} else {
	    $("#network_selection_select_none").add("#network_selection_select_all").add("#network_selection_select_default").removeClass("selected_sorting");
	}
	
	$("#species_select option").each(function(){
		var org = $(this).attr("value");
		var section = $(".query_networks[group=0][organism="+org+"]");
		var selectedUserNetworksCount = section.find("input:checked").size();
		var userNetworksCount = section.find(".query_network.valid").size();

		$(".network-group-count .selected_count[group=0][organism="+org+"]").html(selectedUserNetworksCount);
		$(".network-group-count .all_count[group=0][organism="+org+"]").html(userNetworksCount);
	});
	
	
	
	// console.log("end hide");
}

function refreshUserNetworksEventHandlers() {
	// console.log("refresh handlers...");

	$("div[id^='descriptionFor']").click(
		function(evt) {
			evt.stopPropagation();
		}
	);
	
	var UNNAMED_STRING = "Unnamed network upload";
	
	$("input[id^='networkNameEdit']").blur( function() {
		var networkId = $(this).attr("id").substring("networkNameEdit".length);
		var networkName = $(this).val();
		if ($.trim(networkName) == "") { networkName = UNNAMED_STRING; }
		var networkDescription = $("#networkDescriptionEdit"+networkId).val();
		updateUserNetworkInfo(networkId, networkName, networkDescription);
	});
	
	$("input[id^='networkNameEdit']").keyup(
		function() {
			var netId = $(this).attr("id").substring("networkNameEdit".length);
			var name = $(this).val();
			if( $.trim(name) == "" ) { name = UNNAMED_STRING; }
			
			$("#" + netId + " label").html(name);
		}
	).bind("blur", function(){
		if( $.trim($(this)).val() == "" ){
			$(this).val(UNNAMED_STRING);
		}
	}).bind("focus", function(){
		if( $.trim($(this).val()) == UNNAMED_STRING ){
			$(this).val("");
		}
	}).bind("keydown", function(e){
		if( e.which == 13 ){
			return false;
		}
	});
	
	$("textarea[id^='networkDescriptionEdit']").blur(function() {
		var networkId = $(this).attr("id").substring("networkDescriptionEdit".length);
		var networkName = $("#networkNameEdit"+networkId).val();
		var networkDescription = $(this).val();
		updateUserNetworkInfo(networkId, networkName, networkDescription);
	});
	
	endNetworksLoader();
}

function showUploadProgress(networkName) {
	var org = $("#species_select").val();
	var progresDivEl = "<div class='uploading_query_network' organism='" + org + "' name='" + networkName + "'><span style='float:left'><span class='uploadStatusIcon upload_progress'/></span><label>" + networkName + "</label></div>";

	
	$(".query_networks[group=0][organism="+org+"]").append(progresDivEl);
	$(".query_network_group[group=0][organism="+org+"]").click();
}

function showUploadCompleted(data) {

	var name = $(".uploading_query_network").attr("name");
	var organism = $(".uploading_query_network").attr("organism");
	$(".uploading_query_network").remove();
	
	if( data.error && data.network == null ){
		var date = new Date();
		
		function pad(num){
			return ( num < 10 ? "0" : "" ) + num;
		}
		
		var date_str = date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " at " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
		
		data.network = {
			name: name,
			id: 0,
			metadata: {
				comment: date_str
			},
			tags: []
		};
	}

	var group = {
		id: 0
	};
	
	var html = makeNetworkHtml(organism, group, data.network, data.error);
	var container = $("#networksPanel .query_networks[group=" + group.id + "][organism=" + organism + "]");
    container.append(html);
	refreshAllGroupCounts();
	$(".query_group_checkbox[group=" + group.id + "][organism=" + organism + "]").updateChecktreeItem();
	validateTree();
}

function deleteUserNetwork( query_network_div ) {
	
	var container = query_network_div;
	var network_id = container.attr("network");
	var organism = query_network_div.attr("organism");
	
	if(network_id > 0){
		console.log("can't delete non user network");
		return;
	}
	
	function remove() {
		var organism_id = parseInt( $("#species_select").val() );
		
		container.addClass("deleting");
		
		if( network_id == 0 ){
			container.remove();
			console.log("don't post to the server the deletion of failed uploads");
			return;
		}
		
		$.ajax({
			dataType: "json",
			data: {
				organism_id: organism_id,
				network_id: network_id
			},
			error: function(request, status, error){
				console.log("delete error");
				container.remove();
				refreshAllGroupCounts();
				$(".query_group_checkbox[group=0][organism=" + organism + "]").updateChecktreeItem();
			},
			success: function(data, status, request){
				
				if( data.error ){
					console.log(data.error);
				}
				
				container.remove();
				refreshAllGroupCounts();
				$(".query_group_checkbox[group=0][organism=" + organism + "]").updateChecktreeItem();
			},
			type: "POST",
			url: absoluteUrl("json/delete_network")
		});
		
		
	}

	$('<div><p>Are you sure you want to remove this network?</p></div>').dialog({
		title: "Confirmation of removal",
		buttons: {
			"Yes, remove it.": function(){ remove(); $(this).dialog("close"); },
			"No, keep it.": function(){ $(this).dialog("close"); }
		},
		modal: true,
		closeOnEscape: true,
    	resizable: false,
    	width: 300,
    	minHeight: 0
	});
}

function updateUserNetworkInfo(networkId, networkName, networkDescription) {
	var organismId = $("#species_select").val();
	if (networkDescription == null) { networkDescription = '' };
	networkDescription = $.trim(networkDescription.replace(/(\n|\r)+/, '').replace(/(\n|\r)+$/, '')); // trim
																										// newline
																										// chars
																										// and
																										// spaces
	$.post("json/upload", { operation: "update", organism: organismId, networkId: networkId, networkName: networkName, networkDescription: networkDescription } );
}

function loadDefaultOrganismGenes() {
	clearGeneError();

	var genes_string = $("#species_select :selected").attr("defgenes");
	
	// console.log("**** "+genes)
	$("#gene_list").val(genes_string);
	$("#gene_text").val(genes_string.replace("\n", "; "));// console.log("&&&
															// "+$("#gene_text").val());
	$("#gene_area").val(genes_string);// console.log("###
													// "+$("#gene_area").val());
}

function loadDefaultOrganismNetworks() {
	// console.log("load networks");
		
	startNetworksLoader();

	var currentSpeciesIndex = $("#species_select").attr("selectedIndex");
}

var _networks_reloading_count = 0;

function adjustNetworksLoaderCSS(){
	if( !jQuery || !$("#networks_section").is(":visible") ){
		return;
	}

	$("#networks_section_loading").css({
		left: $("#networks_section").position().left,
		top: $("#networks_section").position().top,
		width: $("#networks_section").width(),
		height: $("#networks_section").height() + ( $.browser.msie ? -8 : 0 ) // -8
																				// is a
																				// hack
																				// to
																				// fix
																				// ie
																				// since
																				// css
																				// hacks
																				// don't
																				// work
																				// :[
	});
}

$(function(){
	$("#advanced_options_closed a").bind("click", function(){
		adjustNetworksLoaderCSS();
	});
});

function startNetworksLoader(){
	_networks_reloading_count++;
	// console.log("++ " + _networks_reloading_count);
		
	// $("#networks_section_loading").show();
	adjustNetworksLoaderCSS();
		
	return _networks_reloading_count;
}

function areNetworksReloading(){
	return _networks_reloading_count != 0;
}

function endNetworksLoader(){
	setTimeout(function(){
		_networks_reloading_count--;
		
		if( _networks_reloading_count < 0 ){
			_networks_reloading_count = 0;
		}
		
		// console.log("-- " + _networks_reloading_count);
		
		if(_networks_reloading_count <= 0){
			$("#networks_section_loading").hide();
		}
	}, 500);
}

