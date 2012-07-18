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


package org.genemania.engine.core.data;

import java.util.Map;
import org.genemania.engine.matricks.SymMatrix;

/**
 * a precombined network key'd by a combining method
 * and list of input networks.
 *
 * the corresponding weight
 * values used to generate the network are also stored
 * here, as is the vectorized dot-product of the
 * combined network with itself (WtW)
 *
 * note the weightmap may not store the ids of zero-weighted networks.
 */
public class CombinedNetwork extends Data {
    private String methodParamKey;
    private Map<Long, Double> weightMap;
    private SymMatrix data;
    private double WtW;

    public CombinedNetwork(String namespace, long organismId, String methodParamKey) {
        super(namespace, organismId);
        this.methodParamKey = methodParamKey;
    }
    
    @Override
    public String [] getKey() {
        return new String [] {getNamespace(), "" + getOrganismId(), "COMBINED",
            methodParamKey };
    }
    
    /**
     * @return the weightMap
     */
    public Map<Long, Double> getWeightMap() {
        return weightMap;
    }

    /**
     * @param weightMap the weightMap to set
     */
    public void setWeightMap(Map<Long, Double> weightMap) {
        this.weightMap = weightMap;
    }

    /**
     * @return the data
     */
    public SymMatrix getData() {
        return data;
    }

    /**
     * @param data the data to set
     */
    public void setData(SymMatrix data) {
        this.data = data;
    }

    /**
     * @return the WtW
     */
    public double getWtW() {
        return WtW;
    }

    /**
     * @param WtW the WtW to set
     */
    public void setWtW(double WtW) {
        this.WtW = WtW;
    }

}
