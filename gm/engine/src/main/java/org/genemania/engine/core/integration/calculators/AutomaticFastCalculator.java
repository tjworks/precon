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

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.genemania.engine.core.integration.calculators;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.Vector;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.integration.CombineNetworksOnly;
import org.genemania.engine.core.integration.MakeKtK2;
import org.genemania.engine.core.integration.PreCalculatedKtK;
import org.genemania.engine.exception.WeightingFailedException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * "Fast" version of automatic weighting, includes -/- interactions and
 * uses precomputed KtK
 */
public class AutomaticFastCalculator extends AbstractNetworkWeightCalculator {
    private static Logger logger = Logger.getLogger(AutomaticFastCalculator.class);

    public AutomaticFastCalculator(DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(cache, networkIds, organismId, label, progress);
    }

    public AutomaticFastCalculator(String namespace, DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(namespace, cache, networkIds, organismId, label, progress);
    }

    public void process() throws ApplicationException {
        boolean hasUserNetworks = queryHasUserNetworks();
        if (hasUserNetworks) {
            throw new ApplicationException("auto_fast combining does not support user networks");
        }

        progress.setStatus(Constants.PROGRESS_WEIGHTING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_WEIGHTING);

        // we take a copy of the basic KtK, so it can have its bias related values
        // updated
        DenseMatrix KtK = (DenseMatrix) cache.getKtK(namespace, organismId, Constants.DataFileNames.KtK_BASIC.getCode()).getData().copy();
        Map<Long, Integer> columnMap = getColumnId(hasUserNetworks);
        List<Long> idList = new ArrayList();
        List<Integer> indexList = new ArrayList();

        int i = 0;
        for (Collection<Long> group: networkIds) {
            for (long id: group) {

                idList.add(id);
                indexList.add(columnMap.get(id));
                IndexToNetworkIdMap.put(i, id);
                i++;
            }
        }

        // throw out rows/cols of KtK we don't need
        KtK = MakeKtK2.RemoveNetwork(KtK, indexList);

        try {
            weights = PreCalculatedKtK.automaticPreCalculatedGram(KtK, cache, idList, organismId, label, IndexToNetworkIdMap, progress);
        }
        catch (ApplicationException e) {
            logger.error("weighting calculation failed, falling back to average: " + e.getMessage());
            weights = AverageByNetworkCalculator.average(IndexToNetworkIdMap);
        }
        // produce combined result
        progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_COMBINING);
        combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);
    }
}
