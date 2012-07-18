CytowebUtil.neighborsHighlighted = false;

CytowebUtil.highlightGene = function(gene_id){
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
};

CytowebUtil.unhighlightGene = function(gene_id){
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
};

CytowebUtil.mergeEdges = function(value) {
	if (value === CytowebUtil.OPTIONS.edgesMerged) return;
	
	if(_vis) {
		CytowebUtil.OPTIONS.edgesMerged = value;
		_vis.edgesMerged(value);
	}
};

CytowebUtil.showNodeLabels = function(value) {
	if (value === CytowebUtil.OPTIONS.nodeLabelsVisible) return;

	if(_vis) {
		CytowebUtil.OPTIONS.nodeLabelsVisible = value;
		_vis.nodeLabelsVisible(value);
	}
};

CytowebUtil.showPanZoomControl = function(value) {
	if (value === CytowebUtil.OPTIONS.panZoomControlVisible) return;
	
	if(_vis) {
		CytowebUtil.OPTIONS.panZoomControlVisible = value;
		_vis.panZoomControlVisible(value);
	}
};

CytowebUtil.transparentEdges = function(value) {
	if(_vis) {
		var style = _vis.visualStyle();
		
		if( value ){
			style.edges.opacity = CytowebUtil.VISUAL_STYLE_OPACITY;
		} else {
			style.edges.opacity = CytowebUtil.DEF_EDGE_OPACITY;
		}

		_vis.visualStyle(style);
	}
};