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

package org.genemania.engine.actions;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Vector;

import org.apache.log4j.Logger;
import org.genemania.dto.InteractionDto;
import org.genemania.dto.NetworkDto;
import org.genemania.dto.NodeDto;
import org.genemania.dto.RelatedGenesEngineRequestDto;
import org.genemania.dto.RelatedGenesEngineResponseDto;
import org.genemania.engine.Constants;
import org.genemania.engine.Constants.ScoringMethod;
import org.genemania.engine.actions.support.SimpleModelConverter;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.data.Network;
import org.genemania.engine.core.data.NetworkIds;
import org.genemania.engine.core.data.NodeIds;
import org.genemania.engine.core.utils.Logging;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.labels.LabelVectorGenerator;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.type.CombiningMethod;

/**
 * process a find-related genes request. implemented for production mode,
 * for test validation mode need to add a way to control the unlabelled-value,
 * although some validation code directly calls into coremania with complete
 * label vector's and doesn't need this ...
 */
public class FindRelated {

    private static Logger logger = Logger.getLogger(FindRelated.class);
    private DataCache cache;
    private RelatedGenesEngineRequestDto request;
    private int numRequestNetworks;
    private boolean hasUserNetworks;
    static final double posLabelValue = 1.0d;
    static final double negLabelValue = -1.0d;
    static final double unLabeledValueProduction = -1.0d;
    static final double unLabeledValueValidation = 0.0d;

    private long requestStartTimeMillis;
    private long requestEndTimeMillis;
    
    public FindRelated(DataCache cache, RelatedGenesEngineRequestDto request) {
        this.cache = cache;
        this.request = request;
    }

    /*
     * main request processing logic
     */
    public RelatedGenesEngineResponseDto process() throws ApplicationException {
        try {
            requestStartTimeMillis = System.currentTimeMillis();

            logStart();
            checkQuery();
            logQuery();

            ArrayList<Long> negativeNodes = new ArrayList<Long>();

            no.uib.cipr.matrix.Vector labels = LabelVectorGenerator.createLabelsFromIds(cache.getNodeIds(request.getOrganismId()),
                    request.getPositiveNodes(), negativeNodes, posLabelValue, negLabelValue, unLabeledValueProduction);

            String goCategory = null;

            // crunch the numbers
            org.genemania.engine.Constants.CombiningMethod combiningMethod = Constants.convertCombiningMethod(request.getCombiningMethod(), request.getPositiveNodes().size());
            org.genemania.engine.Constants.ScoringMethod scoringMethod = Constants.convertScoringMethod(request.getScoringMethod());

            Collection<Collection<Long>> idList = request.getInteractionNetworks();

            org.genemania.engine.core.mania.CoreMania coreMania = new org.genemania.engine.core.mania.CoreMania(cache, request.getProgressReporter());
            coreMania.compute(safeGetNamespace(), request.getOrganismId(), labels, combiningMethod, idList, goCategory, "average");
            SymMatrix combinedKernel = coreMania.getCombinedKernel();
            Map<Long, Double> matrixWeights = coreMania.getMatrixWeights();
            Vector discriminant = coreMania.getDiscriminant();
            Vector score = convertScore(scoringMethod, discriminant, combinedKernel, labels, posLabelValue, negLabelValue);

            
            double scoreThreshold = selectScoreThreshold(scoringMethod);
            RelatedGenesEngineResponseDto response = prepareOutputsDto(score, discriminant,
                    matrixWeights, combinedKernel, scoreThreshold, scoringMethod, Constants.convertCombiningMethod(combiningMethod));

            requestEndTimeMillis = System.currentTimeMillis();

            logEnd();

            return response;
        }
        catch (CancellationException e) {
            logger.info("request was cancelled");
            return null;
        }
    }
    
    private double selectScoreThreshold(ScoringMethod scoringMethod) {
        
        if (scoringMethod == ScoringMethod.ZSCORE) {
            return Double.NEGATIVE_INFINITY;
        }
        else {
            return Constants.DISCRIMINANT_THRESHOLD;
        }
    }
    
