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

package org.genemania.engine.converter.sym;

import java.io.File;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.engine.core.data.NodeIds;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.mediator.impl.FileInteractionCursor;
import org.genemania.util.ProgressReporter;

public class LuceneNetworkSymMatrixProvider extends CursorNetworkSymMatrixProvider {

	private Map<Integer, String> networkMapping;
	private GeneCompletionProvider geneProvider;
	private Map<Long, Long> interactionCounts;

	public LuceneNetworkSymMatrixProvider(GeneCompletionProvider provider, NodeIds nodeIds, Map<Integer, String> networkIdToFileMapping) {
		geneProvider = provider;
		this.nodeIds = nodeIds;
		networkMapping = networkIdToFileMapping;
		interactionCounts = new HashMap<Long, Long>();
	}
	
	public SymMatrix getNetworkMatrix(long networkId, ProgressReporter progress) throws ApplicationException {
		final long[] count = new long[1];
		cursor = new FileInteractionCursor(networkId, new File(networkMapping.get(networkId)), "UTF-8", 0, 1, 2, '\t') {
			@Override
			public boolean next() throws ApplicationException {
				boolean hasNext = super.next();
				if (hasNext) {
					count[0]++;
				}
				return hasNext;
			}
			
			@Override
			public long getFromNodeId() throws ApplicationException {
				Long nodeId = geneProvider.getNodeId(nextLine[idCol1]);
				if (nodeId == null) {
					throw new ApplicationException(nextLine[idCol1]);
				}
				return nodeId;
			}
			
			@Override
			public long getToNodeId() throws ApplicationException {
				Long nodeId = geneProvider.getNodeId(nextLine[idCol2]);
				if (nodeId == null) {
					throw new ApplicationException(nextLine[idCol2]);
				}
				return nodeId;
			}
		};
		try {
			return convertNetworkToMatrix(progress);
		} finally {
			interactionCounts.put((long) networkId, count[0]);
			cursor.close();
		}
	}
	
	public Map<Long, Long> getInteractionCounts() {
		return Collections.unmodifiableMap(interactionCounts);
	}
}
