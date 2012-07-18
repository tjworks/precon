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

import org.genemania.domain.Interaction;
import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.Node;

/**
 * build a mapping from the collection of node objects 
 * associated with an InteractionNetwork in the domain 
 * model. could have bad (memory) performance
 *
 */
public class DomainNetworkToMappingBuilder extends AbstractNetworkToMappingBuilder implements INetworkToMappingBuilder {

	public void addNetwork(InteractionNetwork network) {
		Collection<Interaction> interactions = network.getInteractions();
		for (Interaction interaction: interactions) {
			Node node = interaction.getFromNode();
			addNode(node);
			node = interaction.getToNode();
			addNode(node);			
		}		
	}
}
