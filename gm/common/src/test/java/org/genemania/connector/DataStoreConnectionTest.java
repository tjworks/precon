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

package org.genemania.connector;

import org.genemania.AbstractTest;

public class DataStoreConnectionTest extends AbstractTest {

	private int ORGANISM_ID = 4;
	
	public void testMigrate() {
/*		
		try {
			List<Gene> genes = geneMediator.getAllGenes(ORGANISM_ID);
			DataStoreConnector dsc = new DataStoreConnector("human");
			int geneCounter = 0;
			for(Gene gene: genes) {
				long nodeId = gene.getNode().getId();
				Node node = nodeMediator.getNode(nodeId);
				Collection<Gene> genesForNode = node.getGenes();
				Iterator<Gene> iterator = genesForNode.iterator();
				Map<String, String> aliases = new Hashtable<String, String>();
				while(iterator.hasNext()) {
					Gene nextGene = iterator.next();
					if(nextGene.getId() != gene.getId()) {
						aliases.put(String.valueOf(nextGene.getNamingSource().getId()), nextGene.getSymbol()); 
					}
				}
				geneCounter++;
				String symbol = gene.getSymbol();
				dsc.put(symbol, aliases);
			}
			dsc.save();
			System.out.println("===================");			
			System.out.println(genes.size() + " genes loaded for " + ORGANISM_ID);
			System.out.println(geneCounter + " genes saved in local dictionary");
			System.out.println("===================");			
		} catch (ApplicationException e) {
			e.printStackTrace();
		}
*/		
	}
	
}
