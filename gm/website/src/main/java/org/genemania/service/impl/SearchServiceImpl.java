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
package org.genemania.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.genemania.connector.EngineConnector;
import org.genemania.dao.GeneDao;
import org.genemania.dao.NetworkDao;
import org.genemania.dao.NetworkGroupDao;
import org.genemania.domain.Gene;
import org.genemania.domain.Interaction;
import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.InteractionNetworkGroup;
import org.genemania.domain.OntologyCategory;
import org.genemania.domain.ResultGene;
import org.genemania.domain.ResultInteraction;
import org.genemania.domain.ResultInteractionNetwork;
import org.genemania.domain.ResultInteractionNetworkGroup;
import org.genemania.domain.ResultOntologyCategory;
import org.genemania.domain.SearchParameters;
import org.genemania.domain.SearchResults;
import org.genemania.dto.OntologyCategoryDto;
import org.genemania.dto.RelatedGenesWebRequestDto;
import org.genemania.dto.RelatedGenesWebResponseDto;
import org.genemania.exception.ApplicationException;
import org.genemania.exception.DataStoreException;
import org.genemania.exception.NoUserNetworkException;
import org.genemania.service.NetworkGroupService;
import org.genemania.service.NetworkService;
import org.genemania.service.SearchService;
import org.genemania.type.CombiningMethod;
import org.genemania.util.GeneLinkoutGenerator;
import org.springframework.beans.factory.annotation.Autowired;

public class SearchServiceImpl implements SearchService {

	@Autowired
	EngineConnector engineConnector;

	@Autowired
	GeneDao geneDao;

	@Autowired
	NetworkGroupService networkGroupService;

	@Autowired
	NetworkService networkService;

