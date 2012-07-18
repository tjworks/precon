<ul id="networks_widget" class="checktree">
	<c:forEach items="${results.resultNetworkGroups}" var="rNetworkGroup">
		<li class="checktree_top_level" id="networkGroup${rNetworkGroup.networkGroup.id}">
			<input class="widget" type="checkbox" />
			<div class="label" id="networkGroupLabel${rNetworkGroup.networkGroup.id}">
				<div class="per_cent_text">
					<span tooltip="<spring:message code='networks_tab.weight_text.tooltip'/>" id="networkGroupWeight${rNetworkGroup.networkGroup.id}"><fmt:formatNumber value="${rNetworkGroup.weight * 100}" minFractionDigits="2" maxFractionDigits="2" /> %</span>
				</div>
				<div class="colour" id="networkColour${rNetworkGroup.networkGroup.id}"></div>
				<div class="network_name" id="networkGroupName${rNetworkGroup.networkGroup.id}">${rNetworkGroup.networkGroup.name}</div>
			</div>
			<div class="per_cent_bar">
				<div class="bar" id="networkGroupBar${rNetworkGroup.networkGroup.id}" tooltip="<spring:message code='networks_tab.weight_bar.tooltip'/>"></div>
			</div>
			
			<ul>
				<c:forEach items="${rNetworkGroup.resultNetworks}" var="rNetwork">
					<li class="checktree_network" id="network${rNetwork.network.id}">
						<input class="widget" type="checkbox"/>
						<div class="label" id="networkLabel${rNetwork.network.id}">
							<div class="per_cent_text">
								<span tooltip="<spring:message code='networks_tab.weight_text.tooltip'/>" id="networkWeight${rNetwork.network.id}"><fmt:formatNumber value="${rNetwork.weight * 100}" minFractionDigits="2" maxFractionDigits="2" /> %</span>
							</div>
							<div class="network_name" id="networkName${rNetwork.network.id}">${rNetwork.network.name}</div>
						</div>
						<div class="per_cent_bar">
							<div class="bar" id="networkBar${rNetwork.network.id}" tooltip="<spring:message code='networks_tab.weight_bar.tooltip'/>"></div>
						</div>
						
						<ul>
							<li>
								<div class="text" id="networkDescription${rNetwork.network.id}">
								
									<c:set var="network" value="${rNetwork.network}" />
									<%@ include file="network.jsp" %>
									
								</div>
							</li>
						</ul>
						
					</li>
				</c:forEach>
			</ul>
			
		</li>
	</c:forEach>
</ul>