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

package org.genemania.engine.core.utils;

import java.util.Map;
import org.genemania.engine.matricks.Vector;
import org.genemania.engine.matricks.MatricksException;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.engine.matricks.VectorCursor;

/**
 * Network normalization related utilities
 */
public class Normalization {

    /*
     * normalize a symmetric interaction network containing only
     * +ve weights by dividing each value by the sqrt of the product
     * of the row/col sums.
     */
    public static void normalizeNetwork(SymMatrix m) throws MatricksException {
        Vector sums = m.columnSums();
        VectorCursor cursor = sums.cursor();
        while (cursor.next()) {
            double val = cursor.val();
            if (val > 0.0d) {
                cursor.set(Math.sqrt(val));
            }
            else {
                cursor.set(1d);
            }
        }

        m.dotDivOuterProd(sums);
    }
    
    /*
     * divide each network weight by sum of weights. wouldn't it have been simpler
     * if we'd stuck with the math-vectors instead of these maps?
     */
    public static void normalizeWeights(Map<Long, Double> networkidToWeightMap) {

        double sum = 0;

        for (Long id: networkidToWeightMap.keySet()) {
            double weight = networkidToWeightMap.get(id);
            sum += weight;
        }

        for (Long id: networkidToWeightMap.keySet()) {
            double weight = networkidToWeightMap.get(id);
            weight = weight / sum;
            networkidToWeightMap.put(id, weight);
        }
    }
}
