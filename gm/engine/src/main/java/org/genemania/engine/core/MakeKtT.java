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

import java.util.List;
import no.uib.cipr.matrix.DenseMatrix;

/**
 * 
 * Class for methods for KtT calculation
 * 
 * @author Quentin Shao
 *
 */
public class MakeKtT {

    static public DenseMatrix RemoveNetwork(DenseMatrix KtT, List<Integer> sortedIndexOfNetworksToKeep) {
        DenseMatrix temp = new DenseMatrix(sortedIndexOfNetworksToKeep.size() + 1, 1);
        temp.set(0, 0, KtT.get(0, 0));
        for (int i = 0; i < sortedIndexOfNetworksToKeep.size(); i++) {
            temp.set(i + 1, 0, KtT.get(sortedIndexOfNetworksToKeep.get(i) + 1, 0));
        }
        return temp;
    }
}
