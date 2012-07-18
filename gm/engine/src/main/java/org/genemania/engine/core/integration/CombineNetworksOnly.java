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

package org.genemania.engine.core.integration;

import java.util.Map;
import org.apache.log4j.Logger;
import org.genemania.engine.config.Config;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.data.Network;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.matricks.Matrix;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * sums a set of matrices based on a set of weights
 * requires a map of networkId and corresponding weights
 * will load the necessary matrices from cache.
 * 
 * 
 * @author Quentin Shao
 *
 */
public class CombineNetworksOnly {

    public static Logger logger = Logger.getLogger(CombineNetworksOnly.class);

    public static SymMatrix combine(Map<Long, Double> networkIdToWeightMap, String namespace, long organismId, DataCache cache, ProgressReporter progress) throws ApplicationException {
        SymMatrix combined = null;
        for (Long i: networkIdToWeightMap.keySet()) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }

            double weight = networkIdToWeightMap.get(i);
            Network network = cache.getNetwork(namespace, organismId, i);
            Matrix data = network.getData();
            //Matrix network = cache.getNetwork(organismId, i);
            if (combined == null) {
                int size = data.numRows(); // should be square
                //combined = new FlexColFloatMatrix(size, size);
                combined = Config.instance().getMatrixFactory().symSparseMatrix(size);
                logger.info("CombinedMatrix Initiated");
            }
            combined.add(weight, data);
            
            //network = null;
            //System.gc();
        }
        logger.info("Combine Matrix done!");
        return combined;
    }
}
