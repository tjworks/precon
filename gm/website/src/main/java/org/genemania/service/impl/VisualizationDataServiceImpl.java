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

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.genemania.domain.Interaction;
import org.genemania.domain.ResultGene;
import org.genemania.domain.ResultInteractionNetwork;
import org.genemania.domain.ResultInteractionNetworkGroup;
import org.genemania.domain.ResultOntologyCategory;
import org.genemania.domain.SearchResults;
import org.genemania.service.VisualizationDataService;

public class VisualizationDataServiceImpl implements VisualizationDataService {

	@Override
	public Visualization getVisualizationData(SearchResults results) {

		Visualization vis = new Visualization();
		Data data = new Data();
		Map<Long, ResultGene> idToResultGene = new HashMap<Long, ResultGene>();

		Collection<Node> nodes = new LinkedList<Node>();
		for (ResultGene rGene : results.getResultGenes()) {
			Node node = new Node();
			node.setId("" + rGene.getGene().getNode().getId());
			node.setQueryGene(rGene.isQueryGene());
			node.setRawScore(rGene.getScore());
			node.setSymbol(rGene.getGene().getSymbol());
			idToResultGene.put(rGene.getGene().getNode().getId(), rGene);

			Collection<Long> ocids = new LinkedList<Long>();
			for (ResultOntologyCategory rOCat : rGene
					.getResultOntologyCategories()) {
				ocids.add(rOCat.getId());
			}
			node.setOcids(ocids);

			nodes.add(node);
		}

		Double highestScore = 0.0;
		Double lowestNonZeroScore = null;
		for (Node node : nodes) {
			if (!node.isQueryGene()) {

				if (node.getRawScore() > highestScore) {
					highestScore = node.getRawScore();
				} else if (node.getRawScore() != 0.0) {
					if (lowestNonZeroScore == null
							|| node.getRawScore() < lowestNonZeroScore) {
						lowestNonZeroScore = node.getRawScore();
					}
				}

			}
		}
		for (Node node : nodes) {
			if (node.isQueryGene()) {
				node.setScore(highestScore);
			} else {
				node.setScore(node.getRawScore() == 0.0 ? lowestNonZeroScore
						: node.getRawScore());
			}
		}
		Collections.sort((List) nodes);
		data.setNodes(nodes);

		Collection<Edge> edges = new LinkedList<Edge>();
		Map<InteractionId, Edge> idToEdge = new HashMap<InteractionId, Edge>();

		for (ResultInteractionNetworkGroup rNetworkGroup : results
				.getResultNetworkGroups()) {

			for (ResultInteractionNetwork rNetwork : rNetworkGroup
					.getResultNetworks()) {

				for (Interaction interaction : rNetwork.getNetwork()
						.getInteractions()) {

					InteractionId id = new InteractionId(rNetworkGroup
							.getNetworkGroup().getCode(), interaction
							.getFromNode().getId(), interaction.getToNode()
							.getId());

					// create edge
					Edge edge;
					if (!idToEdge.containsKey(id)) {
						edge = new Edge();
						edge.setId(id.toString());
						edge.setNetworkGroupCode(rNetworkGroup
								.getNetworkGroup().getCode());
						edge.setNetworkGroupId(rNetworkGroup.getNetworkGroup()
								.getId());
						edge.setSource("" + interaction.getFromNode().getId());
						edge.setTarget("" + interaction.getToNode().getId());
						edge.setWeight(interaction.getWeight());
						edge.setNetworkIdToWeight(new HashMap<Long, Double>());
						edge.setNetworkGroupName(rNetworkGroup
								.getNetworkGroup().getName());
						edge.setNetworkNames(new LinkedList<String>());
						edge.getNetworkNames().add(
								rNetwork.getNetwork().getName());

						ResultGene from = idToResultGene.get(interaction
								.getFromNode().getId());
						ResultGene to = idToResultGene.get(interaction
								.getToNode().getId());
						edge.setSourceName(from.getGene().getSymbol());
						edge.setTargetName(to.getGene().getSymbol());

						edges.add(edge);
						idToEdge.put(id, edge);
					} else {
						edge = idToEdge.get(id);

						double prevWeight = edge.getWeight();
						edge.setWeight(prevWeight + edge.getWeight());

						edge.getNetworkNames().add(
								rNetwork.getNetwork().getName());
					}

					// add network weights for edge

					Long netId = rNetwork.getNetwork().getId();
					if (!edge.getNetworkIdToWeight().keySet().contains(
							rNetwork.getNetwork().getId())) {
						edge.getNetworkIdToWeight().put(netId, 0.0);
					}

					Double weight = (double) interaction.getWeight();
					Double prevWeight = edge.getNetworkIdToWeight().get(netId);
					edge.getNetworkIdToWeight().put(netId, prevWeight + weight);
				}
			}
		}

		// sort network names in each edge
		for (Edge edge : edges) {
			Collections.sort(edge.getNetworkNames());
		}

		Collections.sort((List) edges);
		data.setEdges(edges);

		vis.setData(data);
		return vis;
	}

	private static class InteractionId {
		private long smallId;
		private long largeId;
		private String groupName;

		public InteractionId(String groupName, long id1, long id2) {
			this.groupName = groupName;

			if (id1 > id2) {
				this.smallId = id2;
				this.largeId = id1;
			} else {
				this.smallId = id1;
				this.largeId = id2;
			}
		}

		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result
					+ ((groupName == null) ? 0 : groupName.hashCode());
			result = prime * result + (int) (largeId ^ (largeId >>> 32));
			result = prime * result + (int) (smallId ^ (smallId >>> 32));
			return result;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			InteractionId other = (InteractionId) obj;
			if (groupName == null) {
				if (other.groupName != null)
					return false;
			} else if (!groupName.equals(other.groupName))
				return false;
			if (largeId != other.largeId)
				return false;
			if (smallId != other.smallId)
				return false;
			return true;
		}

		@Override
		public String toString() {
			return smallId + "-" + largeId + ":" + groupName;
		}

	}
}
