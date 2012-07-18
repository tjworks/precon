$(function(){
	
var SCROLL_DELAY = 500;

var shift_down = false;

$("body").bind("keydown", function(e){
    shift_down = e.shiftKey;
}).bind("keyup", function(e){
    shift_down = e.shiftKey;
});

//Mapping network groups to edge colors:
var edgeColorMapper = {
		attrName: "networkGroupCode",
		entries: [
	          { attrValue: "coexp"  , value: "#d2c2d5" }, //Co-expression
	          { attrValue: "coloc"  , value: "#a0b3dc" }, //Co-localization
	          { attrValue: "gi"     , value: "#2fb56d" }, //Genetic interactions
	          { attrValue: "path"   , value: "#68bbc1" }, //Pathway
	          { attrValue: "pi"     , value: "#6261fc" }, //Physical interactions
	          { attrValue: "predict", value: "#c3844c" }, //Predicted
	          { attrValue: "spd"    , value: "#84ca6a" }, //Shared protein domains
// 		      { attrValue: "????"   , value: "#b56371" }, //---RESERVED---
	          { attrValue: "other"  , value: "#de789a" }, //Other
	          { attrValue: "user"   , value: "#d2cd4f" } //User-defined
		]
};

var DEF_EDGE_OPACITY = 0.85;
var DEF_HIGHLIGHT_EDGE_OPACITY = 1;
var DEF_UNHIGHLIGHT_EDGE_OPACITY = 0.15;
var AUX_EDGE_OPACITY = 0.3;
var AUX_HIGHLIGHT_EDGE_OPACITY = 0.6;
var AUX_UNHIGHLIGHT_EDGE_OPACITY = 0.05;
var DEF_MERGED_EDGE_OPACITY = 0.6;

var VISUAL_STYLE = {
		global: {
			backgroundColor: "#ffffff",
			selectionLineColor: "#717CFF",
			selectionLineOpacity: 1,
			selectionLineWidth: 1,
			selectionFillColor: "#717CFF",
			selectionFillOpacity: 0.05
		},
		nodes: {
			shape: "ELIPSE",
			color: "#fdfdfd",
			opacity: 1,
			size: { defaultValue: 12, continuousMapper: { attrName: "score", minValue: 12, maxValue: 36 } },
			borderColor: "#808080",
			borderWidth: 1,
			label: { passthroughMapper: { attrName: "symbol" } },
			labelFontWeight: "bold",
			labelGlowColor: "#ffffff",
            labelGlowOpacity: 1,
            labelGlowBlur: 2,
            labelGlowStrength: 20,
            labelHorizontalAnchor: "center",
            labelVerticalAnchor: "bottom",
			selectionBorderColor: "#000000",
			selectionBorderWidth: 2,
			selectionGlowColor: "#ffff33",
			selectionGlowOpacity: 0.6,
			hoverBorderColor: "#000000",
			hoverBorderWidth: 2,
			hoverGlowColor: "#aae6ff",
			hoverGlowOpacity: 0.8
		},
		edges: {
			color: {
				defaultValue: "#999999",
		        discreteMapper: edgeColorMapper
			},
			width: { defaultValue: 1, continuousMapper: { attrName: "weight", minValue: 2, maxValue: 5 } },
			mergeWidth: { defaultValue: 1, continuousMapper: { attrName: "weight", minValue: 2, maxValue: 5 } },
			opacity: { defaultValue: DEF_EDGE_OPACITY, 
				       discreteMapper: {
					   attrName: "networkGroupCode",
					   entries: [
					          { attrValue: "coexp", value: AUX_EDGE_OPACITY },
					          { attrValue: "coloc", value: AUX_EDGE_OPACITY }
						]
		    } },
			mergeOpacity: DEF_MERGED_EDGE_OPACITY,
			curvature: 16,
			selectionGlowColor: "#ffff33",
			selectionGlowOpacity: 0.8
		}
};

var OPTIONS = {
		layout: { name: "Preset", options: { fitToScreen: false } },
		panZoomControlVisible: true,
		edgesMerged: false,
		nodeLabelsVisible: true,
		edgeLabelsVisible: false,
		nodeTooltipsEnabled: false,
		edgeTooltipsEnabled: false,
		visualStyle: VISUAL_STYLE
};

//var _vis;
var _lastFilter; // filter function

CytowebUtil = {
	
	// --- PRIVATE Properties ----------------------------------------------------------------------
	
	_nodesById: null,
	
	// --- PUBLIC Properties -----------------------------------------------------------------------
	
    neighborsHighlighted: false,
	
    // --- PUBLIC Functions ------------------------------------------------------------------------
    
	refreshCytoscapeLite: function() {
		// Create a Cytoscape Lite instance:
		// ---------------------------------------------------------------------------------------------
		var options = {
				swfPath: absoluteUrl("swf/CytoscapeWeb_0.7.1"),
				flashInstallerPath: absoluteUrl("swf/playerProductInstall"),
				flashAlternateContent: '<div class="ui-state-error ui-corner-all"><p>GeneMANIA requires the Adobe Flash Player to use all of its features.</p>' +
				                       '<p><a href="http://get.adobe.com/flashplayer/"><img width="160" height="41" border="0" alt="Get Adobe Flash Player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg"></a></p></div>'
		};
		_vis = new org.cytoscapeweb.Visualization("graphBox", options);
		_vis.embedSWF = this._embedSWF;
		
		// Overwrite callback functions of interest:
		// ---------------------------------------------------------------------------------------------
		_vis.ready(function() {
    		CytowebUtil.recomputeLayout();

			// Update the page:
			_vis.swf().focus(); // So ctrl-click, etc. work without having to click the CW area first!
	    	
			CytowebUtil.updateNetworksTab();
	    	if (onCytoscapeWebLoaded) { onCytoscapeWebLoaded(); }
	    	
	    	// Context menu items:
		    _vis.addContextMenuItem("About Cytoscape Web...", function(evt) {
	    		window.open("http://cytoscapeweb.cytoscape.org/");	
	    	});

	    	// Workaround to prevent the cursor from disappearing when CytoWeb is using a custom cursor
	    	// and the mouse is over an HTML container that overlaps the Flash area:
	    	$(".over_flash, .qtip").live("mouseover", function() {
    			if (_vis) { _vis.customCursorsEnabled(false); }
    		}).live("mouseout", function() {
    			if (_vis) { _vis.customCursorsEnabled(true); }
    		});
    		
    		// enable query genes grey colour by default
            $("#go_tab .content table tr.query .add_button").children(":first").click();
            
            // no tooltips open at start
            $("#menu_close_tooltips").addClass("ui-state-disabled");
            
            progress("cytolite");
            $("body").trigger("cytoweb"); // added to help the QUnit test recognize when the results page is loaded
            //console.log(_vis.xgmml());
    		
	    });

		_vis.onEdgeTooltip = function(data) {
			var w = Math.round(data.weight*1000)/10;
			w = w < 0.1 ? "&lt; 0.1" : w;
			return "<b>weight:</b> " + w;
		}
		
		CytowebUtil._addListeners();
	    
	    // Draw the network:
	    // ---------------------------------------------------------------------------------------------
		
		CytowebUtil.loadNetwork();
	},
	
	
	loadNetwork: function(){
		var selected_networks = [];
		
		$("#selected_networks").children().each(function(){
			var id = parseInt( $(this).attr("network") );
			selected_networks.push( id );
		});
	
		
		//console.log(selected_networks);
		$.ajax({
		    type: "POST",
		    url: absoluteUrl("json/visualization?" + Math.random()),
		    dataType:"json",
		    data: {
				networks: selected_networks,
				organism: $("[name=organism]").val(),
				genes: $("[name=genes]").val(),
			 	weighting: $("[name=weighting]:checked").val(),
				threshold: $("[name=threshold]").val()
			},
		    success: function (response) {
				OPTIONS.network = response;
//				console.log("response");
//				console.log(response);
				
				_vis.draw(OPTIONS);
		    },
		    error: function (xhr, ajaxOptions, thrownError){
		    	//console.log('Error loading network : ' + thrownError);
		    },
		    cache: false
		});
	},
		
	updateGOColoursForGenes: function(){
	
	    var cache = {};
	
	    $(".go_list .go").each(function(){
	        var colour = $(this).find(".colour");
	        var ocid = $(this).attr("ocid");
	        
	        if( cache[ocid] == undefined ){
	            var colouring = $("#go_tab .colouring[ocid=" + ocid + "]");
	        
                if( colouring.size() > 0 ){
                    var colour0 = colouring.attr("colour0");
                    var colour1 = colouring.attr("colour1");
                
                    colour.css({
                        backgroundColor: colour0,
                        borderColor: colour1
                    }).addClass("coloured");
                    
                    cache[ocid] = {
                        colour0: colour0,
                        colour1: colour1
                    };
                    
                } else {
                    colour.css({
                        backgroundColor: "",
                        borderColor: ""
                    }).removeClass("coloured");
                    
                    cache[ocid] = false;
                }
	        } else if( cache[ocid] ) {
	            var colour0 = cache[ocid].colour0;
	            var colour1 = cache[ocid].colour1;
	            
	            colour.css({
                    backgroundColor: colour0,
                    borderColor: colour1
                }).addClass("coloured");
                
	        } else {
	            colour.css({
                    backgroundColor: "",
                    borderColor: ""
                }).removeClass("coloured");
	        }
	        
	    });
	},
	
	visualization: function() {
		return _vis;
	},
	
	getNodeById: function(id) {
		if (CytowebUtil._nodesById == null) {
			CytowebUtil._nodesById = {};
			var nodes = _vis.nodes();
			$.each(nodes, function(i, n) {
				CytowebUtil._nodesById[n.data.id] = n;
			});
		}
		return CytowebUtil._nodesById[id];
	},
	
	_highlight: false,
	
	_highlightGO: function(go_id, is_query_genes, bypass){
	    if(_vis) {
            
            if( bypass == undefined ){
                bypass = _vis.visualStyleBypass();
            }
            
            var colouring = $("#go_tab .colouring[ocid=" + go_id + "]");
            var colour0, colour1, colour2;
            
            is_query_genes = ( is_query_genes ? true : false );
            
            if( is_query_genes ){
                colour0 = $("#go_tab").attr("querycolour0");
                colour1 = $("#go_tab").attr("querycolour1");
                colour2 = $("#go_tab").attr("querycolour2");
            } else if( colouring.size() > 0 ){
                colour0 = colouring.attr("colour0");
                colour1 = colouring.attr("colour1");
                colour2 = colouring.attr("colour2");
            } else {
                colour0 = $("#go_tab").attr("colour0");
                colour1 = $("#go_tab").attr("colour1");
                colour2 = $("#go_tab").attr("colour2");
            }
                        
            if( ! bypass.nodes ){
                bypass.nodes = {};
            }
            
            var nodes = _vis.nodes();
            for(var i in nodes){
                var node = nodes[i];
                var go_ids = node.data.ocids;
                var has_id = false;
                var query = ( node.data.queryGene == "true" || node.data.queryGene == true );
                
                if( is_query_genes ){
                    has_id = query;
                } else {
                    for(var j in go_ids){
                        var id = go_ids[j];
                        
                        if( id == go_id ){
                            has_id = true;
                        }
                    }
                }
                
                if( !bypass.nodes[node.data.id] ){
                    bypass.nodes[node.data.id] = {};
                }
                
                if(has_id){
                    bypass.nodes[node.data.id].borderColor = "#000000";
                    bypass.nodes[node.data.id].color = colour0;
                    bypass.nodes[node.data.id].borderWidth = 2;
                }
            }
            
            _vis.visualStyleBypass(bypass);
	    }
	},
	
	highlightGO: function(go_id, is_query_genes){
	    var bypass;
	    
	    if( CytowebUtil._highlight ){
	        bypass = CytowebUtil.updateGO(false);
	    }
	    
	    CytowebUtil._highlight = true;
	    
	    CytowebUtil._highlightGO(go_id, is_query_genes, bypass);
	},
	
	unhighlightGO: function(go_id, is_query_genes){
	    CytowebUtil.updateGO();
	    CytowebUtil._highlight = false;
	},
	
	_prev_gene_bypass: {},
	
	highlightGene: function(gene_id){
	    if(_vis){
	        var bypass = _vis.visualStyleBypass();
	        
	        if( !bypass.nodes ){
	            bypass.nodes = {};
	        }
	        
	        function use_default_colouring(){
	            if( !bypass.nodes[gene_id] ){
	                bypass.nodes[gene_id] = {};
	            }
	        
	            bypass.nodes[gene_id].borderWidth = 2;
	            bypass.nodes[gene_id].borderColor = "#000000";
	        }
	        
	        
	        if( bypass.nodes[gene_id] ){
	            CytowebUtil._prev_gene_bypass[gene_id] = $.extend(true, {}, bypass.nodes[gene_id]);
	        
	            var bg = bypass.nodes[gene_id].color;
	            
	            if( false && bg ){
                    var colouring = $("#go_tab .colouring[colour0=" + bg + "]");
                    
                    if( colouring.size() > 0 ){
                        bypass.nodes[gene_id].borderWidth = 3;
                        bypass.nodes[gene_id].borderColor = colouring.attr("colour1");
                        bypass.nodes[gene_id].color = colouring.attr("colour0");
                    } else {
                        use_default_colouring();
                    }
	            } else {
	                use_default_colouring();
	            }
	        } else {
	            CytowebUtil._prev_gene_bypass[gene_id] = {};
	            use_default_colouring();
	        }
	        
	        _vis.visualStyleBypass(bypass);
	    }
	},
	
	unhighlightGene: function(gene_id){
	    if(_vis && CytowebUtil._prev_gene_bypass[gene_id]){
	        var bypass = _vis.visualStyleBypass();
	        
	        if( !bypass.nodes ){
	            bypass.nodes = {};
	        }
	        
	        if( !bypass.nodes[gene_id] ){
	            return;
	        }
	        
	        bypass.nodes[gene_id] = CytowebUtil._prev_gene_bypass[gene_id];
	        CytowebUtil._prev_gene_bypass[gene_id] = undefined;
	        
	        _vis.visualStyleBypass(bypass);
	    }
	},
	
	updateNetworksTab: function() {
//console.log("update networks tab");
		
    	// Get the networks legend:
		var legend = {/*color->networkGroupId*/};
    	var edges = _vis.edges();
    	var networksList = {};
    	
    	if (edges) {
    		$.each(edges, function(i, e) {
    			// Considering only one data attribute per color in the mapper!
    			legend[e.color] = e.data['networkGroupId'];
    			
    			for(var id in e.data.networkIdToWeight){
    				networksList[id] = true;
    			}
    		});
    	}
//console.log(networksList);
    	
    	// Set network colors:
    	for (var netColor in legend) {
		    var netId = legend[netColor];
    		$("#networkGroupBar" + netId).css('background-color', netColor);
    		$("#networkGroup" + netId + " div[id^='networkBar'].bar").css('background-color', netColor);
    		$("#networkColour" + netId).css('border-left', "1.5em solid " + netColor);
        }
    	// Greyed out networks with no correspondent edges:
    	var spacer = '<div class="checkbox_spacer not_found">&nbsp;</div>';
    	
    	$("#networks_widget .checktree_network").each(function(){
    		var id = $(this).attr("id").replace("network", "");
    		
    		if ( !networksList[id] ) {
    			$(this).find(".bar:first").addClass("disabled");
    			$(this).find(".checkbox").remove();
    			$(this).find("input[type=checkbox]").remove();
    			$(this).find(".arrow:first").after(spacer);
    		}
    	});

    	$("#networks_widget .checktree_top_level").each(function(){
    		if ($(this).find(".checktree_network .checkbox").length === 0) {
    			// No enabled network for this network group:
    			$(this).find(".bar:first").addClass("disabled");
    			$(this).find(".checkbox").remove();
    			$(this).find("input[type=checkbox]").remove();
    			$(this).find(".arrow:first").after(spacer);
    		}
    	});
    	
    	var tooltip = 'Sometimes networks used by GeneMANIA to connect all of your input genes are grayed out because the connecting genes contain scores too low to be returned in your query results.';
		$("#networks_widget .not_found").attr("tooltip", tooltip);
		$("#networks_widget .not_found").parent().find(".per_cent_bar div").attr("tooltip", tooltip);
	},
	
	filterNetworks: function() {
	
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
				_lastFilter = null;
			} else {
				_lastFilter = function(edge) {
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
				_vis.filter("edges", _lastFilter, true);
			}
		}
	},
	
	mergeEdges: function(value) {
		if (value === OPTIONS.edgesMerged) return;
		
		if(_vis) {
			OPTIONS.edgesMerged = value;
			_vis.edgesMerged(value);
		}
	},
	
	showNodeLabels: function(value) {
		if (value === OPTIONS.nodeLabelsVisible) return;
	
		if(_vis) {
			OPTIONS.nodeLabelsVisible = value;
			_vis.nodeLabelsVisible(value);
		}
	},
	
	showPanZoomControl: function(value) {
		if (value === OPTIONS.panZoomControlVisible) return;
		
		if(_vis) {
			OPTIONS.panZoomControlVisible = value;
			_vis.panZoomControlVisible(value);
		}
	},
	
	recomputeLayout: function() {
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
					if (_lastFilter == null) {
						_vis.removeFilter("edges", true);
					} else {
						_vis.filter("edges", _lastFilter, true);
					}
				};
				
				var filterListener = function(evt) {
					_vis.removeListener("filter", "edges", filterListener);
					_vis.addListener("layout", layoutListener);
					_vis.layout(layout);
				};
				
				_vis.addListener("filter", "edges", filterListener);
				
				_vis.filter("edges", function(e) {
					var current = (_lastFilter == null || _lastFilter(e)); // The current filter should be kept!
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
		
		
	},
	
	selectNode: function(nodeId) {
		if(_vis) {
			_vis.select("nodes", [nodeId]);
		}
	},
	
	deselectNode: function(nodeId) {
		if(_vis) {
			_vis.deselect("nodes", [nodeId]);
		}
	},
	
	updateGO: function(draw){
	    if(_vis) {
	        var bypass = _vis.visualStyleBypass();
	        var nodes = _vis.nodes();
	        
	        if( draw == undefined ){
	            draw = true;
	        }
	        
	        if( ! bypass.nodes ){
	            bypass.nodes = {};
	        } else {
	            $.each(bypass.nodes, function(i, node){
	                if( node.color ){
	                    node.color = VISUAL_STYLE.nodes.color;
	                    node.borderColor = VISUAL_STYLE.nodes.borderColor;
	                    node.borderWidth = VISUAL_STYLE.nodes.borderWidth;
	                }
	            });
	        }
	        
	        $("#go_tab .colouring").reverse().each(function(){
	            var colouring = $(this);
	            var colouring_ocid = $(this).find(".annotation").attr("ocid");
	            var is_query_genes = $(this).hasClass("query");
	            var colour0 = colouring.attr("colour0");
	            var colour1 = colouring.attr("colour1");
	            var colour2 = colouring.attr("colour2");
	            
	            $.each(nodes, function(i, node) {
                    var ocids = node.data.ocids;
                    
                    if( ! bypass.nodes[node.data.id] ){
                        bypass.nodes[node.data.id] = {};
                    }
                    
                    if( is_query_genes ){
                        if( node.data.queryGene == true || node.data.queryGene == "true" ){
                            bypass.nodes[node.data.id].color = colour0;
                            bypass.nodes[node.data.id].borderColor = colour1;
                        }
                    } else {
                        $.each(ocids, function(j, ocid){
                            if( ocid == "" || ocid != colouring_ocid ){
                                return;
                            }
                        
                            bypass.nodes[node.data.id].color = colour0;
                            bypass.nodes[node.data.id].borderColor = colour1;
                        });
                    }
                    
                });
	        });
	        
	        if( draw ){
			    _vis.visualStyleBypass(bypass);
			}
			
			return bypass;
		}
	},
	
	highlightFirstNeighbors: function(nodes) {
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
			    	opacity = AUX_UNHIGHLIGHT_EDGE_OPACITY;
			    } else {
			    	opacity = DEF_UNHIGHLIGHT_EDGE_OPACITY;
			    }
				bypass.edges[e.data.id].opacity = opacity;
				bypass.edges[e.data.id].mergeOpacity = opacity;
		    });
			$.each(edges, function(i, e) {
			    if( !bypass.edges[e.data.id] ){
			        bypass.edges[e.data.id] = {};
			    }
			    if (e.data.networkGroupCode === "coexp" || e.data.networkGroupCode === "coloc") {
			    	opacity = AUX_HIGHLIGHT_EDGE_OPACITY;
			    } else {
			    	opacity = DEF_HIGHLIGHT_EDGE_OPACITY;
			    }
				bypass.edges[e.data.id].opacity = opacity;
				bypass.edges[e.data.id].mergeOpacity = opacity;
			});

			_vis.visualStyleBypass(bypass);
			CytowebUtil.neighborsHighlighted = true;
			
			$("#menu_neighbors_clear").removeClass("ui-state-disabled");
			

		}
	},
	
	clearFirstNeighborsHighlight: function() {
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
	},
	
	checkVersionFor: function(name){
		var version = "" + $("html").attr("webversion");
		var dbVersion = "" + $("html").attr("dbversion");
		var newVersion;
		var newDbVersion;
		
		var error = false;
		
		$.ajax({
			async: false,
			type: "GET",
			data: {},
			dataType: "json",
			url: absoluteUrl("json/version"),
			error: function(request, status, error){
				warning();
				error = true;
			},
			success: function(data, status, request){
				newVersion = "" + data.webappVersion;
				newDbVersion = "" + data.dbVersion;
				
			}
		});
		
		if( error ){
			return false;
		}
		
		function warning(){
			$('<p>GeneMANIA has been updated since you performed your search.  To make sure that your ' + name + ' is consistent ' +
					'with results from the new version of GeneMANIA, please resubmit your search and try to generate the ' +
					name + ' again.</p>').dialog({
				title: "The " + name + " can not be generated",
				buttons: {
					"OK, resubmit the search for me.": function(){ $(this).dialog("close"); $("#reloader").show(); $("#resubmit_form").submit(); },
					"Nevermind, I will resubmit myself later.": function(){ $(this).dialog("close"); }
				},
				modal: true,
				closeOnEscape: true,
		    	resizable: false,
		    	width: 500,
		    	minHeight: 0
			});
		}
		

		// ok to print if versions match or local debug version
		if( version.search("antdebug") < 0 && ( newVersion != version || newDbVersion != dbVersion ) ){
//			console.log("version: " + version);
//			console.log("new version: " + newVersion);
//			console.log("dbversion: " + dbVersion);
//			console.log("new dbversion: " + newDbVersion);
//			console.log("different versions -- can't print");
			
			warning();
			
			return false;
		} else {
//			console.log("ok to make report");
			
			return true;
		}
	},
	
	generateReport: function(token, params) {
		
		if( !CytowebUtil.checkVersionFor("report") ){
			return;
		}
		
		var go_colors = "", go_bcolors = "", net_colors = ""; // <id_1>|<color_1>||<id_2>|<color_2>||(...)||<id_n>|<color_n>
		
		// get GO colors
		var entries = $("#go_tab .colouring");
		entries.each(function(i){
            var id = $(this).attr("ocid");
            var c = $(this).find(".colour").css("background-color");
            // fill colors
            go_colors += id + "|" + c + (i < entries.length-1 ? "||" : "");
            // border colors
            c = $(this).find(".colour").css("border-bottom-color"); // DO NOT use 'border-color', because it does not work on Firefox!
            go_bcolors += id + "|" + c + (i < entries.length-1 ? "||" : "");
        });

		$("#print_form [name=gocolors]").remove();
		$("#print_form").append('<input type="hidden" name="gocolors" value=\'' + go_colors + '\' />');
		
		// get network colors
		entries = $("#networks_widget .checktree_top_level > .per_cent_bar .bar");
		entries.each(function(i){
			var id = $(this).attr("id").replace("networkGroupBar", "");
			var c = $(this).css("background-color");
			// missing network?
			if ($("#networkGroup" + id + " > .per_cent_bar .bar.disabled").length > 0) {
				c = "rgb(255, 255, 255)";
			}
			net_colors += id + "|" + c + (i < entries.length-1 ? "||" : "");
		});
		
		$("#print_form [name=networkcolors]").remove();
		$("#print_form").append('<input type="hidden" name="networkcolors" value=\'' + net_colors + '\' />');
				
		$("#print_form [name=golegend]").remove();
		$("#print_form").append('<textarea name="golegend">' + $("#go_tab > .header").html() + '</textarea>');
		
		var svg = _vis.svg();
		$("#print_form [name=svg]").remove();
		$("#print_form").append('<input type="hidden" name="svg" value=\'' + svg + '\' />');
		
		// put currently sorted html into the form for printing
//		$("#print_form [name=geneshtml]").val( $("#genes_tab .content").html() );
//		$("#print_form [name=networkshtml]").val( $("#networks_tab .content").html() );
//		$("#print_form [name=gohtml]").val( $("#go_tab .content").html() );
		
		$("#print_form").submit();
	
		
	},

	exportNetwork: function() {
		if( !CytowebUtil.checkVersionFor("text network") ){
			return;
		}
		
		$("#text_form").submit();
	},
	
	exportParams: function() {
		$("#params_form").submit();
	},
	
	exportParamsJson: function() {
		$("#params_json_form").submit();
	},
	
	exportNetworks: function() {
		if( !CytowebUtil.checkVersionFor("networks") ){
			return;
		}
		
		$("#networks_form").submit();
	},
	
	exportGenes: function() {
		if( !CytowebUtil.checkVersionFor("genes") ){
			return;
		}
		
		$("#genes_form").submit();
	},
	
	exportGo: function() {
		if( !CytowebUtil.checkVersionFor("functions") ){
			return;
		}
		
		$("#go_form").submit();
	},
	
	exportInteractions: function() {
		if( !CytowebUtil.checkVersionFor("interactions") ){
			return;
		}
		
		$("#interactions_form").submit();
	},
	
	exportSvg: function(use_svg_from_cytoweb) {
		if( use_svg_from_cytoweb == undefined || use_svg_from_cytoweb ){
			$("#svg_form [name=content]").val( _vis.svg() );
		}
		$("#svg_form").submit();
	},
	
    // --- PRIVATE Functions -----------------------------------------------------------------------
	
	_round_weight: function(w){
	    w = Math.round(w*1000)/10;
	    
	    if( (w * 10) % 10 == 0 ){
	        w += ".0";
	    }
	    
		w = w < 0.1 ? "&lt; 0.1" : w;
		
		return w;
	},
	
	_tooltip_timeout: undefined,
	
	body_click: function(){
	    $("body").trigger("click");
	},
	
	_addListeners: function() {
	    
	    var node_hover_timeout;
	
	    function handle_click(evt){
	        if(!shift_down){
	            CytowebUtil._showTooltip(evt);
	        }
	    }
	
	    _vis.addListener("select", "nodes", function(evt) {
	    	setTimeout(function(){
	    		var nodesArray = evt.target;
		    	var already_selected = false;
		    	$.each(nodesArray, function(i, node) {
		    		if (!$("#gene"+node.data.id + " .label").hasClass("selected")) {
		    			// hilight node
		    			$("#gene"+node.data.id + " .label").addClass("selected");
		    			already_selected = true;
		    			
		    	    	// Expand the gene row content:
		    	    	if(false && $("#gene"+node.data.id + " .arrow").hasClass("collapsed")) {
		    				$("#gene"+node.data.id + " .arrow").click();
		    			}
		    		}
		    	});
		    	// scroll to only first gene
		    	if (false && already_selected) {
					var first_node = $("#genes_widget").find(".label.selected").parent();
					$("#genes_tab .content").scrollTo($(first_node), SCROLL_DELAY);
		    	}
		    	CytowebUtil._onSelectNodesChanged();
	    	}, 100);
	    	
	    })
	    .addListener("deselect", "nodes", function(evt) {
	    	setTimeout(function(){
		    	var nodesArray = evt.target;
		    	$.each(nodesArray, function(i, node) {
		    		$("#gene"+node.data.id + " .label").removeClass("selected");
		    	});
		    	CytowebUtil._onSelectNodesChanged();
	    	}, 100);
	    })
	    .addListener("select", "edges", function(evt) {
	    	setTimeout(function(){
	    		CytowebUtil._onSelectEdgesChanged();
	    	}, 100);
	    })
	    .addListener("deselect", "edges", function(evt) {
	    	setTimeout(function(){
	    		CytowebUtil._onSelectEdgesChanged();
	    	}, 100);
	    })
	    .addListener("click", "nodes", function(evt) {
	        handle_click(evt);
	        track("Node", "Click");
	    })
	    .addListener("dblclick", "nodes", function(evt) {
	        handle_click(evt);
	    })
	    .addListener("click", "edges", function(evt) {
	        handle_click(evt);
	        track("Edge", "Click");
	    })
	    .addListener("dblclick", "edges", function(evt) {
	        handle_click(evt);
	    })
	    .addListener("layout", function(evt) {
	    	
	    })
		.addListener("error", function(evt) {
			//console.log('Error drawing network: ' + evt.value.msg);
		})
		.addListener("click", function(evt) {
	    	CytowebUtil.body_click();
	    });
	},
	
	_showTooltip: function(evt){
	    $("#menu_close_tooltips").removeClass("ui-state-disabled");
	    CytowebUtil._makeTooltip(evt);
	},
	
	_makeTooltip: function(evt){
		//console.log("making tooltip");
		
	    var outer_padding = 4;
	
	    var prev_qtip;
	    if( evt.group == "nodes" ){
	        var prev_qtip = $(".qtip[nodeid=" + evt.target.data.id + "]:visible");
	    } else {  
	        var prev_qtip = $(".qtip[edgeid=" + evt.target.data.id + "]:visible");
	    }
	    
	    if( prev_qtip.size() > 0 ){
	    	//console.log("show existing previous tooltip");
	    	
	        var title = prev_qtip.find(".qtip-title");
            var content = prev_qtip.find(".qtip-content");
	        
            function flash(ele){
                var bg = ele.css("background-color");
                
                if( !ele.hasClass("highlighting") ){
                
                    ele.addClass("highlighting");
                
                    ele.animate({
                        backgroundColor: "#ffff88"
                    }, ANI_SPD, function(){
                    
                        setTimeout(function(){
                            ele.animate({
                                backgroundColor: bg
                            }, ANI_SPD, function(){
                                ele.removeClass("highlighting");
                            });
                        }, 1000);
                        
                    });
                
                }
            }
            
            flash(title);
	    
	        return;
	    }
	
	    var source;
	    var target;
	    
	    var x;
	    var zoom = _vis.zoom();
	    if( evt.group == "nodes" ){
	        x = evt.target.x + $("#graph").offset().left - evt.target.size*zoom/2;
	    } else {
	        source = _vis.node(evt.target.data.source);
	        target = _vis.node(evt.target.data.target);
	        
	        x = evt.mouseX + $("#graph").offset().left;
	    }
	    
	    var y;
	    if( evt.group == "nodes" ){
	        y = evt.target.y + $("#graph").offset().top;
	    } else {
	        y = evt.mouseY + $("#graph").offset().top;;
	    }
	    
	    // The tooltip anchor:
        var maxH = 220;
        var maxW = 300;
        var screenHeight = $("html").height();
        var screenWidth = $("html").width();
        var top = (maxH + y + 2.2*outer_padding <= screenHeight);
        var left = (x <= maxW + 2.2*outer_padding);
	    
	    var position;
	    
	    if( left ){
	        position = "left";
	        
	        if( evt.group == "nodes" ){
	            x += evt.target.size*zoom;
	        }
	    } else {
	        position = "right";
	    }
	    
	    if( top ){
	        position += "Top";
	    } else {
	        position += "Bottom";
	    }
	    
	    var text = "";
	    var title;
	    
	    if( evt.group == "nodes" ){
	    	//console.log("making content for node");
	    	
	        title =  evt.target.data.symbol;
	        
	        var score = "" + $("#genes_tab").find("li[id=gene" + evt.target.data.id + "]").not(".source_true").find(".score_text:first").text();
	        
	        if( score != "" ){
	            title += ' (score: ' + score + ')';
	        }
	        
	        text = $("#genes_tab").find("li[id=gene" + evt.target.data.id + "] .text:first").html();
	    } else {
	    	//console.log("making content for edge");
	    	
	        title = source.data.symbol + ' - ' + target.data.symbol;
	        
	        var edges = [];
	        
	        if( evt.target.merged ){
	            var target_edges = evt.target.edges;
	            var name_to_edge = {};
	            var names = [];
	            
	            $.each(target_edges, function(i, edge){
	            	var grId = edge.data.networkGroupId;
        			var grName = $("#networkGroupLabel"+grId+" .network_name").text();
        			
        			name_to_edge[grName] = edge;
        			names.push(grName);
	            });
	            
	            names.sort();
	            
	            for(var name in name_to_edge){
	            	var edge = name_to_edge[name];
	            	edges.push(edge);
	            }
	        } else {
	            edges[0] = evt.target;
	        }
	        //console.log("data for tooltip included edges:");
	        //console.log(edges);
	        
	        for(var i in edges){
	            var edge = edges[i];
	            text += CytowebUtil._getLinkInfo(edge);
	        }
	    }
	    
	    // remove old ones
	    $("body").children(".qtip").not(".ripped_out").remove();
	    $("body").children(".qtip").not(":visible").remove();
	     
	    // Create the tooltip:
        $("body").qtip({
            content: {
                text: text,
                title: {
                    text: title + ' <div class="ui-state-default ui-corner-all minimise"> <span class="ui-icon"></span> </div> ',
                    button: '<div class="ui-state-default ui-corner-all"> <span class="ui-icon ui-icon-close"></span> </div>'
                }
            },
            position: {
                target: false,
                type: "absolute",
                corner: {
                    tooltip: position,
                    target: "leftTop"
                },
                adjust: {
                    mouse: false,
                    x: x,
                    y: y,
                    scroll: false,
                    resize: false
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
                when: { event: "unfocus" }, // Hide when clicking anywhere else
                fixed: true // Make it fixed so it can be hovered over
            },
            style: {
               border: { width: 1, radius: 8 },
               width: {
                    min: ( evt.group == "nodes" ? 0 : maxW ),
                    max: ( maxW )
               },
               screen: true,
               padding: outer_padding, 
               textAlign: 'left',
               name: 'light', // Style it according to the preset 'cream' style,
               tip: true      // Give it a speech bubble tip with automatic corner detection
            }
        });
        
        $("body").children(".qtip:last").each(function(){
            var qtip = $(this);
            
            qtip.find(".qtip-button").bind("mousedown", function(){
                qtip.qtip("api").beforeHide = function(){
    
                }
            });
            
            function update_qtip_position(){
                if( !qtip.hasClass("ripped_out") ){
                    qtip.qtip("api").updatePosition();
                }
            }
            
            function make_show_more(syn){
                var variance = 20; // px diff before hide
                var show_msg = "&#9658; Show more";
                var hide_msg = "&#9650; Show less";
            
                var syn_link = $('<a href="#" class="action_link">' + show_msg + '</a>');
                var old_syn_height = syn.height();
            
                syn.addClass("short");
                        
                if( old_syn_height - syn.height() > variance ){
                    syn.after(syn_link);
                    
                    syn_link.click(function(){
                        if( syn.hasClass("short") ){
                            syn_link.html(hide_msg);
                        } else {
                            syn_link.html(show_msg);
                        }
                        syn.toggleClass("short");
                        update_qtip_position();
                        return false;
                    });
                } else {
                    syn.removeClass("short");
                }
            }
            
            if( evt.group == "nodes" ){
                var syn = qtip.find(".synonyms");
                make_show_more(syn);
                
                var descr = qtip.find(".description");
                make_show_more(descr);
                
                var go_list = qtip.find(".go_list");
                make_show_more(go_list);
                
                qtip.attr("nodeid", evt.target.data.id);
            } else {
                qtip.find(".network").addClass("short").each(function(){
                    var net = $(this);
                        
                    net.find(".label").bind("click", function(){
                        net.toggleClass("short");
                        update_qtip_position();
                    }).bind("mouseover", function(){
                        net.addClass("hover");
                    }).bind("mouseout", function(){
                        net.removeClass("hover");
                    });
                    
                    net.find(".per_cent_bar").bind("click", function(){
                        net.toggleClass("short");
                        update_qtip_position();
                    }).bind("mouseover", function(){
                        net.addClass("hover");
                    }).bind("mouseout", function(){
                        net.removeClass("hover");
                    });
                    
                });
                
                qtip.attr("edgeid", evt.target.data.id);
            }
            
            qtip.find(".minimise").each(function(){
                var open_class = "ui-icon-arrowthickstop-1-n";
                var close_class = "ui-icon-arrowthickstop-1-s";
                var icon = $(this).find(".ui-icon");
                
                icon.addClass(open_class);
                $(this).addClass("ui-state-disabled");
            
                $(this).bind("click", function(){
                    
                    if( $(this).hasClass("ui-state-disabled") ){
                    	return false;
                    }
                    
                    if( icon.hasClass(open_class) ){
                        icon.removeClass(open_class);
                        icon.addClass(close_class);
                        qtip.find(".qtip-content").addClass("collapsed_min");
                    } else {
                        icon.removeClass(close_class);
                        icon.addClass(open_class);
                        qtip.find(".qtip-content").removeClass("collapsed_min");
                    }
                
                    return false;
                }); 
            });
            
            function update_menu(){
                if( $(".qtip:visible").size() > 1 ){
                    $("#menu_close_tooltips").removeClass("ui-state-disabled");
                } else {
                    $("#menu_close_tooltips").addClass("ui-state-disabled");
                }
            }
            
            qtip.find(".qtip-button").bind("mousedown", function(){
                update_menu();
            });
            
            qtip.qtip("api").beforeHide = function(){
                update_menu();
            }
            
            qtip.draggable({
                containment: "window",
                handle: ".qtip-title",
                cursor: "move",
                start: function(){
                    qtip.addClass("ripped_out");
                    qtip.find(".qtip-tip").hide();
                    qtip.find(".qtip-title .minimise").removeClass("ui-state-disabled");
                    
                    qtip.qtip("api").beforeHide = function(){
                        if( qtip.hasClass("ripped_out") ){
                            return false;
                        }
                    }
                    
                    qtip.qtip("api").beforePositionUpdate = function(){
                        if( qtip.hasClass("ripped_out") ){
                            return false;
                        }
                    }
                    
                    track("Gene/edge tooltip", "Drag");
                }
            });
            
            qtip.qtip("api").updatePosition();
        });
        
	},
	
	_getLinkInfo: function(e){
		//console.log("getting edge info");
		
	    var info = '<ul class="network_list tooltip">';
        var c = e.color;
        var w = CytowebUtil._round_weight(e.data['weight']);
        
        var grId = e.data.networkGroupId;
        var grName = $("#networkGroupLabel"+grId+" .network_name").text();
        
        info += '<li class="network_group"><div class="label">' +
                '<div class="per_cent_text"><span>Weight</span></div>' +
                '<div class="network_name">' + grName +'</div>' +
                '</div>' +
                //'<div class="per_cent_bar"> <div class="bar" style="background-color:'+c+';width:'+w+'%">&nbsp;</div> </div>' +
                '<ul style="display: block;">';
        
        var nn = e.data.networkIdToWeight;
        var weight_to_id = {};
        var weights = [];
        
        $.each(nn, function(id, w) {
            if( !weight_to_id[w] ){
            	weight_to_id[w] = [];
            }
            
			weight_to_id[w].push(id);
			weights.push( w );
        });
 
        weights.sort();
        
        for(var i = weights.length - 1; i >= 0; i--){
        	var weight = weights[i];
        	var ids = weight_to_id[weight];
        	
        	for(var j in ids){
        		var id = ids[j];
					var weight_rounded = CytowebUtil._round_weight( weight );
					var n = $("#network"+id+" .network_name").text();
					var desc = $("#networkDescription" + id).html();
					
					info += '<li class="network">' +
						'<div class="label">' +
							'<div class="per_cent_text"><span tooltip="Network weight">' + weight_rounded + '</span></div>' + 
							'<div class="network_name">' + n +'</div>' +
						'</div>' +
						'<div class="per_cent_bar"> <div class="bar" style="background-color:'+c+';width:'+weight_rounded+'%">&nbsp;</div> </div>' +
						'<div class="description">' + desc + '</div>' +
					'</li>';
        	}
        }
        				
        
        info += '</ul></li></ul>';
        
        return info;
	},
	

	
	_onSelectEdgesChanged: function(scroll) {    
		$("#networks_widget .label").removeClass("selected");
		var edgesArray = _vis.selected("edges");
		
    	$.each(edgesArray, function(i, edge) {
    		
    		$.each(edge.data.networkIdToWeight, function(id, weight){
    			var label = $("#network"+ id + " .label");
    			label.addClass("selected");
    		});
    		
    		
    	});
	},
	
	_onSelectNodesChanged: function() {
		if (_vis) {
			var nodes = _vis.selected("nodes");
			var selected = nodes != null && nodes.length > 0;
			// Enable/disable related menu items:
			if (selected) {
				$("#menu_neighbors").removeClass("ui-state-disabled");
			} else {
				$("#menu_neighbors").addClass("ui-state-disabled");
			}
		}
	},
	
    _embedSWF: function() {
        //Major version of Flash required
        var requiredMajorVersion = MIN_FLASH_VERSION;
        //Minor version of Flash required
        var requiredMinorVersion = MIN_FLASH_MINOR_VERSION;
        //Minor version of Flash required
        var requiredRevision = 0;

        var containerId = this.containerId;

        // Let's redefine the default AC_OETags function, because we don't necessarily want
        // to replace the whole HTML page with the swf object:
        AC_Generateobj = function (objAttrs, params, embedAttrs) {
            var str = '';
            var i;
            if (isIE && isWin && !isOpera) {
                str += '<object ';
                for (i in objAttrs) {
                    if (Object.hasOwnProperty.call(objAttrs, i)) {
                        str += i + '="' + objAttrs[i] + '" ';
                    }
                }
                str += '>';
                for (i in params) {
                    if (Object.hasOwnProperty.call(params, i)) {
                        str += '<param name="' + i + '" value="' + params[i] + '" /> ';
                    }
                }
                str += '</object>';
            } else {
                str += '<embed ';
                for (i in embedAttrs) {
                    if (Object.hasOwnProperty.call(embedAttrs, i)) {
                        str += i + '="' + embedAttrs[i] + '" ';
                    }
                }
                str += '> </embed>';
            }
            // Replace only the indicated DOM element:
            document.getElementById(containerId).innerHTML = str;
        };

        // Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
        var hasProductInstall = DetectFlashVer(6, 0, 65);

        // Version check based upon the values defined in globals
        var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

        if (hasProductInstall && !hasRequestedVersion) {
            // DO NOT MODIFY THE FOLLOWING FOUR LINES
            // Location visited after installation is complete if installation is required
            var MMPlayerType = (isIE === true) ? "ActiveX" : "PlugIn";
            var MMredirectURL = window.location;
            document.title = document.title.slice(0, 47) + " - Flash Player Installation";
            var MMdoctitle = document.title;

            AC_FL_RunContent(
                "src", this.flashInstallerPath,
                "FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
                "width", "100%",
                "height", "100%",
                "align", "middle",
                "id", this.id,
                "quality", "high",
                "bgcolor", "#ffffff",
                "name", this.id,
                "allowScriptAccess","sameDomain",
                "type", "application/x-shockwave-flash",
                "pluginspage", "http://www.adobe.com/go/getflashplayer"
            );
            
            if (onCytoscapeWebLoaded) { onCytoscapeWebLoaded(true); progress("cytolite"); }
        } else if (hasRequestedVersion) {
            var optionKeys = ["resourceBundleUrl"];
            var flashVars = "";
            if (this.options) {
                for (var i in optionKeys) {
                    if (Object.hasOwnProperty.call(optionKeys, i)) {
                        var key = optionKeys[i];
                        if (this.options[key] !== undefined) {
                            flashVars += key + "=" + this.options[key] + "&";
                        }
                    }
                }
                flashVars += "id=" + this.id;
            }

            // if we've detected an acceptable version
            // embed the Flash Content SWF when all tests are passed
            AC_FL_RunContent(
                    "src", this.swfPath,
                    "width", "100%",
                    "height", "100%",
                    "align", "middle",
                    "id", this.id,
                    "quality", "high",
                    "bgcolor", "#ffffff",
                    "name", this.id,
                    "allowScriptAccess", "always",
                    "type", "application/x-shockwave-flash",
                    "pluginspage", "http://www.adobe.com/go/getflashplayer",
                    "wmode", "opaque", // DO NOT set it to "transparent", because it may crash FireFox and IE on Windows!
                    "flashVars", flashVars
            );
        } else { // flash is too old or we can't detect the plugin
            // Insert non-flash content:
            document.getElementById(containerId).innerHTML = this.flashAlternateContent;
	    	
            if (onCytoscapeWebLoaded) { onCytoscapeWebLoaded(true); progress("cytolite"); }
        }
        return this;
    }
    
} // END CytowebUtil

});

