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

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import no.uib.cipr.matrix.Vector;
import org.genemania.engine.Constants;
import org.genemania.engine.cache.DataCache;
//import org.genemania.engine.matricks.Vector;
import org.genemania.engine.core.integration.CombineNetworksOnly;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * compute the plain old average network weighting
 */
public class AverageByNetworkCalculator extends AbstractNetworkWeightCalculator {

    public AverageByNetworkCalculator(DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(cache, networkIds, organismId, label, progress);
    }

    public AverageByNetworkCalculator(String namespace, DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(namespace, cache, networkIds, organismId, label, progress);
    }

    public void process() throws ApplicationException {
        int i = 0;
        for (Collection<Long> group: networkIds) {
            for (long id: group) {
                IndexToNetworkIdMap.put(i, id);
                i++;
            }
        }
        progress.setStatus(Constants.PROGRESS_WEIGHTING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_WEIGHTING);
        weights = average(IndexToNetworkIdMap);

        progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
        progress.setProgress(Constants.PROGRESS_COMBINING);
        combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);
    }

    protected static Map<Long, Double> average(Map<Integer, Long> IndexToNetworkMap) {

        Double weight = 1.0d / IndexToNetworkMap.size();

        Map<Long, Double> matrixToWeightMap = new HashMap<Long, Double>();
        for (Integer i: IndexToNetworkMap.keySet()) {
            matrixToWeightMap.put(IndexToNetworkMap.get(i), weight);
        }

        return matrixToWeightMap;
    }

    public static final String PARAM_KEY_FORMAT = "%s-%s"; // method-networks

    /*
     * the method and sorted list of network ids uniquely defines the
     * weight calculation
     */
    @Override
    public String getParameterKey() throws ApplicationException {
        String networks = formattedNetworkList(this.networkIds);
        return String.format(PARAM_KEY_FORMAT, Constants.CombiningMethod.AVERAGE, networks);
    }
}
