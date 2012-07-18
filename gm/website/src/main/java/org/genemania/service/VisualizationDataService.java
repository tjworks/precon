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
package org.genemania.service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.genemania.domain.SearchResults;

/**
 * Provides a way to convert a search result to visualization data for cytoweb
 */
public interface VisualizationDataService {

	/**
	 * Gets the visualization data for cytoweb
	 * 
	 * @param results
	 *            Search results from the engine
	 * @return The data needed by cytoweb
	 */
	public Visualization getVisualizationData(SearchResults results);

	public static class Visualization {
		Schema dataSchema;
		Data data;

		public Visualization() {
			this.dataSchema = new Schema();
		}

		public Schema getDataSchema() {
			return dataSchema;
		}

		public void setDataSchema(Schema schema) {
			this.dataSchema = schema;
		}

		public Data getData() {
			return data;
		}

		public void setData(Data data) {
			this.data = data;
		}

	}

	public static class Data {
		Collection<Node> nodes;
		Collection<Edge> edges;

		public Collection<Node> getNodes() {
			return nodes;
		}

		public void setNodes(Collection<Node> nodes) {
			this.nodes = nodes;
		}

		public Collection<Edge> getEdges() {
			return edges;
		}

		public void setEdges(Collection<Edge> edges) {
			this.edges = edges;
		}

	}

	public static class Schema {
		Collection<SchemaEntry> nodes;
		Collection<SchemaEntry> edges;

		public Schema() {
			this.nodes = Arrays.asList(new SchemaEntry("score", "number"),
					new SchemaEntry("rawScore", "number"), new SchemaEntry(
							"symbol", "string"), new SchemaEntry("ocids",
							"object"), new SchemaEntry("queryGene", "boolean"),
					new SchemaEntry("id", "string"));

			this.edges = Arrays.asList(new SchemaEntry("weight", "number"),
					new SchemaEntry("networkGroupCode", "string"),
					new SchemaEntry("networkGroupId", "int"), new SchemaEntry(
							"networkIdToWeight", "object"), new SchemaEntry(
							"source", "string"), new SchemaEntry("target",
							"string"), new SchemaEntry("id", "string"),
					new SchemaEntry("networkNames", "object"), new SchemaEntry(
							"networkGroupName", "string"), new SchemaEntry(
							"targetName", "string"), new SchemaEntry(
							"sourceName", "string"));
		}

		public Collection<SchemaEntry> getNodes() {
			return nodes;
		}

		public void setNodes(Collection<SchemaEntry> nodes) {
			this.nodes = nodes;
		}

		public Collection<SchemaEntry> getEdges() {
			return edges;
		}

		public void setEdges(Collection<SchemaEntry> edges) {
			this.edges = edges;
		}

	}

	public static class SchemaEntry {
		String name;
		String type;

		public SchemaEntry() {

		}

		public SchemaEntry(String name, String type) {
			this.name = name;
			this.type = type;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

	}

	public static class Node implements Comparable {
		double score;
		double rawScore;
		String symbol;
		Collection<Long> ocids;
		boolean queryGene;
		String id;

		public double getScore() {
			return score;
		}

		public void setScore(double score) {
			this.score = score;
		}

		public String getSymbol() {
			return symbol;
		}

		public void setSymbol(String symbol) {
			this.symbol = symbol;
		}

		public Collection<Long> getOcids() {
			return ocids;
		}

		public void setOcids(Collection<Long> ocids) {
			this.ocids = ocids;
		}

		public boolean isQueryGene() {
			return queryGene;
		}

		public void setQueryGene(boolean queryGene) {
			this.queryGene = queryGene;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public double getRawScore() {
			return rawScore;
		}

		public void setRawScore(double rawScore) {
			this.rawScore = rawScore;
		}

		@Override
		public int compareTo(Object o) {
			if (o instanceof Node) {
				Node other = (Node) o;

				if (this.getRawScore() > other.getRawScore()) {
					return 1;
				} else if (this.getRawScore() < other.getRawScore()) {
					return -1;
				} else {
					return 0;
				}
			}
			return 0;
		}

	}

	public static class Edge implements Comparable {
		double weight;
		String id;
		String networkGroupCode;
		long networkGroupId;
		Map<Long, Double> networkIdToWeight;
		String source;
		String target;
		List<String> networkNames;
		String networkGroupName;
		String targetName;
		String sourceName;

		public double getWeight() {
			return weight;
		}

		public void setWeight(double weight) {
			this.weight = weight;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getNetworkGroupCode() {
			return networkGroupCode;
		}

		public void setNetworkGroupCode(String networkGroupCode) {
			this.networkGroupCode = networkGroupCode;
		}

		public long getNetworkGroupId() {
			return networkGroupId;
		}

		public void setNetworkGroupId(long networkGroupId) {
			this.networkGroupId = networkGroupId;
		}

		public String getSource() {
			return source;
		}

		public void setSource(String source) {
			this.source = source;
		}

		public String getTarget() {
			return target;
		}

		public void setTarget(String target) {
			this.target = target;
		}

		public Map<Long, Double> getNetworkIdToWeight() {
			return networkIdToWeight;
		}

		public void setNetworkIdToWeight(Map<Long, Double> networkIdToWeight) {
			this.networkIdToWeight = networkIdToWeight;
		}

		public String getNetworkGroupName() {
			return networkGroupName;
		}

		public void setNetworkGroupName(String networkGroupName) {
			this.networkGroupName = networkGroupName;
		}

		public String getTargetName() {
			return targetName;
		}

		public void setTargetName(String targetName) {
			this.targetName = targetName;
		}

		public String getSourceName() {
			return sourceName;
		}

		public void setSourceName(String sourceName) {
			this.sourceName = sourceName;
		}

		public List<String> getNetworkNames() {
			return networkNames;
		}

		public void setNetworkNames(List<String> networkNames) {
			this.networkNames = networkNames;
		}

		@Override
		public int compareTo(Object o) {

			if (o instanceof Edge) {
				Edge other = (Edge) o;

				if (!this.getNetworkGroupName().equals(
						other.getNetworkGroupName())) {
					return this.getNetworkGroupName().compareToIgnoreCase(
							other.getNetworkGroupName());
				} else if (this.getWeight() > other.getWeight()) {
					return -1;
				} else if (this.getWeight() < other.getWeight()) {
					return 1;
				} else {
					return 0;
				}
			}

			return 0;
		}

	}

}
