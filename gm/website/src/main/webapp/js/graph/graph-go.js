CytowebUtil._prev_gene_bypass = {};

CytowebUtil.updateGOColoursForGenes = function(){
	
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
};

CytowebUtil.updateGO = function(draw){
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
                    node.color = CytowebUtil.VISUAL_STYLE.nodes.color;
                    node.borderColor = CytowebUtil.VISUAL_STYLE.nodes.borderColor;
                    node.borderWidth = CytowebUtil.VISUAL_STYLE.nodes.borderWidth;
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
};

CytowebUtil._highlight = false;

CytowebUtil._highlightGO = function(go_id, is_query_genes, bypass){
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
};

CytowebUtil.highlightGO = function(go_id, is_query_genes){
    var bypass;
    
    if( CytowebUtil._highlight ){
        bypass = CytowebUtil.updateGO(false);
    }
    
    CytowebUtil._highlight = true;
    
    CytowebUtil._highlightGO(go_id, is_query_genes, bypass);
};

CytowebUtil.unhighlightGO = function(go_id, is_query_genes){
    CytowebUtil.updateGO();
    CytowebUtil._highlight = false;
};