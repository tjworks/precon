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
import java.util.Map;
import java.util.Vector;
import no.uib.cipr.matrix.DenseMatrix;
import org.genemania.engine.config.Config;
import org.genemania.util.NullProgressReporter;
import static junit.framework.Assert.*;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * 
 */
public class CoAnnotationSetTest {

    @BeforeClass
    public static void setUpClass() throws Exception {

        Config.reload("default_test_config.properties");
    }

    @AfterClass
    public static void tearDownClass() throws Exception {

        Config.reload();

    }
    /*
     * regression test on co-annotation set test
     */
    @Test
    public void testCalculateFastWeightSimple() throws Exception {

        Vector networks = new Vector();

        double[][] m1 = {
            {0.0000, 0.4260, 0.3984, 0.0630, 0.8370, 0.0328},
            {0.4260, 0.0000, 0.4590, 0.0056, 0.1190, 0.0000},
            {0.3984, 0.4590, 0.0000, 0.0161, 0.0636, 0.0232},
            {0.0630, 0.0056, 0.0161, 0.0000, 0.0684, 0.3256},
            {0.8370, 0.1190, 0.0636, 0.0684, 0.0000, 0.1610},
            {0.0328, 0.0000, 0.0232, 0.3256, 0.1610, 0.0000}};

        double[][] m2 = {{0.0000, 0.2679, 0.4095, 0.8272, 0.6402, 0.4400},
            {0.2679, 0.0000, 0.0371, 0.2769, 0.0682, 0.4355},
            {0.4095, 0.0371, 0.0000, 0.0600, 0.3724, 0.3700},
            {0.8272, 0.2769, 0.0600, 0.0000, 0.3944, 0.2520},
            {0.6402, 0.0682, 0.3724, 0.3944, 0, 0.0459},
            {0.4400, 0.4355, 0.3700, 0.2520, 0.0459, 0}};

        double[][] m3 = {{0, 0.7800, 0.1566, 0.0374, 0.4277, 0.8712},
            {0.7800, 0, 0.0028, 0.3888, 0.5000, 0.2346},
            {0.1566, 0.0028, 0, 0.0092, 0.1736, 0.1849},
            {0.0374, 0.3888, 0.0092, 0, 0.8740, 0.1155},
            {0.4277, 0.5000, 0.1736, 0.8740, 0, 0.0969},
            {0.8712, 0.2346, 0.1849, 0.1155, 0.0969, 0}};

        double[][] m4 = {{0, 0.3127, 0.3403, 0.2142, 0.5225, 0.1743},
            {0.3127, 0, 0.0315, 0.3332, 0.5978, 0.1782},
            {0.3403, 0.0315, 0, 0.0208, 0.0051, 0},
            {0.2142, 0.3332, 0.0208, 0, 0.0098, 0},
            {0.5225, 0.5978, 0.0051, 0.0098, 0, 0.0912},
            {0.1743, 0.1782, 0, 0, 0.0912, 0}};

        double[][] m5 = {{0, 0.3230, 0.1575, 0.0336, 0.5187, 0.6762},
            {0.3230, 0, 0.5508, 0.1584, 0.6336, 0.0376},
            {0.1575, 0.5508, 0, 0.1855, 0.1280, 0.1924},
            {0.0336, 0.1584, 0.1855, 0, 0.3363, 0.0855},
            {0.5187, 0.6336, 0.1280, 0.3363, 0, 0.1950},
            {0.6762, 0.0376, 0.1924, 0.0855, 0.1950, 0}};
        Map<Integer, Integer> IndexToNetworkIdMap = new HashMap<Integer, Integer>();
        IndexToNetworkIdMap.put(0, 0);
        IndexToNetworkIdMap.put(1, 1);
        IndexToNetworkIdMap.put(2, 2);
        IndexToNetworkIdMap.put(3, 3);
        IndexToNetworkIdMap.put(4, 4);
        networks.add(new DenseMatrix(m1));
        networks.add(new DenseMatrix(m2));
        networks.add(new DenseMatrix(m3));
        networks.add(new DenseMatrix(m4));
        networks.add(new DenseMatrix(m5));

        double[][] label = {
            {1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0},
            {1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1},
            {1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1},
            {1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0},
            {0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1},
            {1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0}};

        DenseMatrix labels = new DenseMatrix(label);
        DenseMatrix KtK = new DenseMatrix(networks.size() + 1, networks.size() + 1);
        DenseMatrix Ktt = new DenseMatrix(networks.size() + 1, 1);
        //CoAnnotationSet temp = CalculateFastWeights.FastCoAnnotation(labels);
        CoAnnotationSet temp = CalculateFastWeights.simpleComputeCoAnnoationSet(labels);

        System.out.println("temp.constant: " + temp.GetConstant());
        System.out.println("BHalf: " + temp.GetBHalf());
        System.out.println("coann: " + temp.GetCoAnnotationMatrix());

        //naive(labels);
        
        Map<Integer, Double> weightMap = CalculateFastWeights.CalculateWeights(labels, networks, KtK, Ktt, temp, IndexToNetworkIdMap, NullProgressReporter.instance());

        assertEquals(2, weightMap.size());
        assertEquals(0.25725, weightMap.get(1), 0.00001d);
        assertEquals(0.29793, weightMap.get(4), 0.00001d);

        weightMap = Solver.solve(KtK,
                MatrixUtils.extractColumnToVector(Ktt, 0), IndexToNetworkIdMap, NullProgressReporter.instance());

        assertEquals(2, weightMap.size());
        assertEquals(0.25725, weightMap.get(1), 0.00001d);
        assertEquals(0.29793, weightMap.get(4), 0.00001d);
    }



}
