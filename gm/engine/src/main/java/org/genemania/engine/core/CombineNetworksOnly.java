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

package org.genemania.engine.core;

import java.util.Map;

import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;

import org.apache.log4j.Logger;
import org.genemania.engine.converter.INetworkMatrixProvider;
import org.genemania.engine.exception.CancellationException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
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

//    public static Matrix combine(Map<Integer, Double> IndexToWeightMap, int organismId, InteractionNetworkCache cache) throws ApplicationException {
    public static Matrix combine(Map<Integer, Double> IndexToWeightMap, int organismId, INetworkMatrixProvider provider, ProgressReporter progress) throws ApplicationException {
        Matrix combined = null;
        for (Integer i: IndexToWeightMap.keySet()) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            double weight = IndexToWeightMap.get(i);
                Matrix network = provider.getNetworkMatrix(i, NullProgressReporter.instance());
        	//Matrix network = cache.getNetwork(organismId, i);
            if (combined == null) {
                int size = network.numRows(); // should be square
                combined = new FlexCompColMatrix(size, size);
                logger.info("CombinedMatrix Initiated");
            }
            combined.add(weight, network);
            
            //network = null;
            //System.gc();
        }
        logger.info("Combine Matrix done!");
        return combined;
    }
}
