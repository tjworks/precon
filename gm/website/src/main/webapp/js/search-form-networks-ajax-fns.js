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
	
	var url = network.metadata.sourceUrl;
	
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
                				( !empty(network.metadata.processingDescription) ? '<a href="http://pages.genemania.org/help/#GeneMANIA_network_categories" target="_blank">' + network.metadata.processingDescription + '</a>' : "" ) +
                				( !empty(network.metadata.interactionCount) ? (!empty(network.metadata.processingDescription) ? ' ' + $.i18n("search_networks.info.with") + ' ' : '') + add_commas(network.metadata.interactionCount) + ' ' + $.i18n("search_networks.info.interactions") : '' ) +
                				( network.metadata.source.toLowerCase() != 'collaborator' || !empty(network.metadata.reference) ? 
                						( ' ' + $.i18n("search_networks.info.from") + ' ' ) +
                						( network.metadata.source.toLowerCase() == 'collaborator' || network.id < 0 ?
                								network.metadata.source
                							:
                								( !empty(network.metadata.sourceUrl)
                									?
                										' <a class="external_link" target="_blank" href="' + network.metadata.sourceUrl + '">' + $.i18n("network_source." + network.metadata.source) + '</a> '
                									:
                										$.i18n("network_source." + network.metadata.source)
                								)
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
