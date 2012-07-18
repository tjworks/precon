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

import java.io.Reader;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Vector;

import junit.framework.TestCase;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrix;

import org.genemania.domain.Interaction;
import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.InteractionNetworkGroup;
import org.genemania.domain.Node;
import org.genemania.engine.TestHelpers.SimpleInteractionCursor;
import org.genemania.mediator.InteractionCursor;
import org.genemania.mediator.NetworkMediator;
import org.genemania.mediator.NodeMediator;

import au.com.bytecode.opencsv.CSVReader;

/**
 * Various test related utility functions, eg to construct little random networks
 *
 */
public class Utils {

	/**
	 * helper to allocate a list of nodes, with node ids from 1 to numNodes
	 * 
	 * @param numNodes
	 * @return
	 */
	public static Vector<Node> buildNodes(int numNodes) {
		return buildNodes(numNodes, 0);
	}
		
	/**
	 * build a vector of node objects of the given size, starting with the given id
	 * 
	 * @param networkSize
	 * @return
	 */
	public static Vector<Node> buildNodes(int numNodes, int startingId) {
		Vector<Node> nodes = new Vector<Node>();
		for (int i=0; i<numNodes; i++) {
			Node node = new Node();
			int nodeId = i + startingId;  // lets not have position in vector match the node id
			node.setId(nodeId);
			node.setName("Node" + nodeId);
			nodes.add(node);
		}
		
		return nodes;		
	}
	
	/**
	 * For testing, a mediator that will return the given nodes
	 * 
	 * @param nodes
	 * @return
	 */
	public static NodeMediator buildNodeMediator(final Vector<Node> nodes) {
		NodeMediator nodeMediator = new NodeMediator() {
			HashMap<Long, Node> map = new HashMap<Long, Node>();
			{
				for (Node node: nodes) {
					map.put(node.getId(), node);
				}
			}
						
			public Node getNode(long nodeId, long organismId) {
				return map.get(nodeId);
			}
		};
		
		return nodeMediator;
	}
	
	/**
	 * helper to build up a bunch of random interaction networks on a given
	 * list of nodes
	 * 
	 * @param nodes
	 * @param numNetworks
	 * @return
	 */
	public static Vector<InteractionNetwork> buildRandomNetworks(Vector<Node> nodes, int numNetworks, long seed) {
                Random random = new Random(seed);
		Vector<InteractionNetwork> networks = new Vector<InteractionNetwork>();
		
		for (int n=0; n<numNetworks; n++) {
			InteractionNetwork network = new InteractionNetwork();
			network.setId(n);
			Vector<Interaction> interactions = new Vector<Interaction>();
			
			for (int i=1; i<nodes.size(); i++) { // don't include self interactions
				for(int j=0; j<i; j++) {
					Interaction interaction = new Interaction();
					double weight = random.nextDouble();
					interaction.setFromNode(nodes.get(i));
					interaction.setToNode(nodes.get(j));
					interaction.setWeight((float)weight); // TODO: remove cast when we switch Interaction to use double
					interactions.add(interaction);
					
					// also add the symmetric interactions
					interaction = new Interaction();
					interaction.setFromNode(nodes.get(j));
					interaction.setToNode(nodes.get(i));
					interaction.setWeight((float)weight); // TODO: as above
					interactions.add(interaction);
				}				
			}
			
			network.setInteractions(interactions);
			networks.add(network);
		}
	
		return networks;
	}	

