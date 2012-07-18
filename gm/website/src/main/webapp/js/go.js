$(function(){
	if( $("#results_page").size() == 0 ){
		return; // ignore this js file if on front page
	}

    // use n colours max where n is the number of colours defined here
    var colours0 = [ "#ffdbd9", "#dbefff", "#f8ffd9", "#e6ddff", "#d9ffdf", "#ffd9fd", "#ffefd9" ];
    var colours1 = [ "#c26661", "#639bc7", "#9bae48", "#7e64c6", "#5fc16f", "#bd60b8", "#b1813f" ];
    var colours2 = [ "#491512", "#0f2a40", "#384110", "#1e1142", "#104017", "#40103d", "#402c10" ];
    
    var query_colour0 = "#e0e0e0";
    var query_colour1 = "#8a8a8a";
    var query_colour2 = "#303030";
    
    var full_colour0 = "#ffffff";
    var full_colour1 = "#303030";
    var full_colour2 = "#a0a0a0";
    
    $("#go_tab").attr("defaultcolour0", full_colour0);
    $("#go_tab").attr("defaultcolour1", full_colour1);
    $("#go_tab").attr("defaultcolour2", full_colour2);
    
    function set_default_colours(){
        $("#go_tab").attr("colour0", full_colour0);
        $("#go_tab").attr("colour1", full_colour1);
        $("#go_tab").attr("colour2", full_colour2);
    }
    
    $("#go_tab").attr("querycolour0", query_colour0);
    $("#go_tab").attr("querycolour1", query_colour1);
    $("#go_tab").attr("querycolour2", query_colour2);
    
    function update_next_colours(){
        $("#go_tab").attr("colour0", colours0[0]);
        $("#go_tab").attr("colour1", colours1[0]);
        $("#go_tab").attr("colour2", colours2[0]);
    }
    update_next_colours();
    
    var NO_COLOURS_MSG = "<p>No colours have been added.</p>";

    $("#go_tab .content table tr").append('<td class="add_button"></td>');
    
    $("#go_tab .sort_list").append(NO_COLOURS_MSG);
    
    // convert to lower case
    $("#go_tab .content table tbody .annotation").each(function(){
        $(this).html( ("" + $(this).text()).replace("_", " ") );
        $(this).attr( "value", $(this).text() );
    });
    
    // convert to lower case
    $("#go_tab .content table tbody .pval").each(function(){
        $(this).html( $(this).text().toLowerCase() );
    });
    
    // make value sort by numerator
    $("#go_tab .content table tbody .coverage").each(function(){
        
        var val = ("" + $(this).attr("value")).match(/^(\d+)\/(\d+)$/);
        
        if(val){
            var top = parseFloat( val[1] );
            var bot = parseFloat( val[2] );
            $(this).attr("value", top);
        }
    });
    
    $("#go_tab .sort_list").disableSelection().sortable({
        sort: function(){
            update_priorities();
        },
        start: function(){
            $("#go_tab .overlay").show();
        },
        stop: function(){
            $("#go_tab .overlay").hide();
            update_legend();
            update_graph_colouring();
            $("#go_tab .colouring.hover").trigger("mouseup");
        },
        axis: "y",
        containment: "parent",
        items: ".colouring",
        tolerance: "pointer"
    });

    function update_priorities(){
        $("#go_tab .sort_list .colouring").not(".ui-sortable-helper").each(function(){
            var ones_before = $(this).prevAll(".colouring").not(".ui-sortable-helper").size();
            var ordinal = ones_before + 1;
            $(this).find(".priority").html( ordinal );
        });
    }
    
    function update_graph_colouring(){
        CytowebUtil.updateGO();
    }
    
    function update_go_list_colouring(){
        CytowebUtil.updateGOColoursForGenes();
    }
    
    var legend_update_semaphore = 0;
    function update_legend(){

        if( $("#go_legend").is(":visible") ){
            build_legend();
        } else {
        
            var i = ++legend_update_semaphore;
            $("#menu_go_legend").one("click", function(){
                if( i == legend_update_semaphore ){
                    build_legend();
                    legend_update_semaphore = 0;
                }
            });
        }
        
        function build_legend(){
            $("#go_legend .content").children().not(".instructions").remove();
            
            if( $("#go_tab .colouring").size() == 0 ){
                $("#go_legend .instructions").show();
            } else {
                $("#go_legend .instructions").hide();
                $("#go_legend .content").append(' <table> <tbody></tbody> </table> ');
            }
            
            $("#go_tab .colouring").each(function(){
                
                var colour0 = $(this).attr("colour0");
                var colour1 = $(this).attr("colour1");
                var colour2 = $(this).attr("colour2");
                
                var entry = $('<tr>\
                    <td><div class="legend_square"></div></td>\
                    <td>' + $(this).find(".annotation").text() + '</td>\
                    </tr>');
                
                entry.find(".legend_square").css({
                    backgroundColor: colour0,
                    borderColor: colour1
                });
                
                $("#go_legend .content table tbody").append(entry);
                
                
            });
        }
    }
    
    var colouring_mouse_down = false;
    function add_to_colouring(tr){
        if( $("#go_tab .colouring").size() == 0 ){
            $("#go_tab .sort_list").empty(); // remove help msg if necessary
        }
        
        var is_query_genes = tr.hasClass("query");
        var colour0 = ( is_query_genes ? query_colour0 : colours0.shift() );
        var colour1 = ( is_query_genes ? query_colour1 : colours1.shift() );
        var colour2 = ( is_query_genes ? query_colour2 : colours2.shift() );
        
        var ocid = tr.find(".annotation").attr("ocid");
        var colouring = $('<div class="colouring' + (is_query_genes ? ' query' : '') + '" colour0="' + colour0 + '" colour1="' + colour1 + '" colour2="' + colour2 + '" ocid="' + ocid + '">\
                                <div class="grip" tooltip="Click and drag to reorder in the functions coloring list."> <span class="ui-icon ui-icon-grip-solid-horizontal"></span> </div>\
                                <div class="reorder_icon"> <span class="ui-icon ui-icon-arrowthick-2-n-s"></span> </div>\
                                <div class="colour"></div>\
                                <div class="priority"></div>\
                                <div class="annotation" ocid="' + ocid + '">' + tr.find(".annotation").text() + '</div>\
                                <div class="ui-state-default ui-corner-all button" tooltip="Click to remove from the functions coloring list."> <span class="ui-icon ui-icon-minus"></span> </div>\
                        </div>');
        colouring.find(".colour").css({
            "background-color": colour0,
            "border-color": colour1
        });
        $("#go_tab .sort_list").prepend(colouring);
        
        function inside_colouring(e){
            return $(e.toElement).parents(".colouring").attr("ocid") == ocid;
        }
        
        var mouse_out = true;

        colouring.bind("mouseover", function(e){
        
            if( mouse_out ){        
                if( !colouring_mouse_down ){                
                    colouring.addClass("hover");
                    
                    /*
                    colouring.find(".colour").css({
                        backgroundColor: colour1,
                        borderColor: colour2
                    });
                    */
                    
                    $("#go_tab .content table td[ocid=" + ocid + "]").trigger("mouseover");
                }
                mouse_out = false;
            }
        }).bind("mousedown", function(e){
            colouring_mouse_down = true;
        }).bind("mouseup", function(e){
            colouring_mouse_down = false;
            
            update_priorities();
            
            if( mouse_out ){
                colouring.removeClass("hover");
                
                /*
                colouring.find(".colour").css({
                    backgroundColor: colour0,
                    borderColor: colour1
                });
                */

                $("#go_tab .content table td[ocid=" + ocid + "]").trigger("mouseout");
            }
        }).bind("mouseout", function(e){
            if( !mouse_out && !inside_colouring(e) ){
                mouse_out = true;
                
                update_priorities();
                
                if( !colouring_mouse_down ){
                    colouring.removeClass("hover");
                    
                    /*
                    colouring.find(".colour").css({
                        backgroundColor: colour0,
                        borderColor: colour1
                    });
                    */
                    
                    $("#go_tab .content table td[ocid=" + ocid + "]").trigger("mouseout");
                }
            }
        });

        colouring.find(".button").bind("click", function(){
            tr.find(".button").click();
            $("#go_tab .content table td[ocid=" + ocid + "]").trigger("mouseout");
        });
        
        if( colours0.length == 0 ){
            disable_buttons();
            set_default_colours();
        }
        
        update_next_colours();
        update_priorities();
        update_legend();
        resize_sidebar();
        update_graph_colouring();
        update_go_list_colouring();
        
        track("Functions", "Add colouring");
    }
    
    function remove_from_colouring(tr){
        $("#go_tab .sort_list").find(".annotation").each(function(){
            if( $(this).attr("ocid") == tr.find(".annotation").attr("ocid") ){
                if( !tr.hasClass("query") ){
                    var colouring = $(this).parent(".colouring");
                    colours0.unshift( colouring.attr("colour0") );
                    colours1.unshift( colouring.attr("colour1") );
                    colours2.unshift( colouring.attr("colour2") );
                }
                $(this).parent(".colouring").remove();
            }
        });
        
        if( $("#go_tab .sort_list").children().size() == 0 ){
            $("#go_tab .sort_list").append(NO_COLOURS_MSG); // add help msg
        }
        
        
        if( !tr.hasClass("query") ){
            update_next_colours();
            enable_buttons();
        }
        
        update_priorities();
        update_legend();
        resize_sidebar();
        update_graph_colouring();
        update_go_list_colouring();
        
        track("Functions", "Remove colouring");
    }
    
    function resize_sidebar(){
        $(window).trigger("resize");
    }
    
    function disable_buttons(){
        $("#go_tab .content .button").not(".ui-state-active").addClass("ui-state-disabled");
        $("#go_tab tr.query .button").removeClass("ui-state-disabled");
    }
    
    function enable_buttons(){
        $("#go_tab .content .button").removeClass("ui-state-disabled");
    }
    
    $("#go_tab .content table > tbody > tr > td.add_button").each(function(){
        var button = $('<div tooltip="Click to add to or remove from the functions coloring list." class="ui-state-default ui-corner-all button"><span class="ui-icon ui-icon-plus"></span></div>');
        var tr = $(this).parent();
        
        $(this).append(button);
        
        button.bind("click", function(){
            if( $(this).hasClass("ui-state-disabled") ){
                return;
            }
        
            if( ! $(this).hasClass("ui-state-active") ){
                $(this).addClass("ui-state-active");
                add_to_colouring(tr);
            } else {
                $(this).removeClass("ui-state-active");
                remove_from_colouring(tr);
            }         
        });
        
    });
    
    $.tablesorter.addParser({ 
        // set a unique id 
        id: 'exponent', 
        is: function(s) { 
            return ("" + s).match( /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/ ) != null;
        }, 
        format: function(s) { 
            return s;
        }, 
        type: 'numeric' 
    }); 
    
    $("#go_tab .content table").tablesorter({
        textExtraction: function(node){
            var ele = $(node);
            var val = "" + ele.attr("value");
            return val;
        }
    });
    
    $("#go_tab .content table .header.pval").click();
    
    var timeout = undefined;
    var ctimeout = undefined;
    var go_id = undefined;
    
    $("#go_tab tbody tr").each(function(){
    
        $(this).find(".annotation, .pval, .coverage, .add_button").each(function(){
            
            var time = 200;
            var ele = $(this);
            var anno = $(this).parent().find(".annotation");
            var ocid = anno.attr("ocid");
            var tr = $(this).parent();
            var is_query_genes = tr.hasClass("query");
            
            function same_row(e){
                if( !e.toElement || !e.fromElement ){
                    return false;
                }
                
                function get_ocid(ele){
                    var anno = $(ele).parents("tr:first").find(".annotation");
                    return anno.attr("ocid");
                }
                
                var ocid_to = get_ocid(e.toElement);
                var ocid_from = get_ocid(e.fromElement);
                
                if( ocid_to == undefined || ocid_from == undefined ){
                    return false;
                }
                
                return ocid_to == ocid_from;
            }
            
            $(this).bind("mouseover", function(e){
                if( !same_row(e) ){
                    
                    var colouring = $("#go_tab .colouring[ocid=" + ocid + "]");
                    var colour0, colour1, colour2;
                
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
                
                    go_id = ocid;
                    tr.addClass("preview").children().css({
                        backgroundColor: colour0, 
                        borderColor: colour1 
                    });
                    
                    if( tr.prev().size() > 0 ){
                        tr.prev().addClass("before_preview").children().css({
                            borderBottomColor: colour1 
                        });
                    } else {
                        tr.parents("table:first").find("thead tr").addClass("before_preview").children().css({
                            borderBottomColor: colour1
                        });
                    }
                    timeout = setTimeout(function(){
                        if( go_id == ocid ){
                            CytowebUtil.highlightGO( ocid, is_query_genes );
                            timeout = undefined;
                        }
                    }, time);
                    clearTimeout(ctimeout);
                }
            }).bind("mouseout", function(e){
                
                if( !same_row(e) ){
                
                    go_id = undefined;
                    tr.removeClass("preview").children().css({
                        backgroundColor: "",
                        borderColor: ""
                    });
                    tr.parents("table:first").find(".before_preview").removeClass("before_preview").children().css({
                        backgroundColor: "",
                        borderColor: ""
                    });
                    
                    ctimeout = setTimeout(function(){
                        
                        if( go_id != ocid ){
                            CytowebUtil.unhighlightGO( ocid, is_query_genes );
                        }
                    }, time/2);
                    clearTimeout(timeout);
                }
            });
        });
    });    
    
    $("#go_tab .content").append('<div class="overlay"></div>');
    $("#go_tab .content .overlay").hide();
    
    
    progress("ontology");
    
    
});