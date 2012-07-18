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

import no.uib.cipr.matrix.Vector;

import no.uib.cipr.matrix.DenseMatrix;
//import no.uib.cipr.matrix.Matrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.sparse.FlexCompColMatrix;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.data.CoAnnotationSet;
import org.genemania.engine.matricks.Matrix;
import org.genemania.engine.matricks.SymMatrix;

/**
 * Various methods to construct and alter precomputed gram matrices
 * during run time. 
 * 
 * Includes methods for adding and removing networks.
 * 
 * AddNetwork uses the Simultaneous Weighting method to calculate the gram Matrix and will recompute Ktt as well.
 * 
 * SetGramBias and PartialGram uses the unregularized GeneMania algorithm
 * 
 * TODO: make addnetwork method for unregularized GeneMania and remove duplicate code between
 * AddNetwork and calculateFastWeights. 
 * 
 * @author Quentin Shao
 *
 */
public class MakeKtK2 {

    public static DenseMatrix SetGramBias(int numNetworks, int numberOfLabels) {
        double biasVal = 1d / (numberOfLabels * (numberOfLabels - 1));
        DenseMatrix KtK = new DenseMatrix(numNetworks + 1, numNetworks + 1);
        KtK.set(0, 0, biasVal);
        return KtK;
    }

    public static DenseMatrix AddNetwork(DenseMatrix KtKIn, DenseMatrix KtKOut, Vector KttIn, Vector KttOut, CoAnnotationSet set, List<Matrix> completeListOfNetworks, Map<Integer, Integer> networkIdToColumnIdMap) {
        throw new RuntimeException("not implemented");
        //        DenseMatrix temp = new DenseMatrix(completeListOfNetworks.size() + 1, completeListOfNetworks.size() + 1);
//        for (int i = 0; i < KtKIn.numRows(); i++) {
//            KttOut.set(i, KttIn.get(i));
//            for (int j = i; j < KtKIn.numColumns(); j++) {
//                KtKOut.set(i, j, KtKIn.get(i, j));
//                KtKOut.set(j, i, KtKIn.get(j, i));
//            }
//        }
//        int numCategories = (int) KtKIn.get(0, 0) / (int) completeListOfNetworks.get(0).numCols() / (int) completeListOfNetworks.get(0).numCols();
//        DenseVector Bhalf = set.GetBHalf();
//        SymMatrix CoAnn = set.GetCoAnnotationMatrix();
//        double Constant = set.GetConstant();
//        FlexCompColMatrix tempSum = new FlexCompColMatrix(1, CoAnn.numCols());
//        for (int i = KtKIn.numRows() - 1; i < completeListOfNetworks.size(); i++) {
//            KtKOut.set(i + 1, 0, MatrixUtils.elementMultiplySum(completeListOfNetworks.get(i), completeListOfNetworks.get(i)) * numCategories);
//            KtKOut.set(0, i + 1, KtKOut.get(i + 1, 0));
//            double networkSum = MatrixUtils.sum(completeListOfNetworks.get(i));
//
//            Bhalf.transAmult(completeListOfNetworks.get(i), tempSum);
//            KttOut.set(i + 1, MatrixUtils.elementMultiplySum(completeListOfNetworks.get(i), CoAnn) +
//                    MatrixUtils.sum(tempSum) + networkSum * Constant);
//            for (int j = 0; j < KtKIn.numRows(); j++) {
//                KtKOut.set(i + 1, j + 1, MatrixUtils.elementMultiplySum(completeListOfNetworks.get(i), completeListOfNetworks.get(j)) * numCategories);
////			System.out.println("Network: "+i+" and "+j+"value: "+ MatrixUtils.elementMultiplySum(Networks.get(i),Networks.get(j))*constant);
//                KtKOut.set(j + 1, i + 1, KtKOut.get(i + 1, j + 1));
//            }
//        }
//        return KtKOut;
    }

    public static DenseMatrix RemoveNetwork(DenseMatrix KtK, List<Integer> sortedIndexOfNetworksToKeep) {
        DenseMatrix temp = new DenseMatrix(sortedIndexOfNetworksToKeep.size() + 1, sortedIndexOfNetworksToKeep.size() + 1);
        temp.set(0, 0, KtK.get(0, 0));
        for (int i = 0; i < sortedIndexOfNetworksToKeep.size(); i++) {
            temp.set(i + 1, 0, KtK.get(sortedIndexOfNetworksToKeep.get(i) + 1, 0));
            temp.set(0, i + 1, temp.get(i + 1, 0));
            for (int j = i; j < sortedIndexOfNetworksToKeep.size(); j++) {
                temp.set(i + 1, j + 1, KtK.get(sortedIndexOfNetworksToKeep.get(i) + 1, sortedIndexOfNetworksToKeep.get(j) + 1));
                temp.set(j + 1, i + 1, temp.get(i + 1, j + 1));
            }
        }

        return temp;
    }

    public static DenseMatrix PartialGram(DenseMatrix KtK, SymMatrix network0, SymMatrix network1, int networkNum0, int networkNum1) {

        Matrix[] Wpppnnn = new Matrix[2];
        double biasVal = KtK.get(0, 0);

//        Wpppnnn[0] = new FlexCompColMatrix(network0);
//        MatrixUtils.setDiagonalZero(Wpppnnn[0]);
//        double ssWpppnnn = MatrixUtils.sum(Wpppnnn[0]);
        double ssWpppnnn = network0.elementSum();
        KtK.set(networkNum0 + 1, 0, biasVal * (ssWpppnnn));
        KtK.set(0, networkNum0 + 1, biasVal * (ssWpppnnn));

//        Wpppnnn[1] = new FlexCompColMatrix(network1);
//        MatrixUtils.setDiagonalZero(Wpppnnn[1]);
        double sumOfProds = 0;
//        sumOfProds += MatrixUtils.elementMultiplySum(Wpppnnn[0], Wpppnnn[1]);
        sumOfProds = network0.elementMultiplySum(network1);
        KtK.set(networkNum0 + 1, networkNum1 + 1, sumOfProds);
        KtK.set(networkNum1 + 1, networkNum0 + 1, sumOfProds);

        return KtK;

    }
}
