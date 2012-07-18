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
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.config.Config;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.data.CoAnnotationSet;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.matricks.Matrix;
import org.genemania.engine.matricks.MatrixCursor;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * pre-computes the simultaneous weights
 * directly translated from Matlab code FastKernelWeightSW.m
 * Contains fast CoAnnotation algorithm
 * 
 * Requires KtK and Ktt to be passed in.
 * 
 * 
 * @author Quentin Shao
 *
 */
public class CalculateFastWeights2 {

    public static Logger logger = Logger.getLogger(CalculateFastWeights2.class);
    private static double EPSILON = Math.pow(2, -52);
    //used to avoid coannotation matrix having more non zero values than integers allow.
    public static final int MAX_VECTOR_LENGTH = 500000;
    private static double DELTA = 1E-6; // for comparisons: TODO: rethink

    /* no one is using this entry point yet, temporarily marked private */
    private static Map<Long, Double> CalculateWeights(Matrix Labels, List<SymMatrix> networks,
            DenseMatrix KtK, DenseMatrix Ktt, CoAnnotationSet annoSet,
            Map<Integer, Long> IndexToNetworkIdMap, ProgressReporter progress) throws Exception {

//        int numberOfCategories = Labels.numCols();
//        int numberOfGenes = Labels.numRows();
//
//        computeBasicKtK(networks, KtK, numberOfGenes, progress);
//        KtK.scale(numberOfCategories);
//        computeKtT(Labels, networks, Ktt, annoSet, progress);
//        return SolveForWeights(KtK, Ktt, IndexToNetworkIdMap, progress);
        return null;
    }

    /*
     * simple, direct KtK computation factored out of CalculateWeights, TODO remove
     * code duplication there.
     */
    public static void computeBasicKtK(DataCache cache, long organismId,  long[] networkIds, DenseMatrix KtK, int numGenes, ProgressReporter progress) throws ApplicationException {

        int numNetworks = networkIds.length;
        KtK.set(0, 0, numGenes*numGenes);
        for (int i = 0; i < numNetworks; i++) {
            long id_i = networkIds[i];
            SymMatrix network_i = cache.getNetwork(Data.CORE, organismId, id_i).getData();
            
            logger.info("Currently Processing the " + i + "th network, id " + id_i);

            double networkSum = network_i.elementSum();
            KtK.set(i + 1, 0, networkSum);
            KtK.set(0, i + 1, networkSum);

            for (int j = 0; j <= i; j++) {
                if (progress.isCanceled()) {
                    throw new CancellationException();
                }

                long id_j = networkIds[j];
                SymMatrix network_j = cache.getNetwork(Data.CORE, organismId, id_j).getData();
                
                double prodSum = network_i.elementMultiplySum(network_j);
                KtK.set(i + 1, j + 1, prodSum);
                KtK.set(j + 1, i + 1, prodSum);

            }
        }
    }

