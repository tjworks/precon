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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;


import no.uib.cipr.matrix.DenseVector;
import org.genemania.engine.Constants.CombiningMethod;
import org.genemania.engine.cache.NetworkMemCache;
import org.genemania.engine.cache.RandomDataCacheBuilder;
import org.genemania.engine.config.Config;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.data.NetworkIds;
import org.genemania.engine.core.mania.CalculateNetworkWeights;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
import static junit.framework.Assert.*;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;


/*
 * split out regression test for auto-fast combining,
 * still experimental
 */
@RunWith(Parameterized.class)
public class AutoFastRegressionTest {

    static RandomDataCacheBuilder cacheBuilder;
    // params for test organism
    static int org1Id = 1;
    static int org1numGenes = 50;
    static int org1numNetworks = 10;
    static double org1networkSparsity = .5;
    static int numCategories = 20;
    static double org1AnnotationSparsity = .5;

    public AutoFastRegressionTest(String configFile) throws Exception {
        Config.reload(configFile);
    }

    @Parameters
    public static Collection<Object[]> configure() {
        Object[][] data = {{"mtjconfig.properties"}, {"symconfig.properties"}, {"floatsymconfig.properties"}};
        return Arrays.asList(data);
    }

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
        Config.reload();
    }

    @Before
    public void setUp() throws Exception {
        cacheBuilder = new RandomDataCacheBuilder(7132);
        cacheBuilder.setUp();

        // random organism 1
        cacheBuilder.addOrganism(org1Id, org1numGenes, org1numNetworks,
                org1networkSparsity, numCategories, org1AnnotationSparsity);

        // clear mem cache since its a singleton process wide, don't want stuff left over from other tests
        NetworkMemCache.instance().clear();
    }

    @After
    public void tearDown() {
        cacheBuilder.tearDown();
    }


    
    /*
     * regresion test automatic fast combining
     *
     */
    @Test
    public void testRegressionAutomaticFastCombining() throws Exception {

        System.out.println("regressionAutomaticFastCombining");
        
        CalculateNetworkWeights weightCalc = regressionHelper(CombiningMethod.AUTOMATIC_FAST, .5);
        Map<Long, Double> weights = weightCalc.getWeights();
        
        assertNotNull(weights);
        System.out.println("weights:" + weights);
        assertEquals(weights.size(), 2);
        
        assertEquals(1.6631816076957247, weights.get(10001L), 1e-6);
        assertEquals(0.4560904039518524, weights.get(10008L), 1e-6);
        
    }

    /*
     * execute given combining method on test networks from our random test data
     */
    public CalculateNetworkWeights  regressionHelper(CombiningMethod method, double percentPositives, String namespace) throws ApplicationException {
        NetworkMemCache.instance().clear();
        
        Collection<Collection<Long>> queryNetworkIds = new ArrayList<Collection<Long>>();
        int organismId = 1;
        DenseVector label = new DenseVector(org1numGenes);

        // initialize labels to -1
        for (int i = 0; i < label.size(); i++) {
            label.set(i, -1);
        }

        // and set a few to +1
        for (int i = 0; i < label.size()*percentPositives; i++) {
            label.set(i, 1);
        }

        //Map<Integer, Integer> networkMap = cacheBuilder.getCache().getColumnId(org1Id);
        NetworkIds networkIds = cacheBuilder.getCache().getNetworkIds(namespace, organismId);

        // put network ids into two groups
        ArrayList<Long> temp = new ArrayList<Long>();
        for (int i = 0; i < networkIds.getNetworkIds().length; i++) {
            temp.add(networkIds.getNetworkIds()[i]);
        }
        Collections.sort(temp);
        int group1Size = temp.size() / 5;
        int group2Size = temp.size() - group1Size;

        //System.out.println(temp);
        ArrayList<Long> group = new ArrayList<Long>();

        Iterator<Long> networkIdIter = temp.iterator();
        for (int n = 0; n < group1Size; n++) {
            group.add(networkIdIter.next());
        }
        Collections.shuffle(group);
        queryNetworkIds.add(group);

        group = new ArrayList<Long>();

        for (int n = 0; n < group2Size; n++) {
            group.add(networkIdIter.next());
        }
        Collections.shuffle(group);
        queryNetworkIds.add(group);

        //System.out.println(networkIds);

//        CalculateNetworkWeights weightCalc = new CalculateNetworkWeights(namespace, cacheBuilder.getCache(), queryNetworkIds, organismId, label, method, NullProgressReporter.instance());
        CalculateNetworkWeights  weightCalc =  new CalculateNetworkWeights(namespace, cacheBuilder.getCache(),
                queryNetworkIds, organismId, label, method, NullProgressReporter.instance());

        weightCalc.process();

        return weightCalc;
    }

    /*
     * use namespace "user1" for the query
     */
    public CalculateNetworkWeights  regressionHelper(CombiningMethod method, double percentPositives) throws ApplicationException {
        return regressionHelper(method, percentPositives, Data.CORE);
    }

}
