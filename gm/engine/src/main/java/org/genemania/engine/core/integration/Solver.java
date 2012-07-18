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

import org.genemania.engine.core.*;
import java.util.HashMap;
import java.util.Map;

import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrices;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.MatrixSingularException;
import no.uib.cipr.matrix.QR;
import no.uib.cipr.matrix.Vector;

import org.apache.log4j.Logger;
import org.genemania.engine.config.Config;
import org.genemania.engine.core.utils.Normalization;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.exception.WeightingFailedException;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

public class Solver {

    /**
     * Generic Solver for all weighting methods
     * computes inverse using QR factorization (apparently KtK is ill conditioned for original method)
     * removes row and column of corresponding negative weights
     * until and recomputes inverse until all weight are positive
     * returns a networkId map to weights.
     */
    private static Logger logger = Logger.getLogger(Solver.class);
    public static double EPSILON = Math.pow(2, -52);
    public static double DELTA = 1E-16; // for comparisons: TODO: rethink

    public static Map<Long, Double> solve(Matrix KtK, Vector KtT, Map<Integer, Long> IndexToNetworkIdMap, ProgressReporter progress) throws ApplicationException {
        Vector ss = MatrixUtils.absRowSums(KtK);
        double maxss = ss.norm(Vector.Norm.Infinity);

        // TODO: add a test case for when this filter kicks in
        int[] indices = MatrixUtils.findGT(ss, maxss * EPSILON);

        // the copy() produces dense matrices, which should be okay since the
        // size of the matrix is just numNetworks+1
        Matrix KtKclean = Matrices.getSubMatrix(KtK, indices, indices).copy();
        Vector KtTclean = Matrices.getSubVector(KtT, indices).copy();

        // conditionally apply regularization
        if (Config.instance().isRegularizationEnabled()) {
            double regConst = Config.instance().getRegularizationConstant();

            logger.debug("applying regularization with constant " + regConst);
            for (int i = 0; i < KtKclean.numRows(); i++) {
                KtKclean.set(i, i, KtKclean.get(i, i) + regConst);
            }
        }
        
        boolean done = false;
        int[] posWeights = null;
        Vector alpha = null;

        while (!done) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            logger.debug("solving for weights");
            alpha = new DenseVector(KtTclean.size());
            DenseVector temp = new DenseVector(KtTclean.size());
            try {
                QR factorization = QR.factorize(KtKclean);
                factorization.getQ().transMult(KtTclean, temp);
                factorization.getR().solve(temp, alpha);
            }
            catch (MatrixSingularException e) { // TODO: deserve's a test-case
                throw new WeightingFailedException("Singular Matrix");
            }
            /*
            logger.debug("alpha: \n" + alpha);
            DenseVector check = new DenseVector(alpha.size());
            KtKclean.mult(alpha, check);
            check.add(-1d, KtTclean);
            logger.debug("check: \n" + check);
             */

            // cleanup negative weights

            int totalWeights = alpha.size();
            posWeights = MatrixUtils.findGE(alpha, 0 + DELTA);
            posWeights = MatrixUtils.filter(posWeights, 0); // index of 0 is for the bias column, ignore

            // error if no weights left
            if (posWeights.length == 0) {
                throw new WeightingFailedException("All Networks Eliminated");
            }

            // if all the weights were positive, we're done
            if (posWeights.length == (totalWeights - 1)) {    // the -1 is to not count the bias column
                break;
            }

            // so we need to drop the rows/cols corresponding with the negative weights, but
            // always keep the bias column
            posWeights = MatrixUtils.arrayJoin(new int[]{0}, posWeights); // add bias in

            KtKclean = Matrices.getSubMatrix(KtKclean, posWeights, posWeights).copy();
            KtTclean = Matrices.getSubVector(KtTclean, posWeights).copy();
            indices = MatrixUtils.subArray(indices, posWeights);

        }

        // build up a map containing weights for each network
        Map<Long, Double> NetworkIdToWeightMap = new HashMap<Long, Double>();

        for (int i = 0; i < indices.length; i++) {
            if (indices[i] == 0) {  // ignore bias network
                continue;
            }
            double weight = alpha.get(i);
            // the minus 1 is because the indices point back to
            // a list that included the bias term which we ignore
            Long networkId = IndexToNetworkIdMap.get(indices[i] - 1);
            if (networkId == null) {
                throw new ApplicationException("inconsistent network indices");
            }
            NetworkIdToWeightMap.put(networkId, weight);

        }

        // normalize weights so they add to 1
        if (Config.instance().isNetworkWeightNormalizationEnabled()) {
            logger.debug("normalizing network weights to add to 1");
            Normalization.normalizeWeights(NetworkIdToWeightMap);
        }
        
        logger.info("number of weights : " + NetworkIdToWeightMap.size());
        return NetworkIdToWeightMap;
    }
}