    /*
     * KtK must already be computed, this builds up KtT from the
     * given networks and the coannotation data
     *
     * TODO: could optimize away the computation of the network sums by saving that
     * computation from elsewhere and passing it in
     */
    public static void computeKtT(DataCache cache, long organismId, Matrix Labels,  long[] networkIds, DenseMatrix Ktt,
            CoAnnotationSet annoSet, ProgressReporter progress) throws ApplicationException {
        int numberOfCategories = Labels.numCols();
        int numberOfGenes = Labels.numRows();
        SymMatrix CoAnnotationMatrix = annoSet.GetCoAnnotationMatrix();
        DenseVector BHalf = annoSet.GetBHalf();

        double constant = annoSet.GetConstant();
        CoAnnotationMatrix.setDiag(0d); // TODO: note we are altering this structure, if its cached other users might be surprised! 
        int numNetworks = networkIds.length;

//        logger.info("CoAnnotation with diagonal values removed: " + CoAnnotationMatrix.elementSum());


        logger.info("Number of Genes " + numberOfGenes + ", Number of Categories " + numberOfCategories + ", Number of networks: " + numNetworks);
        double biasValue = (double) numberOfGenes * (double) numberOfGenes * (double) numberOfCategories;
        logger.info("biasValue: " + biasValue);

        Ktt.set(0, 0, MatrixUtils.sum(BHalf) * numberOfGenes + CoAnnotationMatrix.elementSum() + constant * numberOfGenes * numberOfGenes);

        logger.info("Ktt bias value is " + Ktt.get(0, 0));
        for (int i = 0; i < numNetworks; i++) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            logger.info("Currently Processing the " + i + "th network");
            long id_i = networkIds[i];
            SymMatrix network_i = cache.getNetwork(Data.CORE, organismId, id_i).getData();
            double val = computeKttElement(numberOfGenes, network_i, CoAnnotationMatrix, BHalf, constant);
            Ktt.set(i + 1, 0, val);
        }
    }

    /*
     * note the coAnnotation has non-zero diag, but it doesn't matter since we are
     * multiplying it by a network which (should always) have zero self-interactions.
     */
    public static double computeKttElement(int numberOfGenes, SymMatrix network, SymMatrix CoAnnotationMatrix, DenseVector BHalf, double constant) {
        double result = 0d;

        double networkSum = network.elementSum();

        DenseVector tempVec = new DenseVector(numberOfGenes);
        network.mult(BHalf.getData(), tempVec.getData());
        double tempVecSum = MatrixUtils.sum(tempVec);

        result = network.elementMultiplySum(CoAnnotationMatrix) +
                 tempVecSum + networkSum * constant;
        
        return result;
    }    

    public static Map<Long, Double> SolveForWeights(DenseMatrix KtK, DenseMatrix Ktt, Map<Integer, Long> IndexToNetworkIdMap, ProgressReporter progress) throws Exception {
        return Solver.solve(KtK, MatrixUtils.extractColumnToVector(Ktt, 0), IndexToNetworkIdMap, progress);
    }
    
    protected static no.uib.cipr.matrix.Matrix AllPairs(int N) {
        no.uib.cipr.matrix.Matrix P = new FlexCompColMatrix((N * (N - 1) / 2), 2);
        int row = 0;
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < i; j++) {
                P.set(row, 0, i);
                P.set(row, 1, j);
                row++;

            }
        }

        return P;
    }

    protected static no.uib.cipr.matrix.Matrix ListToN(int N) {
        FlexCompColMatrix temp = new FlexCompColMatrix(N, 1);
        for (int i = 0; i < N; i++) {
            temp.set(i, 0, i);
        }
        return temp;
    }

    /*
     * a simplified, straightforward implementation of the computing
     * the data structures required in simltaneous weights combining,
     * for comparative testing against current version. should produce the
     * same result as FastCoAnnotation().
     */
    public static CoAnnotationSet simpleComputeCoAnnoationSet(long organismId, String goBranch, Matrix labels) {

        int numGenes = labels.numRows();
        int numCategories = labels.numCols();

        double [] ratiosData = simpleComputeSumPosRatios(numGenes, labels);
        DenseVector ratios = new DenseVector(ratiosData, false);
        double constant = simpleComputeConstant(numGenes, ratios);
        logger.info("constant: " + constant);

        DenseVector yHat = simpleComputeYHat(numGenes, ratiosData, labels);
        logger.info("computed YHat");

        SymMatrix AHat = simpleComputeAHatLessMem(numGenes, numCategories, labels);
        logger.info("computed AHat");

        CoAnnotationSet cas = new CoAnnotationSet(organismId, goBranch, AHat, yHat, constant);

        return cas;
    }

    /*
     * compute:
     *
     *   constant = \sum_{c} (n^{+}_{c}/n)^2
     * 
     */
    public static double simpleComputeConstant(int numGenes, no.uib.cipr.matrix.Vector ratios) {

        double constant = ratios.dot(ratios);
        return constant;

    }

    /*
     * compute:
     *
     *   yHat = \sum_{c} (-2n^{+}_{c})/n y^{\vec}_c
     *
     */
    public static DenseVector simpleComputeYHat(int numGenes, double [] ratios, Matrix labels) {
//        Matrix yHat = new DenseMatrix(numGenes, 1);
//
//        no.uib.cipr.matrix.Vector yHatTemp = new DenseVector(numGenes);
        double [] yHatTempData = new double[numGenes];

        labels.multAdd(ratios, yHatTempData);

        DenseVector yHat = new DenseVector(yHatTempData, false);
        yHat.scale(-2d);

        return yHat;
    }

    /*
     * compute:
     *
     *   \hat{A} = \sum_{c} A_c
     *
     * this version optimizes memory allocation by looping over label
     * matrix instead of materializing a coannotation matrix for each
     * category.
     *
     */
    public static SymMatrix simpleComputeAHatLessMem(int numGenes, int numCategories, Matrix labels) {

        SymMatrix AHat = Config.instance().getMatrixFactory().symSparseMatrix(numGenes);

        int [] rows = new int[numGenes];
        for(int i=0; i<rows.length; i++) {
            rows[i] = i;
        }


        for (int c=0; c<numCategories; c++) {
            int [] cols = {c};

//            Matrix yc = MatrixUtils.getSubMatrix(labels, rows, cols);
            Matrix yc = labels.subMatrix(rows, cols);


//            for (MatrixEntry e1: yc) {
//                for (MatrixEntry e2: yc) {
//                    double z = e1.get() * e2.get();
//                    if (z != 0d) {
//                        int i = e1.row();
//                        int j = e2.row();
//                        if (i != j) {
//                            AHat.add(i, j, z);
//                        }
//                    }
//                }

            MatrixCursor e1 = yc.cursor();
            while (e1.next()) {
                MatrixCursor e2 = yc.cursor();
                while (e2.next()) {
                    int i = e1.row();
                    int j = e2.row();
                    if (i > j) { // can't assume we iterate through rows in ascending order, so must test TODO: implement a sparse version of addOuterProd ... could make more efficient
                        double z = e1.val() * e2.val();
                        if (z != 0d) {
                            AHat.add(i, j, z);
                        }
                    }
                }
            }
        }

        return AHat;
    }

    /*
     * compute vector of n+/n ratios, for each category
     */
    public static double [] simpleComputeSumPosRatios(int numGenes, Matrix labels) {
        double [] ratiosData = new double [labels.numCols()];
//        Vector ratios = MatrixUtils.columnSums(labels);
        labels.columnSums(ratiosData);
        Vector ratios = new DenseVector(ratiosData, false);
        ratios.scale(1d/numGenes);
        //return ratios;
        return ratiosData;
    }

    /*
     * compute KtT(0)
     */
    public static double simpleComputeKtT0(CoAnnotationSet annoSet, int numGenes) {
//        double result = MatrixUtils.sum(annoSet.GetBHalf()) * numGenes + MatrixUtils.sum(annoSet.GetCoAnnotationMatrix()) + annoSet.GetConstant() * numGenes * numGenes;
        double result = MatrixUtils.sum(annoSet.GetBHalf()) * numGenes + annoSet.GetCoAnnotationMatrix().elementSum() + annoSet.GetConstant() * numGenes * numGenes;
        return result;
    }

    /*
     * compute KtT(i) for i>0, with corresponding network
     *
     * networkSum could be computed from network, but we take it as an argument
     * since the sum is also computed elsewhere, as an optimization
     * 
     */
    public static double simpleComputeKtTi(CoAnnotationSet annoSet, int numGenes, Matrix network, double networkSum) {
        no.uib.cipr.matrix.Matrix tempSum2 = new FlexCompColMatrix(1, numGenes);

        // isn't the next loop equivalent to:
        // annoSet.GetBHalf().transAmult(network, tempSum2);
//        for (MatrixEntry e: network) {
        MatrixCursor cursor = network.cursor();
        while (cursor.next()) {
            tempSum2.set(0, cursor.col(), tempSum2.get(0, cursor.col()) + cursor.val() * (annoSet.GetBHalf().get(cursor.row())));
        }

//        double result = MatrixUtils.elementMultiplySum(network, annoSet.GetCoAnnotationMatrix()) +
//                MatrixUtils.sum(tempSum2) + networkSum * annoSet.GetConstant();
        double result = network.elementMultiplySum(annoSet.GetCoAnnotationMatrix()) +
                MatrixUtils.sum(tempSum2) + networkSum * annoSet.GetConstant();
        return result;
    }
}
