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

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.genemania.engine.core.integration.calculators;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Vector;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.MatrixUtils;
import org.genemania.engine.core.integration.CombineNetworksOnly;
import org.genemania.engine.core.integration.Solver;
import org.genemania.engine.exception.CancellationException;
import org.genemania.engine.exception.WeightingFailedException;
import org.genemania.engine.matricks.Matrix;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * the original automatic weighting, based on given label vector
 */
public class AutomaticCalculator extends AbstractNetworkWeightCalculator {
    private static Logger logger = Logger.getLogger(AutomaticCalculator.class);

    public AutomaticCalculator(DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(cache, networkIds, organismId, label, progress);
    }

    public AutomaticCalculator(String namespace, DataCache cache, Collection<Collection<Long>> networkIds, int organismId, Vector label, ProgressReporter progress) throws ApplicationException {
        super(namespace, cache, networkIds, organismId, label, progress);
    }
    
    public void process() throws ApplicationException {
            List<Long> networks = new ArrayList<Long>();
            int i = 0;
            for (Collection<Long> group: networkIds) {
                for (long id: group) {
                    networks.add(id);
                    IndexToNetworkIdMap.put(i, id);
                    i++;
                }
            }

            progress.setStatus(Constants.PROGRESS_WEIGHTING_MESSAGE);
            progress.setProgress(Constants.PROGRESS_WEIGHTING);
            // TODO: can move the code in Automatic to this class
            try {
                weights = automatic(networks, namespace, organismId, cache, label, IndexToNetworkIdMap, progress);
            }
            catch (WeightingFailedException e) {
                logger.error("weighting calculation failed, falling back to average: " + e.getMessage());
                weights = AverageByNetworkCalculator.average(IndexToNetworkIdMap);
            }
            progress.setStatus(Constants.PROGRESS_COMBINING_MESSAGE);
            progress.setProgress(Constants.PROGRESS_COMBINING);
            combinedMatrix = CombineNetworksOnly.combine(weights, namespace, organismId, cache, progress);
    }
    
    public static double EPSILON = Math.pow(2, -52);
    public static double DELTA = 1E-6; // for comparisons: TODO: rethink

    //public static Map<Integer, Double> automatic(List<Integer> networks, int organismId, InteractionNetworkCache cache, Vector labels, Map<Integer, Integer> IndexToNetworkIdMap) throws Exception {
    public static Map<Long, Double> automatic(List<Long> networks, String namespace, 
            int organismId, DataCache cache, Vector labels,
            Map<Integer, Long> IndexToNetworkIdMap, ProgressReporter progress) throws ApplicationException {

        // labels must be in {-1,0,1}. TODO: add check

        logger.debug("building system to solve for weights");
        int[] ixPos = MatrixUtils.find(labels, 1d);
        int[] ixNeg = MatrixUtils.find(labels, -1d);
//        int[] ixPos = labels.findIndexesOf(1d);
//        int[] ixNeg = labels.findIndexesOf(-1d);

        int numPos = ixPos.length;
        int numNeg = ixNeg.length;

        int numNetworks = networks.size(); // MM
        int numNodes = labels.size();      // NN

        // allocated space includes an extra (bias) network
        DenseMatrix KtK = new DenseMatrix(numNetworks + 1, numNetworks + 1);
        DenseVector KtT = new DenseVector(numNetworks + 1);
        //Matrix KtK = Config.instance().getMatrixFactory().denseMatrix(numNetworks+1, numNetworks+1);
        //Vector KtT = Config.instance().getMatrixFactory().denseVector(numNetworks+1);

        double posConst = 2d * numNeg / (numPos + numNeg);
        double negConst = -2d * numPos / (numPos + numNeg);

        int numPosPos = numPos * (numPos - 1);
        int numPosNeg = 2 * numPos * numNeg;

        double posPosTarget = posConst * posConst;
        double posNegTarget = posConst * negConst;

        double biasVal = 1d / (numPosPos + numPosNeg);

        KtT.set(0, biasVal * (posPosTarget * numPosPos + posNegTarget * numPosNeg));
        KtK.set(0, 0, biasVal);

        SymMatrix[] Wpp = new SymMatrix[numNetworks];
        Matrix[] Wpn = new Matrix[numNetworks];

        for (int ii = 0; ii < numNetworks; ii++) {
            SymMatrix network = cache.getNetwork(namespace, organismId, networks.get(ii)).getData();

            //Matrix subNetwork = new FlexColFloatMatrix(network, ixPos, ixPos);
//            Matrix subNetwork = Config.instance().getMatrixFactory().sparseSubMatrix(network, ixPos, ixPos);
            Wpp[ii] = network.subMatrix(ixPos);
            //Wpp[ii] = subNetwork;
            
            //subNetwork = new FlexColFloatMatrix(network, ixPos, ixNeg);
//            subNetwork = Config.instance().getMatrixFactory().sparseSubMatrix(network, ixPos, ixNeg);
            Wpn[ii] = network.subMatrix(ixPos, ixNeg);
//            Wpn[ii] = subNetwork;
            
            double ssWpp = Wpp[ii].elementSum();
            double ssWpn = Wpn[ii].elementSum();

            KtT.set(ii + 1, posPosTarget * ssWpp + 2d * posNegTarget * ssWpn);
            KtK.set(ii + 1, 0, biasVal * (ssWpp + 2 * ssWpn));
            KtK.set(0, ii + 1, KtK.get(ii + 1, 0));

            for (int jj = 0; jj <= ii; jj++) {

                if (progress.isCanceled()) {
                    throw new CancellationException();
                }

                double sumOfProds = 0;

                sumOfProds += Wpp[ii].elementMultiplySum(Wpp[jj]);
                sumOfProds += 2 * Wpn[ii].elementMultiplySum(Wpn[jj]);

                KtK.set(ii + 1, jj + 1, sumOfProds);
                KtK.set(jj + 1, ii + 1, sumOfProds);
            }

        }

        return Solver.solve(KtK, KtT, IndexToNetworkIdMap, progress);
        //throw new RuntimeException("solver call not implemented"); // TODO: fix!
    }
}
