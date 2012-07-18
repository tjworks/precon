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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrices;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.MatrixSingularException;
import no.uib.cipr.matrix.QR;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;

import org.apache.log4j.Logger;
import org.genemania.engine.Constants;

public class CombineNetworks {

    private static Logger logger = Logger.getLogger(CombineNetworks.class);
    // java doesn't have a constant for the distance between 1 and the next
    // larger representable value??
    public static double EPSILON = Math.pow(2, -52);
    public static double DELTA = 1E-6; // for comparisons: TODO: rethink

    /**
     * Return a combined network, computed as a weighted
     * sum of the given networks.
     *
     * Will likely change this to use an int constant for the
     * combining method. Probably also needs a set of prior weights
     * for some of the combining methods.
     *
     * @param networks
     * @param method
     * @return
     * @throws Exception
     */
    public static Matrix combine(List<Matrix> networks, Vector labels, Constants.CombiningMethod method) throws Exception {
        // TODO: check that matrices are square, symmetric (should we bother?), and all of the same dimension

        if (method == Constants.CombiningMethod.AVERAGE) {
            return combine(average(networks));
        }
        else if (method == Constants.CombiningMethod.AUTOMATIC) {
            return combine(automatic(networks, labels));
        }
        else {
            throw new Exception("Unsupported network combination method: " + method);
        }
    }

    public static Map<Matrix, Double> computeWeights(List<Matrix> networks, Vector labels, Constants.CombiningMethod method) throws Exception {
        // TODO: check that matrices are square, symmetric (should we bother?), and all of the same dimension

        if (method == Constants.CombiningMethod.AVERAGE) {
            return average(networks);
        }
        else if (method == Constants.CombiningMethod.AUTOMATIC) {
            return automatic(networks, labels);
        }
        else {
            throw new Exception("Unsupported network combination method: " + method);
        }
    }

    /**
     * equally weighted combination
     *
     * @param networks
     * @return
     * @throws Exception
     */
    private static Map<Matrix, Double> average(List<Matrix> networks) throws Exception {
        Double weight = 1.0d / networks.size();

        Map<Matrix, Double> matrixToWeightMap = new HashMap<Matrix, Double>();
        for (Matrix network: networks) {
            matrixToWeightMap.put(network, weight);
        }

        return matrixToWeightMap;
    }

