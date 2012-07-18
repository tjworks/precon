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

package org.genemania.engine.core.integration.calculators;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.Vector;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.MakeKtT;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.data.CombinedNetwork;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.integration.CombineNetworksOnly;
import org.genemania.engine.core.integration.MakeKtK2;
import org.genemania.engine.core.integration.PreCalculatedWeightSelection;
import org.genemania.engine.core.integration.Solver;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * determines best matching annotation based combined network to the
 * query nodes.
 */
public class AutomaticRelevanceCalculator extends AbstractNetworkWeightCalculator {
    private static Logger logger = Logger.getLogger(AbstractNetworkWeightCalculator.class);

    public AutomaticRelevanceCalculator(DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(cache, networkIds, organismId, label, progress);
    }

    public AutomaticRelevanceCalculator(String namespace, DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(namespace, cache, networkIds, organismId, label, progress);
    }

    /*
     * TODO: the code in AverageCategory can be moved here, and that class removed
     * 
     */
    public void process() throws ApplicationException {

        boolean hasUserNetworks = queryHasUserNetworks();
        logger.info("1 automatic relevance");

        //Matrix temp = cache.getMatrix((int) organismId, "KtK_BP");
        Matrix temp = getKtK("BP", hasUserNetworks);
        
        logger.info("2 retrieved KtK_BP");

        // in this case we do weighting & combining 3 times, once
        // for each go branch. for simplicity just set the weighting message
        // at the start of the process, and don't mention the combining
        progress.setStatus(Constants.PROGRESS_WEIGHTING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_WEIGHTING);

        // fast path for the case of all networks selected, only available
        // for core case (no user networks)

        boolean done = false;
        if ((namespace == null || !(hasUserNetworks)) && (temp.numColumns() == (networkIds.size() + 1))) {
            try {
                getPrecomputedResultAllNetworks();
                done = true;
            }
            catch (ApplicationException e) {
                logger.debug("unable to fetch precomputed result");
            }
        }

        if (!done) {
            computeNewResult(hasUserNetworks);
        }
    }

    void computeNewResult(boolean hasUserNetworks) throws ApplicationException {
            // TODO: it would be nicer from memory point of view to just load and process these one at a time instead of all at once
            DenseMatrix[] KtT = {(DenseMatrix) getKtT("BP", hasUserNetworks), (DenseMatrix) getKtT("CC", hasUserNetworks), (DenseMatrix) getKtT("MF", hasUserNetworks)};
            DenseMatrix[] KtK = {(DenseMatrix) getKtK("BP", hasUserNetworks), (DenseMatrix) getKtK("CC", hasUserNetworks), (DenseMatrix) getKtK("MF", hasUserNetworks)};
            //SymMatrix[] combined = new SymMatrix[3];
            CombinedNetwork [] combined = new CombinedNetwork[3];

            //double[] wtw = new double[3];
            List<Integer> idList = new ArrayList();
            Map<Long, Integer> columnMap = getColumnId(hasUserNetworks);
            //List<Map<Long, Double>> weightList = new ArrayList();
            int i = 0;
            for (Collection<Long> group: networkIds) {
                for (long id: group) {

                    idList.add(columnMap.get(id));
                    IndexToNetworkIdMap.put(i, id);
                    i++;

                }
            }
            for (i = 0; i < 3; i++) {
                if (progress.isCanceled()) {
                    throw new CancellationException();
                }

                CombinedNetwork cn = new CombinedNetwork(Data.CORE, organismId, "on_the_fly:" + i); // TODO: if we ever want to cache these need to fix up this naming
                combined[i] = cn;

                KtK[i] = MakeKtK2.RemoveNetwork(KtK[i], idList);
                KtT[i] = MakeKtT.RemoveNetwork(KtT[i], idList);

                Map<Long, Double> weightMap;
                try {
                    weightMap = Solver.solve(KtK[i], MatrixUtils.extractColumnToVector(KtT[i], 0), IndexToNetworkIdMap, progress);
                    //weightList.add(Solver.solve(KtK[i], MatrixUtils.extractColumnToVector(KtT[i], 0), IndexToNetworkIdMap, progress));
                }
                catch (ApplicationException e) {
                    logger.error("weighting calculation failed, falling back to average: " + e.getMessage());
                    weightMap = AverageByNetworkCalculator.average(IndexToNetworkIdMap);
                    //weightList.add(AverageByNetworkCalculator.average(IndexToNetworkIdMap));
                }
                SymMatrix data = CombineNetworksOnly.combine(weightMap, namespace, organismId, cache, progress);
                double wtw = data.elementMultiplySum(data); // TODO: this could be optimized by adding a special case method for multiplying by self, since that
                                                            // would allow us to just do a quick loop over the data array and avoid the bisection search on one matrix
                cn.setData(data);
                cn.setWtW(wtw);
                cn.setWeightMap(weightMap);

                // TODO: if we're clever we could optionally save these to the cache, parameterizing their keys (names) by hash of the networks
            }

            try {
                int selected = PreCalculatedWeightSelection.selectBranch(combined, label);
                combinedMatrix = combined[selected].getData();
                weights = combined[selected].getWeightMap();
            }
            catch (ApplicationException e) {
                logger.info("failed to select branch, falling back to average: " + e.getMessage());
                
                weights = AverageByNetworkCalculator.average(IndexToNetworkIdMap);
                progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
                progress.setProgress(Constants.PROGRESS_COMBINING);
                combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);                
            }
    }
    /*
     * use the precombined networks to select a branch, then return the precomputed weights
     */
    void getPrecomputedResultAllNetworks() throws ApplicationException {

        CombinedNetwork[] combined = {cache.getCombinedNetwork(Data.CORE, organismId, "BP"),
                                      cache.getCombinedNetwork(Data.CORE, organismId, "CC"),
                                      cache.getCombinedNetwork(Data.CORE, organismId, "MF")
                                     };
        
//        Matrix[] combined = {cache.getMatrix((int) organismId, "CombinedMatrix_BP"), cache.getMatrix((int) organismId, "CombinedMatrix_CC"), cache.getMatrix((int) organismId, "CombinedMatrix_MF")};
//
//        logger.info("3 retrieved combined_matrix_MF");

        if (progress.isCanceled()) {
            throw new CancellationException();
        }

//        double[] wtw = {cache.getProduct((int) organismId, "DotProduct_BP"), cache.getProduct((int) organismId, "DotProduct_CC"), cache.getProduct((int) organismId, "DotProduct_MF")};

        logger.info("4 retrived DotProduct_BP/CC/MF, calculated wtw");

        if (progress.isCanceled()) {
            throw new CancellationException();
        }

        try {
            int selected = PreCalculatedWeightSelection.selectBranch(combined, label);

            logger.info("5 selected branch " + selected);

            combinedMatrix = combined[selected].getData();
            weights = combined[selected].getWeightMap(); //cache.getWeightMap(organismId, "weights_" + Constants.goBranches[selected]);

            logger.info("6 retrieved weight map"); 
        }
        catch (ApplicationException e) {
            logger.info("failed to select branch, falling back to average: " + e.getMessage());
            
            weights = AverageByNetworkCalculator.average(IndexToNetworkIdMap);
            progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
            progress.setProgress(Constants.PROGRESS_COMBINING);
            combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);
        }
    }
}