	@Override
	public SearchResults search(SearchParameters params)
			throws ApplicationException, DataStoreException,
			NoUserNetworkException {

		Collection<Gene> genes = new HashSet<Gene>();
		for (Gene gene : params.getGenes()) {
			genes.add(gene);
		}

		Collection<InteractionNetwork> userNetworks = networkService
				.getUserNetworks(params.getOrganism().getId(),
						params.getNamespace());

		for (InteractionNetwork network : params.getNetworks()) {

			boolean networkBelongsToSession = false;

			if( network.getId() >= 0){
				continue;
			}
			
			if (userNetworks != null) {
				for (InteractionNetwork userNetwork : userNetworks) {

					if (network.getId() == userNetwork.getId()) {
						networkBelongsToSession = true;
						break;
					}

				}
			}

			if (!networkBelongsToSession) {
				throw new NoUserNetworkException(network.getId(),
						network.getName());
			}
		}

		Collection<InteractionNetwork> networks = new HashSet<InteractionNetwork>();
		for (InteractionNetwork network : params.getNetworks()) {
			networks.add(network);
		}

		// dto param object and search
		RelatedGenesWebRequestDto requestDto = new RelatedGenesWebRequestDto();
		requestDto.setOrganismId(params.getOrganism().getId());
		requestDto.setCombiningMethod(params.getWeighting());
		requestDto.setPageSize(params.getResultsSize());
		requestDto.setPages(1); // TODO remove this "pages" thing
		requestDto.setUserDefinedNetworkNamespace(params.getNamespace());
		requestDto.setInputNetworks(networks);
		requestDto.setInputGenes(genes);
		requestDto.setOntologyId(params.getOrganism().getOntology().getId());
		RelatedGenesWebResponseDto responseDto = engineConnector
				.getRelatedGenes(requestDto);

		// hold onto this map to build the unique list of result go terms
		Map<String, ResultOntologyCategory> descrToROcat = new HashMap<String, ResultOntologyCategory>();

		// handle genes results
		// ==================================================

		Map<Long, Gene> idToQueryGene = new HashMap<Long, Gene>();
		Collection<ResultGene> rGenes = new LinkedList<ResultGene>();
		Map<Long, ResultGene> idToResultGene = new HashMap<Long, ResultGene>();

		// whether a gene is a query param gene or not
		Map<Boolean, Set<Long>> isQueryToId = new HashMap<Boolean, Set<Long>>();

		for (Gene gene : params.getGenes()) {
			idToQueryGene.put(gene.getNode().getId(), gene);
		}

		isQueryToId.put(true, new HashSet<Long>());
		isQueryToId.put(false, new HashSet<Long>());

		for (Long id : responseDto.getNodeScoresMap().keySet()) {
			isQueryToId.get(false).add(id);
		}
		for (Gene gene : params.getGenes()) {
			Long id = gene.getNode().getId();
			isQueryToId.get(false).remove(id);
			isQueryToId.get(true).add(id);
		}

		// add genes
		// ==================================================

		for (boolean isQuery : isQueryToId.keySet()) {
			for (Long id : isQueryToId.get(isQuery)) {
				Gene gene = geneDao.findGeneForId(responseDto.getOrganismId(), id);

				double score;
				if (responseDto.getNodeScoresMap().isEmpty()) {
					score = 0.0;
				} else if (responseDto.getNodeScoresMap().containsKey(id)) {
					score = responseDto.getNodeScoresMap().get(id);
				} else {
					score = 0.0;
				}

				Map<String, String> nameToUrl = GeneLinkoutGenerator.instance()
						.getLinkouts(params.getOrganism(), gene.getNode());
				Collection<ResultGene.Link> links = new LinkedList<ResultGene.Link>();

				for (String name : nameToUrl.keySet()) {
					String url = nameToUrl.get(name);
					ResultGene.Link link = new ResultGene.Link(name, url);
					links.add(link);
				}

				Map<String, OntologyCategory> descrToOcat = new HashMap<String, OntologyCategory>();
				Gene queryGene = idToQueryGene.get(gene.getNode().getId());
				String typedName = (queryGene == null ? "" : queryGene
						.getSymbol());
				ResultGene rGene = new ResultGene(gene, score, isQuery, links,
						typedName);
				Collection<OntologyCategory> oCats = responseDto
						.getAnnotations().get(id);
				String[] descrs = new String[oCats == null ? 0 : oCats.size()];

				int i = 0;
				if (oCats != null) {
					for (OntologyCategory oCat : oCats) {
						descrs[i++] = oCat.getDescription();
						descrToOcat.put(oCat.getDescription(), oCat);
					}
				}
				Arrays.sort(descrs);

				for (String descr : descrs) {
					OntologyCategory oCat = descrToOcat.get(descr);
					long oId = oCat.getId();
					OntologyCategoryDto oCatDto = responseDto
							.getOntologyCategories().get(oId);
					ResultOntologyCategory rOCat = new ResultOntologyCategory(
							oCat, oCatDto.getpValue(), oCatDto.getqValue(),
							oCatDto.getNumAnnotatedInSample(),
							oCatDto.getNumAnnotatedInTotal());

					if (!descrToROcat.containsKey(descr)) {
						descrToROcat.put(descr, rOCat);
					}
					rGene.getResultOntologyCategories().add(rOCat);
				}

				rGenes.add(rGene);
				idToResultGene.put(rGene.getGene().getNode().getId(), rGene);
			}
		}

		// sort genes by score
		Collections.sort((LinkedList) rGenes);

		// create networks results
		// ==================================================

		Collection<ResultInteractionNetworkGroup> rNetworkGroups = new LinkedList<ResultInteractionNetworkGroup>();
		Map<String, ResultInteractionNetworkGroup> nameToRNetworkGroup = new HashMap<String, ResultInteractionNetworkGroup>();
		for (InteractionNetwork network : responseDto.getNetworks()) {

			if (network.getId() < 0) {
				InteractionNetwork userNetwork = networkService
						.findNetwork(network.getId());

				if (userNetwork == null) {
					throw new NoUserNetworkException(network.getId(),
							network.getName());
				}

				network.setDefaultSelected(userNetwork.isDefaultSelected());
				network.setDescription(userNetwork.getDescription());
				network.setMetadata(userNetwork.getMetadata());
				network.setName(userNetwork.getName());
				network.setTags(userNetwork.getTags());
			}

			Collection<ResultInteraction> rInteractions = new LinkedList<ResultInteraction>();
			for (Interaction interaction : network.getInteractions()) {
				ResultGene fromGene = idToResultGene.get(interaction
						.getFromNode().getId());
				ResultGene toGene = idToResultGene.get(interaction.getToNode()
						.getId());
				ResultInteraction rInteraction = new ResultInteraction(
						interaction, fromGene, toGene);

				rInteractions.add(rInteraction);
			}

			long id = network.getId();
			double weight = responseDto.getNetworkWeightsMap().get(id);
			ResultInteractionNetwork rNetwork = new ResultInteractionNetwork(
					rInteractions, network, weight);
			String groupName = network.getMetadata().getNetworkType();

			// add result network to result group
			ResultInteractionNetworkGroup rGroup;
			if (nameToRNetworkGroup.containsKey(groupName)) {
				// get existing group
				rGroup = nameToRNetworkGroup.get(groupName);
			} else {
				// create the group
				InteractionNetworkGroup networkGroup = networkGroupService
						.findNetworkGroupByName(params.getOrganism().getId(),
								groupName, params.getNamespace());

				rGroup = new ResultInteractionNetworkGroup();
				rGroup.setNetworkGroup(networkGroup);
				nameToRNetworkGroup.put(groupName, rGroup);
				rNetworkGroups.add(rGroup);
			}
			rGroup.getResultNetworks().add(rNetwork);
		}

		// sort network groups
		Collections.sort((LinkedList) rNetworkGroups);

		// sort networks
		for (ResultInteractionNetworkGroup group : rNetworkGroups) {
			Collections.sort((List) group.getResultNetworks());
		}

		// create GO results
		// ==================================================

		Collection<ResultOntologyCategory> rOCats = new LinkedList<ResultOntologyCategory>();
		for (String descr : descrToROcat.keySet()) {
			ResultOntologyCategory rOCat = descrToROcat.get(descr);
			rOCats.add(rOCat);
		}

		// sort GO results
		Collections.sort((LinkedList) rOCats);

		// actual weighting type
		// ==================================================

		CombiningMethod method = responseDto.getCombiningMethod();

		// return
		SearchResults results = new SearchResults(rNetworkGroups, rGenes,
				rOCats, method);
		return results;
	}

	public EngineConnector getEngineConnector() {
		return engineConnector;
	}

	public void setEngineConnector(EngineConnector engineConnector) {
		this.engineConnector = engineConnector;
	}

	public GeneDao getGeneDao() {
		return geneDao;
	}

	public void setGeneDao(GeneDao geneDao) {
		this.geneDao = geneDao;
	}

	public NetworkGroupService getNetworkGroupService() {
		return networkGroupService;
	}

	public void setNetworkGroupService(NetworkGroupService networkGroupService) {
		this.networkGroupService = networkGroupService;
	}

	public NetworkService getNetworkService() {
		return networkService;
	}

	public void setNetworkService(NetworkService networkService) {
		this.networkService = networkService;
	}

}
