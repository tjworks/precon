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

import org.genemania.engine.core.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.Vector;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants;
import org.genemania.engine.Constants.CombiningMethod;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.data.CombinedNetwork;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.integration.CombineNetworksOnly;
import org.genemania.engine.core.integration.MakeKtK2;
import org.genemania.engine.core.integration.Solver;
import org.genemania.engine.exception.WeightingFailedException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * compute branch specific go annotation based weighting, for one of
 * a given branch: BP, MF, CC
 */
public class BranchSpecificCalculator extends AbstractNetworkWeightCalculator {

    private static Logger logger = Logger.getLogger(BranchSpecificCalculator.class);
    CombiningMethod method;

    public BranchSpecificCalculator(DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, CombiningMethod method, ProgressReporter progress) throws ApplicationException {
        super(cache, networkIds, organismId, label, progress);
        this.method = method;
    }

    public BranchSpecificCalculator(String namespace, DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, CombiningMethod method, ProgressReporter progress) throws ApplicationException {
        super(namespace, cache, networkIds, organismId, label, progress);
        this.method = method;
    }

    public void process() throws ApplicationException {
        progress.setStatus(Constants.PROGRESS_WEIGHTING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_WEIGHTING);

        boolean hasUserNetworks = queryHasUserNetworks();
        DenseMatrix KtK = (DenseMatrix) getKtK(method.toString(), hasUserNetworks);

        // shortcut for the all networks selected case. only for core case for now,
        // not when including user networks

        boolean done = false;
        if ((namespace == null || !(hasUserNetworks)) && KtK.numColumns() == (networkIds.size() + 1)) {
            try {
                getPrecomputedResultAllNetworks();
                done = true;
            }
            catch (ApplicationException e) {
                logger.debug("unable to fetch precomputed result");
            }
        }

        if (!done) {
            computeNewResult(hasUserNetworks, KtK);
        }
    }

    /*
     * perform branch specific computation
     */
    void computeNewResult(boolean hasUserNetworks, DenseMatrix KtK) throws ApplicationException {
            DenseMatrix KtT = (DenseMatrix) getKtT(method.toString(), hasUserNetworks);
            List<Integer> idList = new ArrayList();
            Map<Long, Integer> columnMap = getColumnId(hasUserNetworks);

            int i = 0;
            for (Collection<Long> group: networkIds) {
                for (long id: group) {

                    idList.add(columnMap.get(id));
                    IndexToNetworkIdMap.put(i, id);
                    i++;
                }
            }
            KtK = MakeKtK2.RemoveNetwork(KtK, idList);
            KtT = MakeKtT.RemoveNetwork(KtT, idList);
            try {
                weights = Solver.solve(KtK, MatrixUtils.extractColumnToVector(KtT, 0), IndexToNetworkIdMap, progress);
            }
            catch (WeightingFailedException e) {
                logger.error("weighting calculation failed, falling back to average: " + e.getMessage());
                weights = (AverageByNetworkCalculator.average(IndexToNetworkIdMap));
            }
            progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
            progress.setProgress(Constants.PROGRESS_COMBINING);
            combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);
    }

    /*
     * pull out precomputed result for case where all networks selected
     * 
     */
    void getPrecomputedResultAllNetworks() throws ApplicationException {
//        weights = cache.getWeightMap(organismId, "weights_" + method.toString());
        CombinedNetwork combinedObject = cache.getCombinedNetwork(Data.CORE, organismId, method.toString());  // TODO: check we are enforcing that method must be one of the gobranches
        progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_COMBINING);
//        combinedMatrix = cache.getMatrix(organismId, "CombinedMatrix_" + method.toString());

        weights = combinedObject.getWeightMap();
        combinedMatrix = combinedObject.getData();
    }

    public static final String PARAM_KEY_FORMAT = "%s-%s"; // method-networks

    /*
     * the method and sorted list of network ids uniquely defines the
     * weight calculation
     */
    @Override
    public String getParameterKey() throws ApplicationException {
        String networks = formattedNetworkList(this.networkIds);
        return String.format(PARAM_KEY_FORMAT, method.toString(), networks);        
    }
}
