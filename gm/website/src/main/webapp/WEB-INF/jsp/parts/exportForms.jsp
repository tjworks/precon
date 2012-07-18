<div id="export_forms">
	
	<form id="resubmit_form" method="post" action="${pageContext.request.contextPath}/">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="text_form" method="post" action="${pageContext.request.contextPath}/text/genemania_network.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="params_form" method="post" action="${pageContext.request.contextPath}/params/search_parameters.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="params_json_form" method="post" action="${pageContext.request.contextPath}/params_json/search_parameters.json">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="networks_form" method="post" action="${pageContext.request.contextPath}/networks/networks_list.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="genes_form" method="post" action="${pageContext.request.contextPath}/genes/genes_list.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="go_form" method="post" action="${pageContext.request.contextPath}/go/functions_list.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="interactions_form" method="post" action="${pageContext.request.contextPath}/interactions/interactions_list.txt">
		<%@ include file="postedParamsAsInputs.jsp" %>
	</form>
	
	<form id="print_form" method="post" action="${pageContext.request.contextPath}/print" target="_blank">
		<%@ include file="postedParamsAsInputs.jsp" %>
		
		<textarea name="geneshtml"></textarea>
		<textarea name="networkshtml"></textarea>
		<textarea name="gohtml"></textarea>
	</form>
	
   	<form id="svg_form" method="post" action="${pageContext.request.contextPath}/file/genemania_network.svg">
   		<input type='hidden' name='content' value='${svg}' />
   		<input type="hidden" name="type" value="image/svg+xml" />
   		<input type="hidden" name="disposition" value="attachment" />
   	</form>

</div>