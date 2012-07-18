/**
 * This file is part of GeneMANIA.
 * Copyright (C) 2010 University of Toronto.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
package org.genemania.controller.rest;

import java.util.Collection;

import javax.servlet.http.HttpSession;

import org.genemania.domain.Gene;
import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.Organism;
import org.genemania.domain.SearchParameters;
import org.genemania.domain.SearchResults;
import org.genemania.exception.DataStoreException;
import org.genemania.service.GeneService;
import org.genemania.service.NetworkService;
import org.genemania.service.OrganismService;
import org.genemania.service.SearchService;
import org.genemania.service.StatsService;
import org.genemania.service.VisualizationDataService;
import org.genemania.service.GeneService.GeneNames;
import org.genemania.service.VisualizationDataService.Visualization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class VisualizationDataController {

	@Autowired
	private OrganismService organismService;

	@Autowired
	private StatsService statsService;

	@Autowired
	private NetworkService networkService;

	@Autowired
	private GeneService geneService;

	@Autowired
	private SearchService searchService;

	private @Autowired
	VisualizationDataService visualizationDataService;

	@RequestMapping(method = RequestMethod.POST, value = "/visualization")
	@ResponseBody
	public Visualization create(
			@RequestParam("organism") Integer organismId,
			@RequestParam("genes") String geneLines,
			@RequestParam("weighting") org.genemania.type.CombiningMethod weighting,
			@RequestParam("threshold") Integer threshold,
			@RequestParam(value = "networks", required = false) Long[] networkIds,
			HttpSession session) throws DataStoreException {

		try {

			// validate organism
			// ============================================

			Organism organism = organismService.findOrganismById(new Long(
					organismId));

			// validate networks
			// ============================================

			Collection<InteractionNetwork> networks = networkService
					.getNetworks(organismId, networkIds, session.getId());

			// validate genes
			// ============================================

			GeneNames geneNames = geneService.getGeneNames(organismId,
					geneLines);
			Collection<Gene> validGenes = geneService.findGenesForOrganism(
					organismId, geneNames.getValidGenes());

			// search param object
			// ============================================

			SearchParameters params = new SearchParameters(organism,
					validGenes, networks, weighting, threshold, session.getId());

			SearchResults results = searchService.search(params);

			return visualizationDataService.getVisualizationData(results);

		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	public SearchService getSearchService() {
		return searchService;
	}

	public void setSearchService(SearchService searchService) {
		this.searchService = searchService;
	}

	public OrganismService getOrganismService() {
		return organismService;
	}

	public void setOrganismService(OrganismService organismService) {
		this.organismService = organismService;
	}

	public StatsService getStatsService() {
		return statsService;
	}

	public void setStatsService(StatsService statsService) {
		this.statsService = statsService;
	}

	public NetworkService getNetworkService() {
		return networkService;
	}

	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}

	public GeneService getGeneService() {
		return geneService;
	}

	public void setGeneService(GeneService geneService) {
		this.geneService = geneService;
	}

	public VisualizationDataService getVisualizationDataService() {
		return visualizationDataService;
	}

	public void setVisualizationDataService(
			VisualizationDataService visualizationDataService) {
		this.visualizationDataService = visualizationDataService;
	}

}
