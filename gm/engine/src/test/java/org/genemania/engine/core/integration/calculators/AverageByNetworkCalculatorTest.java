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

package org.genemania.engine.core.integration.calculators;

import org.genemania.engine.core.integration.calculators.AverageByNetworkCalculator;
import java.lang.Integer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.genemania.engine.cache.NetworkMemCache;
import org.genemania.engine.cache.RandomDataCacheBuilder;
import org.genemania.engine.core.integration.INetworkWeightCalculator;
import org.genemania.util.NullProgressReporter;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 */
public class AverageByNetworkCalculatorTest {

    static RandomDataCacheBuilder cacheBuilder = new RandomDataCacheBuilder(7132);
    // params for test organism
    static int org1Id = 1;
    static int org1numGenes = 50;
    static int org1numNetworks = 10;
    static double org1networkSparsity = .5;
    static int numCategories = 20;
    static double org1AnnotationSparsity = .5;

    static long[] org1networkIds;

    @BeforeClass
    public static void setUpClass() throws Exception {
        cacheBuilder.setUp();

        // random organism 1
        org1networkIds = cacheBuilder.addOrganism(org1Id, org1numGenes, org1numNetworks,
                org1networkSparsity, numCategories, org1AnnotationSparsity);

        // clear mem cache since its a singleton process wide, don't want stuff left over from other tests
        NetworkMemCache.instance().clear();
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
        cacheBuilder.tearDown();

    }

    public AverageByNetworkCalculatorTest() {
    }

    @Before
    public void setUp() {
    }

    @After
    public void tearDown() {
    }

    /**
     * Test of process method, of class AverageByNetworkCalculator.
     */
    @Test
    public void testProcess() throws Exception {
        System.out.println("process");

        Collection<Collection<Long>> groups = new ArrayList<Collection<Long>>();
        Collection<Long> group = new ArrayList<Long>();
        for (int i=0; i<org1networkIds.length; i++) {
            group.add(org1networkIds[i]);
        }
        groups.add(group);
        INetworkWeightCalculator calculator = new AverageByNetworkCalculator(cacheBuilder.getCache(), groups, org1Id, null, NullProgressReporter.instance());
        calculator.process();

        Map<Long, Double> weights = calculator.getWeights();
        assertNotNull(weights);
        assertEquals(org1networkIds.length, weights.size());
        for (Double weight: weights.values()) {
            assertEquals(1d/org1networkIds.length, weight, .000001d);
        }
    }

    /**
     * Test of average method, of class AverageByNetworkCalculator.
     */
    @Test
    public void testAverage() {
        System.out.println("average");
        Map<Integer, Long> IndexToNetworkMap = new HashMap<Integer, Long>();

        for (int i=0; i<org1networkIds.length; i++) {
            IndexToNetworkMap.put(i, org1networkIds[i]);
        }

        Map<Long, Double> result = AverageByNetworkCalculator.average(IndexToNetworkMap);
        assertNotNull(result);
        assertEquals(org1networkIds.length, result.size());
        for (Double weight: result.values()) {
            assertEquals(1d/org1networkIds.length, weight, .000001d);
        }
    }

}