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
import org.apache.log4j.Logger;
import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrices;
import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.MatrixEntry;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;
import org.genemania.engine.exception.CancellationException;
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
public class CalculateFastWeights {

    public static Logger logger = Logger.getLogger(CalculateFastWeights.class);
    private static double EPSILON = Math.pow(2, -52);
    //used to avoid coannotation matrix having more non zero values than integers allow.
    public static final int MAX_VECTOR_LENGTH = 500000;
    private static double DELTA = 1E-6; // for comparisons: TODO: rethink

    public static Map<Integer, Double> CalculateWeights(Matrix Labels, List<Matrix> networks,
            DenseMatrix KtK, DenseMatrix Ktt, CoAnnotationSet annoSet,
            Map<Integer, Integer> IndexToNetworkIdMap, ProgressReporter progress) throws Exception {

        int numberOfCategories = Labels.numColumns();
        int numberOfGenes = Labels.numRows();

        computeBasicKtK(networks, KtK, numberOfGenes, progress);
        KtK.scale(numberOfCategories);
        //DenseMatrix tmpKtK = KtK.copy();
        //tmpKtK.scale(numberOfCategories);
        computeKtT(Labels, networks, Ktt, annoSet, progress);
        //return SolveForWeights(tmpKtK, Ktt, IndexToNetworkIdMap);
        return SolveForWeights(KtK, Ktt, IndexToNetworkIdMap, progress);

    }