    private Vector convertScore(ScoringMethod scoringMethod, Vector discriminant, SymMatrix combinedKernel, Vector labels, double posLabelValue, double negLabelValue) throws ApplicationException {
        // apply scoring method conversions
        Vector score;
        if (scoringMethod == ScoringMethod.DISCRIMINANT) {
            discriminant.set(MatrixUtils.rescale(discriminant));
            score = discriminant;
        }
        else if (scoringMethod == ScoringMethod.CONTEXT) {
            throw new ApplicationException("context score no longer supported");
//            score = PropagateLabels.computeContextScore(combinedKernel, discriminant);
//            discriminant.set(PropagateLabels.rescale(discriminant));
//            score = PropagateLabels.rescale(score);
        }
        else if (scoringMethod == ScoringMethod.ZSCORE) {
            score = computeZScore(discriminant, combinedKernel, labels, posLabelValue, negLabelValue);
        }
        else {
            throw new ApplicationException("Unexpected scoring method: " + scoringMethod);
        }
        return score;
    }
    
    /*
     * compute z-score from the log of the discriminant's excluding those pinned to -1 (neg label value)
     * 
     * this is a quick implementation, TODO:
     *  - create a separate package for scoring functions
     *  - implement z=score, context-score in that package
     *  - move some methods to matrix-utils package
     *  - implement unit tests
     * 
     */
    private Vector computeZScore(Vector discriminant, SymMatrix combinedKernel, Vector labels, double posLabelValue, double negLabelValue) throws ApplicationException {
        
        logger.debug("computing z-score");
        
        // compute node degree of combined network
        DenseVector degrees = new DenseVector(discriminant.size());
        combinedKernel.columnSums(degrees.getData());
           
        // our stats functions need matrices, copy discriminant scores over, only for
        // nodes with +ve degree, other nodes get NaN which is ignored in our stats computations
        DenseMatrix score = new DenseMatrix(discriminant.size(), 1); 
        int n = 0;
        for (int i=0; i<discriminant.size(); i++) {
            if (degrees.get(i) > 0d) {
                score.set(i, 0, discriminant.get(i));
                n += 1;
            }
            else {
                score.set(i, 0, Double.NaN);
            }
        }
        
        logger.debug("# of nodes with +ve degree in combined network: " + n);
                        
        // clear the scores of the query nodes by setting to NaN
        for (int i=0; i<labels.size(); i++) {
            if (labels.get(i) == posLabelValue) { // probably would be safer to do abs(x-y) < tol ...
                logger.debug("clearing modes with postive label value for " + i);
                score.set(i, 0, Double.NaN);
            }
        }
                
//        dumpNumbers(cache.getCacheDir() + File.separator + "dump.txt", discriminant, labels, degrees.getDegrees());
        
        Vector counts = MatrixUtils.columnCountsIgnoreMissingData(score);
 
        Vector zscores = null;
        
        // if no nodes connected to query nodes, we can't compute a z-score. set all scores to -inf, except query nodes which we set to 1
        if (counts.get(0) == 0) {
            logger.info("no nodes connected to query nodes, special casing z-scores");
            zscores = discriminant.copy(); // so i don't have to worry about its concrete type, will be same as discrminant
            seteq(zscores, Double.NEGATIVE_INFINITY);
            setmatches(posLabelValue, labels, 1d, zscores);            
        }
        else {
            Vector means = MatrixUtils.columnMeanIgnoreMissingData(score, counts);        
            Vector stdevs = MatrixUtils.columnVarianceIgnoreMissingData(score, means);
            MatrixUtils.sqrt(stdevs);
                                
            logger.debug("count, mean, stdev: " + counts.get(0) + ", " + means.get(0) + ", " + stdevs.get(0));     
            
            // note by applying the z-score to the entire discriminant vector,
            // we are also scaling
            // the query nodes, which we didn't use to compute the mean/stdev
            zscores = discriminant.copy();

            MatrixUtils.add(zscores, -means.get(0));
            zscores.scale(1d / (stdevs.get(0) + 0.01));

            // log max for testing
            logger.debug("max of z-scores: " + MatrixUtils.max(zscores));
        }
        
        return zscores;
    }
    
