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

/**
 * Method for unregularized GeneMANIA weighting algorithm
 * requires the full list of selected networks to be loaded and
 * the label vector. 
 * 
 * please see FastKernelWeight.m for matlab implementation
 * 
 */
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrices;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.MatrixEntry;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;
import org.genemania.engine.converter.INetworkMatrixProvider;
import org.genemania.engine.exception.CancellationException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
import org.genemania.util.ProgressReporter;

public class Automatic {

    private static Logger logger = Logger.getLogger(Automatic.class);
    public static double EPSILON = Math.pow(2, -52);
    public static double DELTA = 1E-6; // for comparisons: TODO: rethink

    //public static Map<Integer, Double> automatic(List<Integer> networks, int organismId, InteractionNetworkCache cache, Vector labels, Map<Integer, Integer> IndexToNetworkIdMap) throws Exception {
    public static Map<Integer, Double> automatic(List<Integer> networks,
            int organismId, INetworkMatrixProvider provider, Vector labels,
            Map<Integer, Integer> IndexToNetworkIdMap, ProgressReporter progress) throws ApplicationException {

        // labels must be in {-1,0,1}. TODO: add check

        logger.debug("building system to solve for weights");
        int[] ixPos = MatrixUtils.find(labels, 1d);
        int[] ixNeg = MatrixUtils.find(labels, -1d);

        int numPos = ixPos.length;
        int numNeg = ixNeg.length;

        int numNetworks = networks.size(); // MM
        int numNodes = labels.size();      // NN

        // allocated space includes an extra (bias) network
        DenseMatrix KtK = new DenseMatrix(numNetworks + 1, numNetworks + 1);
        DenseVector KtT = new DenseVector(numNetworks + 1);

        double posConst = 2d * numNeg / (numPos + numNeg);
        double negConst = -2d * numPos / (numPos + numNeg);

        int numPosPos = numPos * (numPos - 1);
        int numPosNeg = 2 * numPos * numNeg;

        double posPosTarget = posConst * posConst;
        double posNegTarget = posConst * negConst;

        double biasVal = 1d / (numPosPos + numPosNeg);

        KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg));
        KtK.set(0, 0, biasVal);

        Matrix[] Wpp = new Matrix[numNetworks];
        Matrix[] Wpn = new Matrix[numNetworks];

        for (int ii = 0; ii < numNetworks; ii++) {
            //Matrix network = cache.getNetwork(organismId, networks.get(ii));
            Matrix network = provider.getNetworkMatrix(networks.get(ii), NullProgressReporter.instance());

            Matrix subNetwork = Matrices.getSubMatrix(network, ixPos, ixPos);
            Wpp[ii] = sparseFlexCopy(subNetwork);
            MatrixUtils.setDiagonalZero(Wpp[ii]);

            subNetwork = Matrices.getSubMatrix(network, ixPos, ixNeg);
            Wpn[ii] = sparseFlexCopy(subNetwork);

            double ssWpp = MatrixUtils.sum(Wpp[ii]);
            double ssWpn = MatrixUtils.sum(Wpn[ii]);

            KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn);
            KtK.set(ii + 1, 0, biasVal * (ssWpp + 2 * ssWpn));
            KtK.set(0, ii + 1, KtK.get(ii + 1, 0));

            for (int jj = 0; jj <= ii; jj++) {

                if (progress.isCanceled()) {
                    throw new CancellationException();
                }

                double sumOfProds = 0;

                sumOfProds += MatrixUtils.elementMultiplySum(Wpp[ii], Wpp[jj]);
                sumOfProds += 2 * MatrixUtils.elementMultiplySum(Wpn[ii], Wpn[jj]);

                KtK.set(ii + 1, jj + 1, sumOfProds);
                KtK.set(jj + 1, ii + 1, sumOfProds);
            }

            // TODO: do we still want this explicit gc call?
            network = null;
            subNetwork = null;
            System.gc();
        }

        return Solver.solve(KtK, KtT, IndexToNetworkIdMap, progress);

    }

    /*
     * create a sparse flex matrix from the given matrix,
     * by simply iterating over its elements and ignoring those
     * that are exactly 0.
     */
    public static FlexCompColMatrix sparseFlexCopy(Matrix m) {
        FlexCompColMatrix f = new FlexCompColMatrix(m.numRows(), m.numColumns());
        for (MatrixEntry e: m) {
            if (e.get() != 0d) {
                f.set(e.row(), e.column(), e.get());
            }
        }

        return f;
    }
}
