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
 * Averages weights based on how many networks in the same group 
 * are selected.
 * 
 * networks are not loaded
 */
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.genemania.exception.ApplicationException;

public class AverageCategory {

    protected static Map<Integer, Double> averageCategory(Collection<Collection<Integer>> networkIds) throws ApplicationException {
        Map<Integer, Double> matrixToWeightMap = new HashMap<Integer, Double>();
        int num_of_groups = 0; //TODO: add check for empty categories
        List<Integer> networksId = new ArrayList();
        for (Collection<Integer> group: networkIds) {

            for (int id: group) {
                matrixToWeightMap.put(id, 1 / (double) group.size() / (double) networkIds.size());
            }
        }


        return matrixToWeightMap;
    }
}

