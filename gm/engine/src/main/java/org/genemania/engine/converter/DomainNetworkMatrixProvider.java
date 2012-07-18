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

import no.uib.cipr.matrix.Matrix;

import org.apache.log4j.Logger;
import org.genemania.domain.InteractionNetwork;
import org.genemania.exception.ApplicationException;
import org.genemania.mediator.NetworkMediator;
import org.genemania.util.ProgressReporter;

/**
 * build a matrix representation of interactions from the given network.
 *
 */
public class DomainNetworkMatrixProvider extends CursorNetworkMatrixProvider implements INetworkMatrixProvider {
	private static Logger logger = Logger.getLogger(DomainNetworkMatrixProvider.class);
	
	int organismId;
	NetworkMediator networkMediator;
	
	public DomainNetworkMatrixProvider(int organismId, NetworkMediator networkMediator, Mapping<String, Integer> mapping) {
		this.organismId = organismId;
		this.networkMediator = networkMediator;
		this.mapping = mapping;
	}
	
	public Matrix getNetworkMatrix(int networkId, ProgressReporter progress) {		
		InteractionNetwork network = networkMediator.getNetwork(networkId);
		try {
            cursor = networkMediator.createInteractionCursor(network.getId());
            try {
                return convertNetworkToMatrix(progress);
            }
            finally {
                // you would think that we ought to free any resources
                // being held by the cursor before exiting ... but for
                // some reason this blows up ... it may be because the base
                // cursor is closing the connection ... and we are sometimes
                // using a connection pool but sometimes not?

                //cursor.close();
            }
		}
		catch (ApplicationException e) { // TODO: logging, or propagate
			return null;
		}
	}
}