    /*
     * set values less than threshold to new given val. maybe move to matrixutils ...
     */
    private void setlt(Vector v, double thresh, double newval) {
        int n = v.size();
        for (int i=0; i<n; i++) {
            if (v.get(i) < thresh) {
                v.set(i, newval);
            }
        }
    }
    
    private void setge(Vector v, double thresh, double newval) {
        int n = v.size();
        for (int i=0; i<n; i++) {
            if (v.get(i) >= thresh) {
                v.set(i, newval);
            }
        }
    }
    
    private void seteq(Vector v, double newval) {
        int n = v.size();
        for (int i=0; i<n; i++) {
            v.set(i, newval);
        }
    }
    
    /* 
     * set newhaystack[i] = newneedle for all i where haystack[i] == needle
     */
    private void setmatches(double needle, Vector haystack, double newneedle, Vector newhaystack) {
        int n = haystack.size();
        for (int i=0; i<n; i++) {
            if (haystack.get(i) == needle) {
                newhaystack.set(i, newneedle);
            }
        }
    }
    
    
    protected RelatedGenesEngineResponseDto prepareOutputsDto(Vector score, Vector discriminant,
            Map<Long, Double> matrixWeights, SymMatrix combinedKernel, double scoreThreshold, 
            ScoringMethod scoringMethod, CombiningMethod combiningMethod) throws ApplicationException {

        logPreparingOutputs();

        RelatedGenesEngineResponseDto response = new RelatedGenesEngineResponseDto();

        // loop over each network, extract interactions

        // extract interactions for just the top limitResults scores.
        //
        logger.debug("extracting indices for top scoring nodes");

        NodeIds nodeIds = cache.getNodeIds(request.getOrganismId());
        List<Integer> indicesForPositiveNodes = nodeIds.getIndicesForIds(request.getPositiveNodes());
//        List<Integer> indicesForPositiveNodes = converter.getIndicesForNodeIds(request.getPositiveNodes());

        // for context score we still want the top nodes by discriminant. for other
        // scoring methods just use the score itself.
        int [] indicesForTopScores;
        if (scoringMethod == ScoringMethod.CONTEXT) {
            indicesForTopScores = MatrixUtils.getIndicesForTopScores(discriminant, indicesForPositiveNodes, request.getLimitResults(), scoreThreshold);
        }
        else {
            indicesForTopScores = MatrixUtils.getIndicesForTopScores(score, indicesForPositiveNodes, request.getLimitResults(), scoreThreshold);            
        }
        
        // some debug logging
        logger.debug(String.format("number of nodes available for return: %d", indicesForTopScores.length));

        if (request.getProgressReporter().isCanceled()) {
            throw new CancellationException();
        }

        // source interactions for the combined subnetwork. TODO: should the network weights be applied to the returned edge weights?
        logger.debug("extracting source interactions");
        List<NetworkDto> sourceNetworks = getSourceInteractions(indicesForTopScores, score, matrixWeights);
        response.setNetworks(sourceNetworks);
        response.setCombiningMethodApplied(combiningMethod);
        return response;
    }
    
    /**
     * return a collection of interaction objects from the network.
     * don't include the symmetric interactions (assume the matrix is
     * symmetric with 0 diagonal and convert only lower triangle)
     *
     * @param network
     * @return
     */
    public Collection<InteractionDto> matrixToInteractions(SymMatrix network, int[] indicesForTopScores, HashMap<Long, NodeDto> nodeVOs) throws ApplicationException {

        ArrayList<InteractionDto> interactions = new ArrayList<InteractionDto>();


        NodeIds nodeIds = cache.getNodeIds(request.getOrganismId());

        for (int i = 0; i < indicesForTopScores.length; i++) {
            for (int j = 0; j < i; j++) {
                int idx = indicesForTopScores[i];
                int jdx = indicesForTopScores[j];
                long from = nodeIds.getIdForIndex(idx);
                long to = nodeIds.getIdForIndex(jdx);
                double weight = network.get(idx, jdx);

                // we'll be getting 0 from the sparse matrix for
                // interactions that are not present, filter out
                if (weight == 0d) {
                    continue;
                }

                NodeDto fromNodeVO = nodeVOs.get(from);
                NodeDto toNodeVO = nodeVOs.get(to);

                if (fromNodeVO == null || toNodeVO == null) {
                    throw new ApplicationException("mapping error");
                }

                InteractionDto interaction = new InteractionDto();
                interaction.setNodeVO1(fromNodeVO);
                interaction.setNodeVO2(toNodeVO);
                interaction.setWeight(weight);
                interactions.add(interaction);
            }
        }

        return interactions;

    }

