<div id="side_bar" class="tabs">     
	<div id="side_bar_toggle_open_bg">
		<div class="button ui-state-default ui-corner-all" id="side_bar_toggle_open"><span class="ui-icon ui-icon-arrowthickstop-1-e"></span></div>
	</div>

	<ul>
	    <li><label><a href="#networks_tab">Networks</a></label></li>
	    <li><label><a href="#genes_tab">Genes</a></label></li>
	    <li><label><a href="#go_tab">Functions</a></label></li>
	    <li><label><a href="#help_tab">Help</a></label></li>
	</ul>
	<%@ include file="networksTab.jsp" %>
	<%@ include file="genesTab.jsp" %>
	<%@ include file="goTab.jsp" %>
	<%@ include file="helpTab.jsp" %>
</div>
