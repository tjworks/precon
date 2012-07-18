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

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Vector;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.matricks.Matrix;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * 
 * @author Quentin Shao
 *
 */
public class PreCalculatedKtK {

    private static Logger logger = Logger.getLogger(PreCalculatedKtK.class);
    public static double EPSILON = Math.pow(2, -52);
    public static double DELTA = 1E-6; // for comparisons: TODO: rethink

    static boolean includeNegNegTarget = true;
    static boolean includeNegNegBias = true;
    
    /*
     * the version of KtK we get is computed using '1's in the bias column of K,
     * we need to update the first row/col of KtK
     */
    public static Map<Long, Double> automaticPreCalculatedGram(DenseMatrix KtK, DataCache cache,
            List<Long> networkIds, long organismId, Vector labels, Map<Integer, Long> IndexToNetworkIdMap, ProgressReporter progress)
            throws ApplicationException {
        int[] ixPos = MatrixUtils.find(labels, 1d);
        int[] ixNeg = MatrixUtils.find(labels, -1d);
        int numNetworks = KtK.numRows() - 1; // MM
        int numPos = ixPos.length;
        int numNeg = ixNeg.length;

        int numNodes = labels.size(); // NN
        DenseVector KtT = new DenseVector(KtK.numColumns());

        double posConst = 2d * numNeg / (numPos + numNeg);
        double negConst = -2d * numPos / (numPos + numNeg);

        int numPosPos = numPos * (numPos - 1);
        int numPosNeg = 2 * numPos * numNeg;
        int numNegNeg = numNeg * (numNeg - 1);

        double posPosTarget = posConst * posConst;
        double posNegTarget = posConst * negConst;
        double negNegTarget = negConst * negConst;

        double biasVal;
        if (includeNegNegBias) {
            biasVal = 1d / (numPosPos + numPosNeg + numNegNeg);
        }
        else {
            biasVal = 1d / (numPosPos + numPosNeg);
        }

        
        if (includeNegNegTarget) {
            KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg + negNegTarget * numNegNeg));
        }
        else {
            KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg));
        }


        KtK.set(0, 0, biasVal);
        for (int ii = 0; ii < numNetworks; ii++) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            SymMatrix network = cache.getNetwork(Data.CORE, organismId, networkIds.get(ii)).getData();

            // TODO: since we are just computing sums, we could avoid materializing
            // the subnetworks by creating a specialized sum method that takes the index
            // vector(s) as an arg
            
//            Matrix subNetwork = Matrices.getSubMatrix(network, ixPos, ixPos);
//            Matrix Wpp = new FlexCompColMatrix(subNetwork);
            SymMatrix Wpp = network.subMatrix(ixPos);
//            MatrixUtils.setDiagonalZero(Wpp);

//            subNetwork = Matrices.getSubMatrix(network, ixPos, ixNeg);
//            Matrix Wpn = new FlexCompColMatrix(subNetwork);
            Matrix Wpn = network.subMatrix(ixPos, ixNeg);

//            double ssWpp = MatrixUtils.sum(Wpp);
//            double ssWpn = MatrixUtils.sum(Wpn);
            double ssWpp = Wpp.elementSum();
            double ssWpn = Wpn.elementSum();

            if (includeNegNegTarget) {
                double ssWnn = network.elementSum() - ssWpp - 2*ssWpn;
                KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn + negNegTarget * ssWnn);
            }
            else {
                KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn);
            }
            
            double networkSum = KtK.get(0, ii+1);
            KtK.set(0, ii+1, biasVal*networkSum);
            KtK.set(ii+1, 0, biasVal*networkSum);
        }
        
        return Solver.solve(KtK, KtT, IndexToNetworkIdMap, progress);
    }
}