    /*
     * simple, direct KtK computation factored out of CalculateWeights, TODO remove
     * code duplication there.
     */
    public static void computeBasicKtK(List<Matrix> networks, DenseMatrix KtK, int numGenes, ProgressReporter progress) throws ApplicationException {

        KtK.set(0, 0, numGenes*numGenes);
        for (int i = 0; i < networks.size(); i++) {
            logger.info("Currently Processing the " + i + "th network");

            double networkSum = MatrixUtils.sum(networks.get(i));
            KtK.set(i + 1, 0, networkSum);
            KtK.set(0, i + 1, networkSum);

            for (int j = 0; j <= i; j++) {
                if (progress.isCanceled()) {
                    throw new CancellationException();
                }
                
                double prodSum = MatrixUtils.elementMultiplySum(networks.get(i), networks.get(j));
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
    public static void computeKtT(Matrix Labels, List<Matrix> networks, DenseMatrix Ktt, 
            CoAnnotationSet annoSet, ProgressReporter progress) throws ApplicationException {
        int numberOfCategories = Labels.numColumns();
        int numberOfGenes = Labels.numRows();
        Matrix CoAnnotationMatrix = annoSet.GetCoAnnotationMatrix();
        Matrix BHalf = annoSet.GetBHalf();

        double constant = annoSet.GetConstant();
        MatrixUtils.setDiagonalZero(CoAnnotationMatrix);
        logger.info("CoAnnotation with diagonal values removed: " + MatrixUtils.sum(CoAnnotationMatrix));
        Vector Ni = MatrixUtils.rowSums(CoAnnotationMatrix);
        logger.info("Number of Genes " + numberOfGenes + ", Number of Categories " + numberOfCategories);
        double biasValue = (double) numberOfGenes * (double) numberOfGenes * (double) numberOfCategories;
        logger.info("biasValue: " + biasValue);

        Ktt.set(0, 0, MatrixUtils.sum(BHalf) * numberOfGenes + MatrixUtils.sum(CoAnnotationMatrix) + constant * numberOfGenes * numberOfGenes);
        Matrix tempSum2 = null;

        logger.info("Ktt bias value is " + Ktt.get(0, 0));
        for (int i = 0; i < networks.size(); i++) {

            if (progress.isCanceled()) {
                throw new CancellationException();
            }
            
            logger.info("Currently Processing the " + i + "th network");
            double networkSum = MatrixUtils.sum(networks.get(i));

            //BHalf.transAmult(networks.get(i), tempSum);

            tempSum2 = new FlexCompColMatrix(1, numberOfGenes);
            for (MatrixEntry e: networks.get(i)) {
                tempSum2.set(0, e.column(), tempSum2.get(0, e.column()) + e.get() * (BHalf.get(e.row(), 0)));
            }

            Ktt.set(i + 1, 0, MatrixUtils.elementMultiplySum(networks.get(i), CoAnnotationMatrix) +
                    MatrixUtils.sum(tempSum2) + networkSum * constant);

        }
    }

    public static Map<Integer, Double> SolveForWeights(DenseMatrix KtK, DenseMatrix Ktt, Map<Integer, Integer> IndexToNetworkIdMap, ProgressReporter progress) throws Exception {
        return Solver.solve(KtK, MatrixUtils.extractColumnToVector(Ktt, 0), IndexToNetworkIdMap, progress);
    }
    
    protected static Matrix AllPairs(int N) {
        Matrix P = new FlexCompColMatrix((N * (N - 1) / 2), 2);
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

    protected static Matrix ListToN(int N) {
        Matrix temp = new FlexCompColMatrix(N, 1);
        for (int i = 0; i < N; i++) {
            temp.set(i, 0, i);
        }
        return temp;
    }

    public static CoAnnotationSet FastCoAnnotation(Matrix Labels) {
        int numberOfCategories = Labels.numColumns();
        int numberOfGenes = Labels.numRows();
        int N2 = numberOfGenes * numberOfGenes;
        Vector sizes = MatrixUtils.columnSums(Labels);
        double maxSizes = 0;
        for (int i = 0; i < sizes.size(); i++) {
            double temp = sizes.get(i);
            if (temp > maxSizes) {
                maxSizes = temp;

            }
        }


        Map<Integer, Matrix> cache = new HashMap<Integer, Matrix>();
        Map<Integer, Matrix> cachePN = new HashMap<Integer, Matrix>();
        double VectorLength = 0;
        double VectorLengthPN = 0;
        for (int i = 0; i < sizes.size(); i++) {
            VectorLength = VectorLength + (double) sizes.get(i) * ((double) sizes.get(i) - 1) / 2;
//			System.out.println("Current Vector Length "+ VectorLength + "Current Size " + sizes.get(i));
            VectorLengthPN = VectorLengthPN + sizes.get(i);

        }
        int vLength = (int) VectorLength;
        int width = vLength / MAX_VECTOR_LENGTH + 1;
//		System.out.println(width);
        Matrix rows = new FlexCompColMatrix(width, MAX_VECTOR_LENGTH);
        Matrix cols = new FlexCompColMatrix(width, MAX_VECTOR_LENGTH);
        Matrix vals = new FlexCompColMatrix(width, MAX_VECTOR_LENGTH);
//		System.out.println(VectorLength);
        int vLengthPN = (int) VectorLength;
//		System.out.println(VectorLengthPN);
        int widthPN = vLengthPN / 500000 + 1;
        Matrix rowsPN = new FlexCompColMatrix(widthPN, MAX_VECTOR_LENGTH);
        Matrix colsPN = new FlexCompColMatrix(widthPN, MAX_VECTOR_LENGTH);
        Matrix valsPN = new FlexCompColMatrix(widthPN, MAX_VECTOR_LENGTH);

        int offset = 0;
        int offsetPN = 0;
        double constant = 0;
        int k = 0;
        int l = 0;
        int m = 0;
        int n = 0;
        int o = 0;
        for (int i = 0; i < sizes.size(); i++) {
            if (sizes.get(i) > 0) {
                int nn = (int) sizes.get(i);
                if (!(cache.containsKey(nn))) {
                    cache.put(nn, AllPairs(nn));
                }
                if (!(cachePN.containsKey(nn))) {
                    cachePN.put(nn, ListToN(nn));
                }
                Matrix pp = (FlexCompColMatrix) cache.get(nn);
                Matrix pn = (FlexCompColMatrix) cachePN.get(nn);
                int len = pp.numRows();
                int lenPN = pn.numRows();
                Vector tempVector = MatrixUtils.extractColumnToVector(Labels, i);
//				System.out.println(tempVector.toString());
                Vector rowIndicies = MatrixUtils.findAllNoneZero(tempVector);
//				System.out.println("rowIndicies "+ rowIndicies.toString());
                k = 0;
                for (int j = offset; j < (offset + len); j++) {

//					System.out.println(offset+"   "+ j +"   "+ (offset+len)+"   "+rowIndicies.size()+"   "+i);

                    rows.set(m, l, rowIndicies.get((int) pp.get(k, 0)));
//					System.out.println("row set "+ rowIndicies.get((int)pp.get(k,0)));
                    cols.set(m, l, rowIndicies.get((int) pp.get(k, 1)));
                    vals.set(m, l, 1);
                    k++;
                    l++;
                    if (l == (MAX_VECTOR_LENGTH)) {
                        l = 0;
                        m++;
                    }
                }

                k = 0;
                for (int j = offsetPN; j < (offsetPN + lenPN); j++) {

                    rowsPN.set(o, n, rowIndicies.get((int) pn.get(k, 0)));
                    valsPN.set(o, n, (-2d) * (double) nn / (double) numberOfGenes);
                    k++;
                    n++;
                    if (n == (MAX_VECTOR_LENGTH)) {
                        n = 0;
                        o++;
                    }
                }
                offset = offset + len;
                offsetPN = offsetPN + lenPN;
                constant = constant + (double) (nn * nn) / (double) (N2);

                if (i % 100 == 0) {
                    System.out.print(".");
                }

            }
        }
        System.out.println("");
        logger.info("done length");
        Matrix temp = new FlexCompColMatrix(numberOfGenes, numberOfGenes);
        l = 0;
        m = 0;
        for (int i = 0; i < VectorLength; i++) {
            if (temp.get((int) rows.get(m, l), (int) cols.get(m, l)) == 0) {
                temp.set((int) rows.get(m, l), (int) cols.get(m, l), vals.get(m, l));
            }
            else {
                temp.set((int) rows.get(m, l), (int) cols.get(m, l), temp.get((int) rows.get(m, l), (int) cols.get(m, l)) + vals.get(m, l));
            }
            l++;
            if (l == (MAX_VECTOR_LENGTH)) {
                l = 0;
                m++;
            }
        }

        Matrix CoAnn = new FlexCompColMatrix(numberOfGenes, numberOfGenes);
        for (MatrixEntry e: temp) {
            CoAnn.set(e.row(), e.column(), e.get());
            CoAnn.set(e.column(), e.row(), e.get());
        }
        /*for (int i=0;i<numberOfGenes;i++){

        for(int j=i;j<numberOfGenes;j++){
        if(temp.get(i, j) !=0 || temp.get(j, i)!=0){
        CoAnn.set(i,j,temp.get(i,j)+temp.get(j, i));
        CoAnn.set(j,i,CoAnn.get(i, j));

        }
        }
        }*/
        logger.info("done lowerhalf the total amount of CoAnnoations are: " + MatrixUtils.sum(CoAnn));
        temp = new FlexCompColMatrix(numberOfGenes, 1);
        n = 0;
        o = 0;
        for (int i = 0; i < VectorLengthPN; i++) {
            if (temp.get((int) rowsPN.get(o, n), 0) == 0) {
                temp.set((int) rowsPN.get(o, n), 0, valsPN.get(o, n));
            }
            else {
                temp.set((int) rowsPN.get(o, n), 0, temp.get((int) rowsPN.get(o, n), 0) + valsPN.get(o, n));
            }
            n++;
            if (n == (MAX_VECTOR_LENGTH)) {
                n = 0;
                o++;
            }
        }
        Matrix BHalf = temp;

//		System.out.println(rows.toString());
//		System.out.println(cols.toString());
        logger.info("done BHalf, sum is: " + MatrixUtils.sum(BHalf));
        logger.info("constant is : " + constant);
        CoAnnotationSet result = new CoAnnotationSet(CoAnn, BHalf, constant);
        return result;
    }

    /*
     * a simplified, straightforward implementation of the computing
     * the data structures required in simltaneous weights combining,
     * for comparative testing against current version. should produce the
     * same result as FastCoAnnotation().
     */
    public static CoAnnotationSet simpleComputeCoAnnoationSet(Matrix labels) {

        int numGenes = labels.numRows();
        int numCategories = labels.numColumns();

        Vector ratios = simpleComputeSumPosRatios(numGenes, labels);
        double constant = simpleComputeConstant(numGenes, ratios);
        logger.info("constant: " + constant);

        Matrix yHat = simpleComputeYHat(numGenes, ratios, labels);
        logger.info("computed YHat");

        Matrix AHat = simpleComputeAHatLessMem(numGenes, numCategories, labels);
        logger.info("computed AHat");

        CoAnnotationSet cas = new CoAnnotationSet(AHat, yHat, constant);

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
    public static Matrix simpleComputeYHat(int numGenes, no.uib.cipr.matrix.Vector ratios, Matrix labels) {
        Matrix yHat = new DenseMatrix(numGenes, 1);

        no.uib.cipr.matrix.Vector yHatTemp = new DenseVector(numGenes);

        labels.multAdd(ratios, yHatTemp);

        yHatTemp.scale(-2d);

        // copy into a matrix, don't know how to convert the vector
        for (int i=0; i<numGenes; i++) {
            yHat.set(i, 0, yHatTemp.get(i));
        }

        return yHat;
    }

    /*
     * compute:
     *
     *   \hat{A} = \sum_{c} A_c
     * 
     */
    public static Matrix simpleComputeAHat(int numGenes, int numCategories, Matrix labels) {

        Matrix AHat = new FlexCompColMatrix(numGenes, numGenes);

        int [] rows = new int[numGenes];
        for(int i=0; i<rows.length; i++) {
            rows[i] = i;
        }

        for (int c=0; c<numCategories; c++) {
            logger.debug("processing category " + c);
            int [] cols = {c};

            Matrix yc = Matrices.getSubMatrix(labels, rows, cols);

            // note we could avoid materializing Ac by looping
            // over yc instead, a bit more code but less memory usage
            Matrix Ac = new FlexCompColMatrix(numGenes, numGenes);

            yc.transBmultAdd(1d, yc, Ac);

            // clear diagonal
            for (int i=0; i<numGenes; i++) {
                Ac.set(i, i, 0d);
            }

            AHat.add(Ac);
        }

        return AHat;
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
    public static Matrix simpleComputeAHatLessMem(int numGenes, int numCategories, Matrix labels) {

        Matrix AHat = new FlexCompColMatrix(numGenes, numGenes);

        int [] rows = new int[numGenes];
        for(int i=0; i<rows.length; i++) {
            rows[i] = i;
        }


        for (int c=0; c<numCategories; c++) {
            logger.debug("processing category " + c);
            int [] cols = {c};

            Matrix yc = MatrixUtils.getSubMatrix(labels, rows, cols);

            for (MatrixEntry e1: yc) {
                for (MatrixEntry e2: yc) {
                    double z = e1.get() * e2.get();
                    if (z != 0d) {
                        int i = e1.row();
                        int j = e2.row();
                        if (i != j) {
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
    public static Vector simpleComputeSumPosRatios(int numGenes, Matrix labels) {
        Vector ratios = MatrixUtils.columnSums(labels);
        ratios.scale(1d/numGenes);
        return ratios;
    }

    /*
     * compute KtT(0)
     */
    public static double simpleComputeKtT0(CoAnnotationSet annoSet, int numGenes) {
        double result = MatrixUtils.sum(annoSet.GetBHalf()) * numGenes + MatrixUtils.sum(annoSet.GetCoAnnotationMatrix()) + annoSet.GetConstant() * numGenes * numGenes;
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
        Matrix tempSum2 = new FlexCompColMatrix(1, numGenes);

        // isn't the next loop equivalent to:
        // annoSet.GetBHalf().transAmult(network, tempSum2);
        for (MatrixEntry e: network) {
            tempSum2.set(0, e.column(), tempSum2.get(0, e.column()) + e.get() * (annoSet.GetBHalf().get(e.row(), 0)));
        }

        double result = MatrixUtils.elementMultiplySum(network, annoSet.GetCoAnnotationMatrix()) +
                MatrixUtils.sum(tempSum2) + networkSum * annoSet.GetConstant();
        return result;
    }
}
