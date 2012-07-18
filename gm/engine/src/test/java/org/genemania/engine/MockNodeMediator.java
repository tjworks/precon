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

package org.genemania.engine;

import java.util.Collection;
import java.util.HashMap;

import org.genemania.domain.Node;
import org.genemania.mediator.NodeMediator;

/**
 * mock mediator for testing, creates and returns
 * a node object with given id, unless initialized
 * with a collection of node objects, in which case
 * it keeps and returns the node if found or else null.
 *
 */
public class MockNodeMediator implements NodeMediator {

	private HashMap<Long, Node> nodeMap = null;
	
	public MockNodeMediator(Collection<Node> nodes) {	
		nodeMap = new HashMap<Long, Node>();
		for (Node node: nodes) {
			nodeMap.put(node.getId(), node);
		}
	}
	
	public MockNodeMediator() {		
	}
	
	public Node getNode(long id, long organismId) {
		if (nodeMap != null) {
			return nodeMap.get(id);
		}
		else {
			return createNodeForId(id);
		}
	}
	
	private Node createNodeForId(long id) {
		Node node = new Node();
		node.setId(id);
		node.setName("node"+id);
		return node;		
	}

}