    /**
     * TODO: change return value to include weights as well as the combined network
     *
     * This closely follows the matlab implementation
     *
     * @param networks
     * @param labels
     * @return
     * @throws Exception
     */
    protected static Map<Matrix, Double> automatic(List<Matrix> networks, Vector labels) throws Exception {

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

        //double posConst = 2d*numNeg/(numPos+numNeg);
        //double negConst = -2d*numPos/(numPos+numNeg);
        double posConst = (2d * numNeg) / (numPos + numNeg);
        double negConst = (-2d * numPos) / (numPos + numNeg);

        int numPosPos = numPos * (numPos - 1);
        int numPosNeg = 2 * numPos * numNeg;

        double posPosTarget = posConst * posConst;
        double posNegTarget = posConst * negConst;

        logger.debug(String.format("numPos: %d, numNeg: %d", numPos, numNeg));
        logger.debug(String.format("posPosTarget: %f, posNegTarget: %f", posPosTarget, posNegTarget));
        double biasVal = 1d / (numPosPos + numPosNeg);

        KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg));
        KtK.set(0, 0, biasVal);

        Matrix[] Wpp = new Matrix[numNetworks];
        Matrix[] Wpn = new Matrix[numNetworks];

        for (int ii = 0; ii < numNetworks; ii++) {
            Matrix network = networks.get(ii);

            Matrix subNetwork = Matrices.getSubMatrix(network, ixPos, ixPos);
            Wpp[ii] = new FlexCompColMatrix(subNetwork);
            MatrixUtils.setDiagonalZero(Wpp[ii]);

            subNetwork = Matrices.getSubMatrix(network, ixPos, ixNeg);
            Wpn[ii] = new FlexCompColMatrix(subNetwork);

            double ssWpp = MatrixUtils.sum(Wpp[ii]);
            double ssWpn = MatrixUtils.sum(Wpn[ii]);

            KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn);
            KtK.set(ii + 1, 0, biasVal * (ssWpp + 2 * ssWpn));
            KtK.set(0, ii + 1, KtK.get(ii + 1, 0));

            for (int jj = 0; jj <= ii; jj++) {

                double sumOfProds = 0;

                sumOfProds += MatrixUtils.elementMultiplySum(Wpp[ii], Wpp[jj]);
                sumOfProds += 2 * MatrixUtils.elementMultiplySum(Wpn[ii], Wpn[jj]);

                KtK.set(ii + 1, jj + 1, sumOfProds);
                KtK.set(jj + 1, ii + 1, sumOfProds);
            }
        }

        // debugging: do we have any label nodes with

        Vector ss = MatrixUtils.absRowSums(KtK);
        double maxss = ss.norm(Vector.Norm.Infinity);

        // TODO: add a test case for when this filter kicks in
        int[] indices = MatrixUtils.findGT(ss, maxss * EPSILON);

        // the copy() produces dense matrices, which should be okay since the
        // size of the matrix is just numNetworks+1

        logger.debug("full orig target vector: \n" + KtT);
        Matrix KtKclean = Matrices.getSubMatrix(KtK, indices, indices).copy();
        Vector KtTclean = Matrices.getSubVector(KtT, indices).copy();

        boolean done = false;
        int[] posWeights = null;
        Vector alpha = null;

        while (!done) {
            logger.debug("solving for weights");
            alpha = new DenseVector(KtTclean.size());
            DenseVector temp = new DenseVector(KtTclean.size());
            try {
                QR factorization = QR.factorize(KtKclean);
                factorization.getQ().transMult(KtTclean, temp);
                factorization.getR().solve(temp, alpha);
            }
            catch (MatrixSingularException e) { // TODO: deserve's a test-case
                logger.warn("automatic weighting failed (matrix singular), using average weighting");
                return average(networks);
            }

            logger.debug("alpha: \n" + alpha);
            DenseVector check = new DenseVector(alpha.size());
            KtKclean.mult(alpha, check);
            check.add(-1d, KtTclean);
            logger.debug("check: \n" + check);
            logger.debug("KtT after previous solve: \n" + KtTclean);

            // cleanup negative weights
            int totalWeights = alpha.size();
            posWeights = MatrixUtils.findGE(alpha, 0 + DELTA);
            posWeights = MatrixUtils.filter(posWeights, 0); // index of 0 is for the bias column, ignore

            // no weights left? fall back to average weighting. TODO: maybe we should make this function
            // return an error, and let the calling code handle appropriately, either selecting average, or
            // returning error to the user etc.
            if (posWeights.length == 0) {
                logger.warn("all networks eliminated, using averaging");
                return average(networks);
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
        Map<Matrix, Double> matrixToWeightMap = new HashMap<Matrix, Double>();
        for (int i = 0; i < indices.length; i++) {
            if (indices[i] == 0) {  // ignore bias network
                continue;
            }
            double weight = alpha.get(i);
            Matrix network = networks.get(indices[i] - 1);  // the minus 1 is because the indices point back to
            // a list that included the bias term which we ignore
            matrixToWeightMap.put(network, weight);
        }

        return matrixToWeightMap;

    }

    /**
     * computed the weighted sum of the given networks
     *
     * @param matrixToWeightMap
     * @return
     * @throws Exception
     */
    public static Matrix combine(Map<Matrix, Double> matrixToWeightMap) throws Exception {

        Matrix combined = null;
        for (Matrix network: matrixToWeightMap.keySet()) {
            double weight = matrixToWeightMap.get(network);
            if (combined == null) {
                int size = network.numRows(); // should be square
                combined = new FlexCompColMatrix(size, size);
            }
            combined.add(weight, network);
        }

        //return new CompColMatrix(combined);	// TODO: unexpectedly slow conversion, investigate
        return combined;
    }
}
