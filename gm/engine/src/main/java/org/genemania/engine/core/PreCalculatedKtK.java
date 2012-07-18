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

import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrices;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;
import org.genemania.engine.converter.INetworkMatrixProvider;
import org.genemania.engine.exception.CancellationException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
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

    protected static Map<Integer, Double> automaticPreCalculatedGram(DenseMatrix KtK, INetworkMatrixProvider provider,
            List<Integer> networkIds, Vector labels, Map<Integer, Integer> IndexToNetworkIdMap, ProgressReporter progress)
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

        double biasVal = 1d / (numPosPos + numPosNeg + numNegNeg);
        KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg + negNegTarget * numNegNeg));
        for (int ii = 0; ii < numNetworks; ii++) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            Matrix network = provider.getNetworkMatrix(networkIds.get(ii), NullProgressReporter.instance());

            Matrix subNetwork = Matrices.getSubMatrix(network, ixPos, ixPos);
            Matrix Wpp = new FlexCompColMatrix(subNetwork);
            MatrixUtils.setDiagonalZero(Wpp);

            subNetwork = Matrices.getSubMatrix(network, ixPos, ixNeg);
            Matrix Wpn = new FlexCompColMatrix(subNetwork);

            double ssWpp = MatrixUtils.sum(Wpp);
            double ssWpn = MatrixUtils.sum(Wpn);

            KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn);
        }
        
        return Solver.solve(KtK, KtT, IndexToNetworkIdMap, progress);
    }
}
