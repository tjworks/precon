CytowebUtil.searchWithSelectedGenes = function(addGenes){
	
	var useOnlySelectedGenes = !addGenes;
	
	if(_vis){
		var selected_genes = _vis.selected("nodes");
		var genes_box = $("#resubmit_form").find("[name=genes]");
		var list = "";
		var addGenes = !useOnlySelectedGenes;
		
		var genes_to_add = [];

		if( addGenes ){
			var genes = _vis.nodes();
			$.each(genes, function(i, gene){
				if( gene.data.queryGene ){
					list += gene.data.symbol + "\n";
				}
			});
		}
		
		$.each(selected_genes, function(i, gene){
			if( addGenes && gene.data.queryGene ){
				// don't add
			} else {
				genes_to_add.push( gene );
			}
		});
		
		$.each(genes_to_add, function(i, gene){
			list += gene.data.symbol + (i < genes_to_add.length - 1 ? "\n" : "");
		});
		
		genes_box.val(list);
		$("#resubmit_form").submit();
		$("#reloader").show();
	}
	
};

CytowebUtil.addSelectedGenesToSearch = function(){
	CytowebUtil.searchWithSelectedGenes(true);
};

CytowebUtil.removeSelectedGenes = function(){
	if(_vis){
		
		var selected_genes = _vis.selected("nodes");
		var genes = _vis.nodes();
		var list = "";
		var selected_symbols_map = {};
		var genes_to_search = [];
		
		$.each(selected_genes, function(i, gene){
			selected_symbols_map[gene.data.symbol] = true;
		});
		
		$.each(genes, function(i, gene){
			if( gene.data.queryGene && !selected_symbols_map[gene.data.symbol] ){
				genes_to_search.push(gene);
			}
		});
		
		$.each(genes_to_search, function(i, gene){
			list += gene.data.symbol + (i < genes_to_search.length - 1 ? "\n" : "");
		});
		
		var genes_box = $("#resubmit_form").find("[name=genes]");
		genes_box.val(list);
		$("#resubmit_form").submit();
		$("#reloader").show();
	}
};