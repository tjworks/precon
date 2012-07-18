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

/**
 * NeoConnectorTest: unit test for NeoConnector 
 * Created Apr 08, 2010
 * @author Ovi Comes
 */
package org.genemania.connector;

import org.apache.log4j.Logger;
import org.genemania.AbstractTest;

public class NeoConnectorTest extends AbstractTest {

	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(NeoConnectorTest.class);
	
	// __[tests]_______________________________________________________________
	public void testLookup() {
//		try {
//			LOG.debug("running lookup test");
//			neoConnector.startTransaction();
//			List<Node> nodes = neoConnector.lookup("commonName", "human");
//			neoConnector.endTransaction();
//			assertNotNull("node should not be null", nodes);
//			assertEquals("single node expected", 1, nodes.size());
//			LOG.debug("lookup found: " + nodes);
//		} catch (DataStoreException e) {
//			fail(e.getMessage());
//		}		
	}
//	
//	public void testSearch() {
//		try {
//			LOG.debug("running search test");
//			List<Node> nodes = neoConnector.lookup("commonName", "human");
//			assertNotNull("node should not be null", nodes);
//			assertEquals("single node expected", 1, nodes.size());
//			Node node = nodes.get(0);
//			long nodeId = node.getId();
//			List<Long> neighbours = neoConnector.search(nodeId, GeneManiaRelationshipType.HAS);
//			LOG.debug("search found: " + neighbours.size() + " neighbours");
//		} catch (DataStoreException e) {
//			fail(e.getMessage());
//		}		
//	}
	
//	public void testPopulateOrganisms() {
//		try {
//			Map<String, Object> plant = new Hashtable<String, Object>();
//			plant.put("short scientific name", "A. thaliana");
//			plant.put("full scientific name", "Arabidopsis thaliana");
//			plant.put("common name", "plant");
//			neoConnector.create(plant);
//			
//			Map<String, Object> worm = new Hashtable<String, Object>();
//			plant.put("object type", "organism");
//			worm.put("short scientific name", "C. elegans");
//			worm.put("full scientific name", "Caenorhabditis elegans");
//			worm.put("common name", "worm");
//			neoConnector.create(worm);
//			
//			Map<String, Object> fly = new Hashtable<String, Object>();
//			plant.put("object type", "organism");
//			fly.put("short scientific name", "D. melanogaster");
//			fly.put("full scientific name", "Drosophila melanogaster");
//			fly.put("common name", "fly");
//			neoConnector.create(fly);
//		} catch (DataStoreException e) {
//			fail(e.getMessage());
//		}
//	}

//	public void testUpdate() {
//		Map<String, Object> plant = new Hashtable<String, Object>();
//		plant.put(Organism.COMMON_NAME, "palnt");
//		plant.put(Organism.SHORT_SCIENTIFIC_NAME, "A. thaliana");
//		plant.put(Organism.FULL_SCIENTIFIC_NAME, "Arabidopsis thaliana");
//		neoConnector.create(plant);
//		Map<String, Object> updatedPlant = new Hashtable<String, Object>();
//		updatedPlant.put(Organism.COMMON_NAME, "plant");
//		List<Node> updatedNodes = neoConnector.update(Organism.COMMON_NAME, "palnt", updatedPlant);
//		assertNotNull(updatedNodes);
//		assertEquals(1, updatedNodes.size());
//		Node updatedNode = updatedNodes.get(0);
//		assertNotNull(updatedNode);
//		assertEquals("plant", updatedNode.getProperty(Organism.COMMON_NAME));
//	}
	
	// __[framework methods]___________________________________________________
//	@Override
//	protected void setUp() throws Exception {
//		LOG.debug("test setup");
//		super.setUp();
//		neoConnector.startSession();
//		insertTestData();
//		LOG.debug("test setup done");
//	}
//
//	@Override
//	protected void tearDown() throws Exception {
//		LOG.debug("test tear down");
//		super.tearDown();
//		removeTestData();
//		neoConnector.endSession();
//		LOG.debug("test tear down done");
//	}
//
//	// __[private helpers]_____________________________________________________
//	private void insertTestData() throws DataStoreException {
//		Map<String, Object> organism = new Hashtable<String, Object>();
//		organism.put("commonName", "human");
//		neoConnector.startTransaction();
//		Node organismNode = neoConnector.create(organism);
//		neoConnector.endTransaction();
//		Map<String, Object> genes = new Hashtable<String, Object>();
//		genes.put("defaultHumanGenes", "MRE11A;RAD51;MLH1;MSH2;DMC1;RAD51AP1;RAD50;MSH6;XRCC3;PCNA;XRCC2");
//		neoConnector.startTransaction();
//		Node geneSetNode = neoConnector.create(genes);
//		neoConnector.endTransaction();
//		neoConnector.startTransaction();
//		neoConnector.link(organismNode.getId(), geneSetNode.getId(), GeneManiaRelationshipType.HAS);
//		neoConnector.endTransaction();
//	}
//
//	private void removeTestData() throws DataStoreException {
//		neoConnector.startTransaction();
//		List<Node> nodes = neoConnector.lookup("commonName", "human");
//		neoConnector.endTransaction();
//		Node node = nodes.get(0);
//		long nodeId = node.getId();
//		neoConnector.startTransaction();
//		neoConnector.delete(nodeId);
//		neoConnector.endTransaction();
//	}
	
}
