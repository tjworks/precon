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

import org.genemania.domain.InteractionNetwork;
import org.genemania.exception.ApplicationException;
import org.genemania.mediator.InteractionCursor;
import org.genemania.mediator.NetworkMediator;

/**
 * construct a mapping using cursor objects to retrieve the
 * interactions. hopefully performs better than individual
 * domain objects ... particularly when the cursor can
 * stream over the interactions without loading them all
 * into memory & without creating individual objects for
 * each interaction.
 *
 */
public class CursorNetworkToMappingBuilder extends AbstractNetworkToMappingBuilder implements INetworkToMappingBuilder {
	
	private NetworkMediator networkMediator;
	
	public CursorNetworkToMappingBuilder(NetworkMediator networkMediator) {
		this.networkMediator = networkMediator;
	}
	/* 
	 * TODO: we are swallowing exceptions here, either log or propagate
	 * 
	 * (non-Javadoc)
	 * @see org.genemania.engine.INetworkToMapping#addNetwork(org.genemania.domain.InteractionNetwork)
	 */
	public void addNetwork(InteractionNetwork network) {
		int nextIndex = mapping.size();
		InteractionCursor cursor = networkMediator.createInteractionCursor(network.getId());

		try {
			while (cursor.next()) {
				// from node
				int id = (int) cursor.getFromNodeId();
				String name = makeFakeNodeName(id); // we could update the cursor to also contain the node name ... do we really need this?
				mapping.addAlias(name, id);

				// to node
				id = (int) cursor.getToNodeId();
				name = makeFakeNodeName(id);
				mapping.addAlias(name, id);
			}
		}
		catch (ApplicationException e) {}
		finally {
			if (cursor != null) {
				try {
					cursor.close();
				}
				catch (ApplicationException e) {}
			}
		}
	}
	
	private String makeFakeNodeName(int id) {
		return "Node" + id;
	}
}
