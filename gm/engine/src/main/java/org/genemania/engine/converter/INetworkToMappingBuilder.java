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

package org.genemania.engine.converter;

import java.util.Collection;

import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.Node;

/**
 * Build a mapping between Node ID's and indices into 
 * a matrix representation of a network.
 * 
 * Since the matrix indices are dense, we can represent
 * them as an array of integers, so mapping[i] -> node-id
 * corresponding the i'th matrix row/col.
 * 
 * The reverse mapping from node-id to integer is stored in
 * a map, so nodeIdMap.get(nodeId) -> index into matrix for
 * the given nodeId.
 * 
 * To build up a mapping, given a collection of networks, and
 * a collection of additional nodes possibly not in the networks,
 * add each network iteratively, then extract the mapping, eg:
 * 
 *   INetworkToMapingBuilder builder = new SomeNetworkToMappingBuilder(...);
 *   
 *   for (InteractionNetwork network: networkCollection) {
 *       builder.add(network);
 *   }
 *   
 *   builder.addNodes(exraNodesCollection);
 *  
 *   Mapping<String, Integer> = builder.getMapping(); *   
 *   
 * The mapping object returned uses node names as aliases and 
 * node ids as unique ids.
 * 
 */
public interface INetworkToMappingBuilder {
	public Mapping<String, Integer> getMapping();	

	
	/**
	 * Update mapping using nodes appearing in the given network
	 * @param network
	 */
	public void addNetwork(InteractionNetwork network);

	/**
	 * Update mapping with a collection of nodes
	 * @param nodeList
	 */
	public void addNodes(Collection<Node> nodeList);
	
	public void addNode(Node node);
	public void addNetworks(Collection<InteractionNetwork> networks);

}
