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

import java.util.Vector;

import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.Node;
import org.genemania.engine.Utils;

import junit.framework.TestCase;

public class DomainNetworkToMappingBuilderTest extends TestCase {
	
	public void testEmpty() {
		INetworkToMappingBuilder builder = new DomainNetworkToMappingBuilder();
		assertNotNull(builder.getMapping());
		assertEquals(0, builder.getMapping().size());
	}
	
	public void testSimple() {
		
		Vector<Node> nodes = Utils.buildNodes(5, 100);
		Vector<InteractionNetwork> networks = Utils.buildRandomNetworks(nodes, 3, 90125);
		
		INetworkToMappingBuilder builder = new DomainNetworkToMappingBuilder();
		
		for (InteractionNetwork network: networks) {
			builder.addNetwork(network);
		}
		
		Mapping<String, Integer> mapping = builder.getMapping(); 
		assertNotNull(mapping);
		assertEquals(5, mapping.size());
		assertEquals(100, mapping.getUniqueIdForAlias("Node100").intValue());			
	}
}
