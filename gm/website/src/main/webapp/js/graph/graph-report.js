CytowebUtil.generateReport = function(token, params) {
	
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

	
};
