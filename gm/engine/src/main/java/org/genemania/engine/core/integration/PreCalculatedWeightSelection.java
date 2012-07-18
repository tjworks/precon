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

import no.uib.cipr.matrix.DenseVector;
import org.apache.log4j.Logger;

import org.genemania.exception.ApplicationException;

import no.uib.cipr.matrix.Vector;
import org.genemania.engine.Constants;
import org.genemania.engine.core.data.CombinedNetwork;
import org.genemania.engine.matricks.SymMatrix;

public class PreCalculatedWeightSelection {

    private static Logger logger = Logger.getLogger(PreCalculatedWeightSelection.class);

    public static int selectBranch(CombinedNetwork[] combinedMatrices, Vector label) throws ApplicationException {
        logger.info("Selecting weights");
        int pos = 0;
        int neg = 0;
        int zero = 0;
        for (int i = 0; i < label.size(); i++) {
            if (label.get(i) == 1d) {
                pos++;
            }
            if (label.get(i) == -1d) {
                neg++;
            }
            if (label.get(i) == 0d) {
                zero++;
            }
        }
        logger.info("Number of +/- and 0 " + pos + " " + neg + " " + zero);
        double dotProduct = Double.NEGATIVE_INFINITY;
        int selected = -1;
        for (int branch = 0; branch < Constants.goBranches.length; branch++) {
            Double temp1 = elementMultForKTA(combinedMatrices[branch].getData(), label);

            double wtwValue = combinedMatrices[branch].getWtW();
            logger.info("WtW is " + wtwValue);

            double tempDotProduct = temp1 / wtwValue;

            if (tempDotProduct > dotProduct) {
                dotProduct = tempDotProduct;
                selected = branch;
            }

            logger.info(Constants.goBranches[branch] + "'s KTA is " + tempDotProduct);
        }
        
        // seems to happen in degenerate case, empty network. TODO: add test case & verify
        if (selected == -1) {
            throw new ApplicationException("Failed to select branch");
        }
        
        logger.info(Constants.goBranches[selected] + " selected");
        return selected;
    }

    protected static double elementMultForKTA(SymMatrix weight, Vector label) {
 
        return weight.sumDotMultOuterProd(((DenseVector) label).getData());

        /* TODO: can eliminate this method and just call sumDotLongNamesAreAnnoying() after
         * verifying things work. the casting needs to be cleaned out as well. original code below
         *
        double sum = 0d;



        logger.info("starting sum is: " + sum);
        int i = 0;
        for (MatrixEntry a: weight) {
            sum += a.get() * label.get(a.row()) * label.get(a.column());
//			logger.info("current sum is: "+sum+" label values are: "+ label.get(a.row())+" "+label.get(a.column())+" weight is: "+a.get());
            i++;
        }
        logger.info("final sum is " + sum + " number of entries is " + i);
        return sum;
         *
         * 
         */
    }
}
