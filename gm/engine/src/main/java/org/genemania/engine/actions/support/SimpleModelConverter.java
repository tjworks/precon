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

package org.genemania.engine.actions.support;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.MatrixEntry;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.VectorEntry;

import org.apache.log4j.Logger;
import org.genemania.dto.InteractionDto;
import org.genemania.dto.NetworkDto;
import org.genemania.dto.NodeDto;
import org.genemania.engine.converter.INetworkMatrixProvider;
import org.genemania.engine.converter.Mapping;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.exception.CancellationException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
import org.genemania.util.ProgressReporter;

/**
 * Take a network model and convert it to the matrix representation being
 * used by the engine. 
 * 
 * TODO: later instead of doing a direct conversion, we might want to
 * use an intermediate representation (coordinate format, 3 arrays of ints),
 * write exporters for the domain model to coo, and importers from coo to
 * our matrix toolkit. then we can eg swap out toolkits more easily.
 */
public class SimpleModelConverter {
	private static Logger logger = Logger.getLogger(SimpleModelConverter.class);	
	Mapping<String, Integer> mapping;

        public SimpleModelConverter(Mapping mapping) {
            this.mapping = mapping;
        }
        		
	public int getModelSize() {
		return mapping.size(); // TODO: don't need to expose anymore?
	}
		
	/**
	 * Create a vector of labels value, with elements corresponding to positive nodes
	 * set to the posLabelValue, labels for negative nodes set to negLabelValue, and
	 * the rest set to nonLabelValue. (Eg typically 1, -1, and 0).
	 * 
	 * TODO: note the handling for -1 is a workaround for #184. need to investigate
	 * a fuller solution
	 */
        public static Vector createLabelsFromIds(Mapping mapping, Collection<Long> positiveNodeIds, Collection<Long> negativeNodeIds,
			double posLabelValue, double negLabelValue, double nonLabelValue) {

		DenseVector labels = new DenseVector(mapping.size());
		for (VectorEntry e: labels) {
			e.set(nonLabelValue);
		}

		for (Long nodeId: positiveNodeIds) {
			int i = mapping.getIndexForUniqueId(nodeId);
			if (i == -1) {
				logger.warn(String.format("No data for node %d found, ignoring", nodeId));
			}
			else {
				labels.set(i, 1d);
			}
		}

		for (Long nodeId: negativeNodeIds) {
			int i = mapping.getIndexForUniqueId(nodeId);
			if (i == -1) {
				logger.warn(String.format("No data for node %d found, ignoring", nodeId));
			}
			else {
				labels.set(i, -1d);
			}
		}

		return labels;
	}
	
	/**
	 * return a list of integer index values corresponding to the given
	 * collection of node ids.
	 * 
	 * @param nodes
	 * @return
	 */
	public List<Integer> getIndicesForNodeIds(Collection<Long> nodeIds) {
		ArrayList<Integer> indices = new ArrayList<Integer>();
		for (long nodeId: nodeIds) {
			int i = mapping.getIndexForUniqueId((int) nodeId);
			if (i == -1) {
				logger.warn(String.format("No data for node %d found, ignoring", nodeId));
			}
			else {
				indices.add(i);
			}
		}
		return indices;
	}
	
	/**
	 * return a collection of interaction objects from the network.
	 * don't include the symmetric interactions (assume the matrix is
	 * symmetric with 0 diagonal and convert only lower triangle)
	 * 
	 * @param network
	 * @return
	 */
	public Collection<InteractionDto> matrixToInteractions(Matrix network, HashMap<Integer, NodeDto> nodeVOs) throws ApplicationException {
		
		ArrayList<InteractionDto> interactions = new ArrayList<InteractionDto>();
		for (MatrixEntry e: network) {
			
			if (e.row() <= e.column()) {
				continue;
			}
			
			long from = mapping.getUniqueIdForIndex(e.row());
			long to = mapping.getUniqueIdForIndex(e.column());
                        if (from < 0 || to < 0) {
                            throw new ApplicationException("mapping error");
                        }

                        NodeDto fromNodeVO = nodeVOs.get((int)from);
                        NodeDto toNodeVO = nodeVOs.get((int)to);

                        if (fromNodeVO == null || toNodeVO == null) {
                            throw new ApplicationException("mapping error");
                        }
                        
			InteractionDto interaction = new InteractionDto();
                        interaction.setNodeVO1(fromNodeVO);
                        interaction.setNodeVO2(toNodeVO);
                        interaction.setWeight(e.get());
			interactions.add(interaction);                        
		}	
		return interactions;
	
	}
	
	public List<NetworkDto> getSourceInteractions(int [] indicesForTopScores, Vector scores,			
			Map<Integer, Double> networkWeights, INetworkMatrixProvider provider, 
                        int organismId, ProgressReporter progress) throws ApplicationException {
		
            List<NetworkDto> result = new ArrayList<NetworkDto>();

            // build up NodeVO's which we'll use in our interaction graph
            HashMap<Integer, NodeDto> nodeVOs= new HashMap<Integer, NodeDto>();
            for (int i=0; i<indicesForTopScores.length; i++) {
                NodeDto nodeVO = new NodeDto();
                int nodeId = mapping.getUniqueIdForIndex(indicesForTopScores[i]);
                if (nodeId < 0) {
                    throw new ApplicationException("mapping error");
                }
                double score = scores.get(indicesForTopScores[i]);
                //System.out.println(String.format("got nodeId %s for index %s with score %s", nodeId, i, score)); //kz debug

                nodeVO.setId(nodeId);
                nodeVO.setScore(score);
                nodeVOs.put(nodeId, nodeVO);
            }

            for (int networkId: networkWeights.keySet()) {

                if (progress.isCanceled()) {
                    throw new CancellationException();
                }
                
                Double weight = networkWeights.get(networkId); // might be null if we aren't storing the 0 weights

                // debug logging for network weights
                if (weight == null) {
                    // network wasn't in the query, don't log anything
                }
                else if (weight.doubleValue() == 0) {
                    logger.debug(String.format("network %s has zero weight, excluding from results", networkId));
                }

                if (weight == null || weight.doubleValue() == 0) {
                    continue;
                }

                NetworkDto sourceNetwork = new NetworkDto();
                sourceNetwork.setWeight(weight);
                sourceNetwork.setId(networkId);

                Collection<InteractionDto> interactions = new ArrayList<InteractionDto>();

                Matrix subMatrix = MatrixUtils.getSubMatrix(provider.getNetworkMatrix(networkId, NullProgressReporter.instance()), indicesForTopScores, indicesForTopScores);
                Collection<InteractionDto> sourceInteractions = matrixToInteractions(subMatrix, nodeVOs);

                sourceNetwork.setInteractions(sourceInteractions);

                logger.debug(String.format("network %s has a weight of %s and contains %s interactions", networkId, weight, sourceInteractions.size()));
                //logInteractions(networkId, sourceInteractions);

                result.add(sourceNetwork);
            }

            return result;
        }

        public static void logInteractions(long networkId, Collection<InteractionDto> interactions) {
            logger.debug("interactions for network " + networkId);
            for (InteractionDto i: interactions) {
                logger.debug(String.format("   %d %d %f", i.getNodeVO1().getId(), i.getNodeVO2().getId(), i.getWeight()));
            }
        }

    public static boolean queryHasUserNetworks(Collection<Collection<Long>> networkIds) {
        for (Collection<Long> group: networkIds) {
            for (long id: group) {
                if (id < 0) {
                    return true;
                }
            }
        }
        return false;
    }
}
