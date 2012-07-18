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
 * common code factored out from builder implementations
 *
 */
public abstract class AbstractNetworkToMappingBuilder implements INetworkToMappingBuilder {
	protected Mapping<String, Integer> mapping = new Mapping<String, Integer>();
	
	public Mapping<String, Integer> getMapping() {
		return mapping;
	}

	public void addNodes(Collection<Node> nodeList) {
		if (nodeList != null) {
			for (Node node: nodeList) {
				addNode(node);
			}
		}			
	}
	
	public void addNode(Node node) {
		String name = node.getName();
		int id = (int) node.getId();
		mapping.addAlias(name, id);
	}

	public void addNetworks(Collection<InteractionNetwork> networks) {
		if (networks != null) {
			for (InteractionNetwork network: networks) {
				addNetwork(network);
			}
		}
	}

}