    public List<NetworkDto> getSourceInteractions(int[] indicesForTopScores, Vector scores,
            Map<Long, Double> networkWeights) throws ApplicationException {

        List<NetworkDto> result = new ArrayList<NetworkDto>();

        // build up NodeVO's which we'll use in our interaction graph
        HashMap<Long, NodeDto> nodeVOs = new HashMap<Long, NodeDto>();
        for (int i = 0; i < indicesForTopScores.length; i++) {
            NodeDto nodeVO = new NodeDto();

            NodeIds nodeIds = cache.getNodeIds(request.getOrganismId());
            long nodeId = nodeIds.getIdForIndex(indicesForTopScores[i]);

            double score = scores.get(indicesForTopScores[i]);

            nodeVO.setId(nodeId);
            nodeVO.setScore(score);
            nodeVOs.put(nodeId, nodeVO);
        }

        for (long networkId: networkWeights.keySet()) {

            if (request.getProgressReporter().isCanceled()) {
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

            Network network = cache.getNetwork(safeGetNamespace(), request.getOrganismId(), networkId);

            Collection<InteractionDto> sourceInteractions = matrixToInteractions(network.getData(), indicesForTopScores, nodeVOs);

            sourceNetwork.setInteractions(sourceInteractions);

            logger.debug(String.format("network %s has a weight of %s and contains %s interactions", networkId, weight, sourceInteractions.size()));
            //SimpleModelConverter.logInteractions(networkId, sourceInteractions);

            result.add(sourceNetwork);
        }

        return result;
    }

    /*
     * write out some query params for later trouble shooting ...
     */
    private void logQuery() {
        logger.info(String.format("findRelated query using combining method %s for organism %d contains %d nodes, %d network groups, %d networks, and requests a maximum of %d related nodes",
                request.getCombiningMethod(), request.getOrganismId(), request.getPositiveNodes().size(), request.getInteractionNetworks().size(), numRequestNetworks, request.getLimitResults()));
    }

    private void logStart() {
        logger.info("processing findRelated() request");
        request.getProgressReporter().setMaximumProgress(Constants.PROGRESS_COMPLETE);
        request.getProgressReporter().setStatus(Constants.PROGRESS_START_MESSAGE);
        request.getProgressReporter().setProgress(Constants.PROGRESS_START);
    }

    private void logPreparingOutputs() {
        logger.info("preparing outputs for findRelated() request");
        request.getProgressReporter().setDescription(Constants.PROGRESS_OUTPUTS_MESSAGE);
        request.getProgressReporter().setProgress(Constants.PROGRESS_OUTPUTS);
    }

    private void logEnd() {
        logger.info("completed processing request, duration = " + Logging.duration(requestStartTimeMillis, requestEndTimeMillis));
        request.getProgressReporter().setStatus(Constants.PROGRESS_COMPLETE_MESSAGE);
        request.getProgressReporter().setProgress(Constants.PROGRESS_COMPLETE);
    }

    private void logNodeScores(int[] indicesForTopScores, Vector discriminant) throws ApplicationException {
        if (logger.isDebugEnabled()) {
            NodeIds nodeIds = cache.getNodeIds(request.getOrganismId());

            for (int i = 0; i < indicesForTopScores.length; i++) {
                long nodeId = nodeIds.getIdForIndex(indicesForTopScores[i]);
                double nodeScore = discriminant.get(indicesForTopScores[i]);
                logger.debug(String.format("Node %d as a score of %f", nodeId, nodeScore));
            }
        }
    }

    /*
     * validate the query params, throw exception if a problem is found,
     * otherwise return silently
     */
    public void checkQuery() throws ApplicationException {

        if (request.getPositiveNodes() == null || request.getPositiveNodes().size() == 0) {
            throw new ApplicationException("No query nodes given");
        }

        if (request.getInteractionNetworks() == null || request.getInteractionNetworks().size() == 0) {
            throw new ApplicationException("No query networks given");
        }

        checkNodes(request.getOrganismId(), request.getPositiveNodes());

        hasUserNetworks = SimpleModelConverter.queryHasUserNetworks(request.getInteractionNetworks());
        numRequestNetworks = checkNetworks(safeGetNamespace(), request.getOrganismId(), request.getInteractionNetworks());

    }

    /*
     * query validation helper, error if node id in query is repeated
     * or does not exist in the dataset
     */
    protected void checkNodes(long organismId, Collection<Long> nodes) throws ApplicationException {

        if (nodes.size() == 0) {
            throw new ApplicationException("the list of nodes in the request is empty");
        }
     
        HashSet<Long> uniqueNodeIds = new HashSet<Long>();

        NodeIds nodeIds = cache.getNodeIds(organismId);

        for (Long nodeId: nodes) {
            if (uniqueNodeIds.contains(nodeId)) {
                throw new ApplicationException(String.format("the node id %d was passed multiple times in request", nodeId));
            }

            long n = nodeId.longValue();
            try {
                nodeIds.getIndexForId(n);
            }
            catch (ApplicationException e) {
                throw new ApplicationException(String.format("node id %d is not valid for organism id %d", nodeId, organismId));
            }
        }
    }

    /*
     * query validation helper, error if network id in query is repeated or
     * does not exist in the dataset
     */
    protected int checkNetworks(String namespace, long organismId, Collection<Collection<Long>> networks) throws ApplicationException {

        HashSet<Long> uniqueNetworkIds = new HashSet<Long>();

        NetworkIds networkIds = cache.getNetworkIds(namespace, organismId); // TODO: doesn't this fix up the problem of verifying user networks? add testcase

        for (Collection<Long> grouping: networks) {
            for (Long networkId: grouping) {
                if (uniqueNetworkIds.contains(networkId)) {
                    throw new ApplicationException(String.format("the network id %d was passed multiple times in request", networkId));
                }
                uniqueNetworkIds.add(networkId);

                long n = networkId.longValue();

                if (n > Integer.MAX_VALUE || n < Integer.MIN_VALUE) {
                    throw new ApplicationException(String.format("network ids must be in integer range, got id: %d", networkId));
                }

                if (n < 0) {
                    if (namespace == null) {
                        throw new ApplicationException(String.format("no namespace provided for user network %d organism %d", networkId, organismId));
                    }
                    else {
                        logger.warn("skipping validation check on user network: " + n);
                    }
                }

                try {
                    networkIds.getIndexForId(n);
                }
                catch (ApplicationException e) {
                    throw new ApplicationException(String.format("network id %d is not valid for organism id %d", networkId, organismId));
                }
            }
        }

        return uniqueNetworkIds.size();
    }

    /*
     * external callers pass null for namespace instead of explicitly specifying
     * CORE namespace. instead of testing everywhere engine, make namespace explicit
     * here.
     *
     */
    private String safeGetNamespace() {
        String namespace = request.getNamespace();
        if (namespace == null || namespace.equals("") || !hasUserNetworks) {
            return Data.CORE;
        }
        else {
            return namespace;
        }
    }
        
    /*
     * helper to write discriminant values to file, for internal testing/data analysis
     */
    private void dumpNumbers(String fileName, Vector discriminant, Vector labels, Vector degrees) {
            try {
                logger.info("dumping to " + fileName);
                File file = new File(fileName);
                FileWriter writer = new FileWriter(file);
                
                int n = discriminant.size();
                
                String header = ("node\tdiscriminant\tlabels\tdegrees\n");
                writer.write(header);
                for (int i=0; i<n; i++) {
                    String line = String.format("%d\t%.15e\t%.15e\t%.15e\n", i, discriminant.get(i), labels.get(i), degrees.get(i));
                    writer.write(line);
                }
                
                writer.close();
            }
            catch (Exception e) {
                logger.warn("failed to dump data", e);
                
            }
           
    }
}