	/**
	 * for testing, a mediator that will return the given networks
	 * 
	 * @param networks
	 * @return
	 */
	public static NetworkMediator buildNetworkMediator(final Vector<InteractionNetwork> networks) {
		NetworkMediator networkMediator = new NetworkMediator() {
			HashMap<Long, InteractionNetwork> map = new HashMap<Long, InteractionNetwork>();
			{
				for (InteractionNetwork network: networks) {
					map.put(network.getId(), network);
				}
			}
	        public List<InteractionNetwork> getAllNetworks() {return null;}
	        public InteractionNetwork getNetwork(long networkId) {
	        	return map.get(networkId);
	        }
	        public void saveNetwork(InteractionNetwork network) {};
	        public void saveNetworkGroup(InteractionNetworkGroup group) {};
	        public InteractionNetworkGroup getNetworkGroupByName(String groupName) {return null;};
	        public InteractionCursor createInteractionCursor(long networkId) {
	        	return new SimpleInteractionCursor(map.get(networkId));
	        }
			public long getInteractionCount(long networkId) {
				return 0;
			}
            public InteractionNetworkGroup getNetworkGroupByName(
                    String groupName, long organismId) {
                return null;
            }
			public List<InteractionNetworkGroup> getNetworkGroupsByOrganism(
					long organismId) {
				return null;
			};
			public InteractionNetworkGroup getNetworkGroupForNetwork(
					long networkId) {
				return null;
			}
			public boolean isValidNetwork(long organismId, long networkId) {
				return false;
			}
		};
		
		return networkMediator;
	}

	
	/**
	 * helper to check that iterating over a given map returns 
	 * entries in descending order of value (not key!)
	 * 
	 * @param <T>
	 * @param scores
	 */
	public static <T> void checkMapOrder(Map<T, Double> scores) {
		double x = Double.MAX_VALUE;
		for (T key: scores.keySet()) {
			TestCase.assertNotNull(key);
			double score = scores.get(key);
			TestCase.assertTrue(score <= x);
			x = score;
		}		
	}

	public static Vector<Node> setPositiveNodes(int numPositives, List<Node> nodes) {
		// setup positives
		Vector<Node> positiveNodes = new Vector<Node>();
		for (int i=0; i<numPositives; i++) {
			positiveNodes.add(nodes.get(i));
		}
		
		return positiveNodes;
	}

	public static DenseVector buildScores(int networkSize, long seed) {
                Random random = new Random(seed);
		DenseVector scores = new DenseVector(networkSize);		
		for (int i=0; i<networkSize; i++) {
			scores.set(i, random.nextDouble());
		}
		
		return scores;
	}

	/**
	 * To help with testing, load a network in the textual gene1<tab>gene2<tab>weight
	 * format into a map with key gene1-gene2 and value weight. 
	 * 
	 * @param network
	 * @param delim
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Double> networkToMap(Reader network, char delim) throws Exception {
		
		CSVReader reader = new CSVReader(network, delim);
		String [] nextLine;
	
		HashMap<String, Double> map = new HashMap<String, Double>();
		
		while ((nextLine = reader.readNext()) != null) {
			String key = nextLine[0] + "-" + nextLine[1]; // gene1-gene2
			Double weight = Double.parseDouble(nextLine[2]);
			map.put(key, weight);			
		}	
		return map;
	}

	public static String getMD5asHEXString(String s) throws Exception {
		MessageDigest md = MessageDigest.getInstance("MD5");
		byte messageDigest[] = md.digest(s.getBytes("UTF8"));
	    BigInteger number = new BigInteger(1,messageDigest);
	    String hexString = number.toString(16);
		return hexString;
	}

	/**
	 * Matrix comparison helper
	 * 
	 * @param a
	 * @param b
	 * @param epsilon
	 */
	public static void elementWiseCompare(Matrix a, Matrix b, double epsilon) {
		
		TestCase.assertEquals(a.numRows(), b.numRows());
		TestCase.assertEquals(a.numColumns(), b.numColumns());
		
		for (int i=0; i<a.numRows(); i++) {
			for (int j=0; j<a.numColumns(); j++) {
				TestCase.assertEquals(a.get(i, j), b.get(i, j), epsilon);
			}		
		}
	}

	/**
	 * Vector comparison helper
	 * 
	 * @param a
	 * @param b
	 * @param epsilon
	 */
	public static void elementWiseCompare(no.uib.cipr.matrix.Vector a, no.uib.cipr.matrix.Vector b, double epsilon) {
		TestCase.assertEquals(a.size(), b.size());
		for (int i=0; i<a.size(); i++) {
			TestCase.assertEquals(a.get(i), b.get(i), epsilon);
		}		
	}


}
