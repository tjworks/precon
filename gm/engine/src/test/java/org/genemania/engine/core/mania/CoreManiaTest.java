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

package org.genemania.engine.core.mania;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Vector;
import org.genemania.engine.config.Config;
import org.genemania.engine.Constants;
import org.genemania.engine.Utils;
import org.genemania.engine.cache.NetworkMemCache;
import org.genemania.engine.cache.RandomDataCacheBuilder;
import org.genemania.engine.matricks.MatricksException;
//import org.genemania.engine.matricks.Vector;
import org.genemania.engine.core.data.Data;
import org.genemania.exception.ApplicationException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;
import static org.junit.Assert.*;

/**
 *
 */
@RunWith(Parameterized.class)
public class CoreManiaTest {

    public CoreManiaTest(String configFile) throws ApplicationException {
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
    public void setUp() {
        NetworkMemCache.instance().clear();
    }

    @After
    public void tearDown() {
    }

    /*
     * helper
     */
    public Vector getExpectedResult() throws Exception {
        Vector expectedResult;


        try {
            expectedResult = new DenseVector(50);

            expectedResult.set(0, 4.020214710375e-01);
            expectedResult.set(1, 3.949107779240e-01);
            expectedResult.set(2, 3.965326789518e-01);
            expectedResult.set(3, 4.074270486393e-01);
            expectedResult.set(4, 3.760342307980e-01);
            expectedResult.set(5, 3.933306603874e-01);
            expectedResult.set(6, 3.836750763094e-01);
            expectedResult.set(7, 4.299730912026e-01);
            expectedResult.set(8, 4.106838458950e-01);
            expectedResult.set(9, 4.038085878143e-01);
            expectedResult.set(10, 3.972415492244e-01);
            expectedResult.set(11, 3.774283550550e-01);
            expectedResult.set(12, 4.044014204083e-01);
            expectedResult.set(13, 3.869531946302e-01);
            expectedResult.set(14, 4.099305582254e-01);
            expectedResult.set(15, 3.923260406020e-01);
            expectedResult.set(16, 3.666713487645e-01);
            expectedResult.set(17, 3.669927573874e-01);
            expectedResult.set(18, 3.791293236847e-01);
            expectedResult.set(19, 4.209893363903e-01);
            expectedResult.set(20, -5.837346109572e-01);
            expectedResult.set(21, -6.181962507787e-01);
            expectedResult.set(22, -5.977593617742e-01);
            expectedResult.set(23, -6.139843221916e-01);
            expectedResult.set(24, -5.921635113504e-01);
            expectedResult.set(25, -6.026399290894e-01);
            expectedResult.set(26, -5.935429432315e-01);
            expectedResult.set(27, -5.750854398849e-01);
            expectedResult.set(28, -5.710859930933e-01);
            expectedResult.set(29, -5.848038502345e-01);
            expectedResult.set(30, -5.938111475293e-01);
            expectedResult.set(31, -5.952633686443e-01);
            expectedResult.set(32, -5.793684983432e-01);
            expectedResult.set(33, -5.778113346914e-01);
            expectedResult.set(34, -5.868185352639e-01);
            expectedResult.set(35, -5.986841050317e-01);
            expectedResult.set(36, -5.755946683549e-01);
            expectedResult.set(37, -5.851783900651e-01);
            expectedResult.set(38, -6.052925011516e-01);
            expectedResult.set(39, -6.196683619527e-01);
            expectedResult.set(40, -5.861964330877e-01);
            expectedResult.set(41, -6.210518276800e-01);
            expectedResult.set(42, -6.093347520224e-01);
            expectedResult.set(43, -5.971671115476e-01);
            expectedResult.set(44, -6.222821761043e-01);
            expectedResult.set(45, -6.430938172584e-01);
            expectedResult.set(46, -5.539929431928e-01);
            expectedResult.set(47, -5.586062477389e-01);
            expectedResult.set(48, -5.920742299541e-01);
            expectedResult.set(49, -6.661746660759e-01);
        }
        catch (MatricksException e) {
            throw new RuntimeException("failed to init test data: " + e);
        }

        return expectedResult;
    }
    
    @Test
    public void testComputeAverageCombining() throws Exception {

        Vector expectedResult = getExpectedResult();

        // create some test data
        RandomDataCacheBuilder rcb = new RandomDataCacheBuilder(2112);
        rcb.setUp();
        long[] organism1NetworkIds = rcb.addOrganism(1, 50, 5, 0.5);
        long[] organism2NetworkIds = rcb.addOrganism(2, 20, 3, 0.5);

        //int[] organism1NodeIds = rcb.getCache().getMapping(1);
        //int[] organism2NodeIds = rcb.getCache().getMapping(2);
        long[] organism1NodeIds = rcb.getCache().getNodeIds(1).getNodeIds();
        long[] organism2NodeIds = rcb.getCache().getNodeIds(2).getNodeIds();

        // sanity check on test data
        assertEquals(5, organism1NetworkIds.length);
        assertEquals(3, organism2NetworkIds.length);
        assertEquals(50, organism1NodeIds.length);
        assertEquals(20, organism2NodeIds.length);

        // setup mania instance ... only data dependency is on the cache
        CoreMania coreMania = new CoreMania(rcb.getCache());

        // set first 20 labels to 1.0, the rest to -1.0;
        Vector labels = new DenseVector(50);
        for (int i = 0; i < 50; i++) {
            if (i < 20) {
                labels.set(i, 1.0);
            }
            else {
                labels.set(i, -1.0);
            }
        }

        // all the networks in one group
        Collection<Collection<Long>> networkIds = new ArrayList<Collection<Long>>();
        Collection<Long> group1 = new ArrayList<Long>();
        for (int i = 0; i < organism1NetworkIds.length; i++) {
            group1.add(organism1NetworkIds[i]);
        }
        networkIds.add(group1);

        // compute & check
        coreMania.compute(Data.CORE, 1, labels, Constants.CombiningMethod.AVERAGE, networkIds, null, "average");

        assertNotNull(coreMania.getCombinedKernel());
//        assertEquals(0d, coreMania.getCombinedKernel().elementSum(), 1e-5);

        assertNotNull(coreMania.getMatrixWeights());
        assertFalse(coreMania.getMatrixWeights().size() == 0);
        assertNotNull(coreMania.getDiscriminant());

        // all the network weights should be 1/N
        for (Long m: coreMania.getMatrixWeights().keySet()) {
            double weight = coreMania.getMatrixWeights().get(m);
            assertEquals(1d / organism1NetworkIds.length, weight, .00001);
        }

        // discriminant scores regression test
        Utils.elementWiseCompare(expectedResult, coreMania.getDiscriminant(), 1e-7);
    }
    /*
     * test case for computing the network combination
     * and discriminant with separate api calls.
     */
    public void testSplitComputation() throws Exception {

        Vector expectedResult = getExpectedResult();

        // create some test data
        RandomDataCacheBuilder rcb = new RandomDataCacheBuilder(2112);
        rcb.setUp();
        long[] organism1NetworkIds = rcb.addOrganism(1, 50, 5, 0.5);
        long[] organism2NetworkIds = rcb.addOrganism(2, 20, 3, 0.5);

        long[] organism1NodeIds = rcb.getCache().getNodeIds(1).getNodeIds();
        long[] organism2NodeIds = rcb.getCache().getNodeIds(2).getNodeIds();

        // sanity check on test data
        assertEquals(5, organism1NetworkIds.length);
        assertEquals(3, organism2NetworkIds.length);
        assertEquals(50, organism1NodeIds.length);
        assertEquals(20, organism2NodeIds.length);

        // setup mania instance ... only data dependency is on the cache
        CoreMania coreMania = new CoreMania(rcb.getCache());

        // set first 20 labels to 1.0, the rest to -1.0;
        Vector labels = new DenseVector(50);
        for (int i=0; i<50; i++) {
            if (i < 20) {
                labels.set(i, 1.0);
            }
            else {
                labels.set(i, -1.0);
            }
        }

        // all the networks in one group
        Collection<Collection<Long>> networkIds = new ArrayList<Collection<Long>>();
        Collection<Long> group1 = new ArrayList<Long>();
        for (int i=0; i<organism1NetworkIds.length; i++) {
            group1.add(organism1NetworkIds[i]);
        }
        networkIds.add(group1);

        // compute & check
        coreMania.computeWeights(Data.CORE, 1, labels, Constants.CombiningMethod.AVERAGE, networkIds);

        assertNotNull(coreMania.getCombinedKernel());
        assertNotNull(coreMania.getMatrixWeights());
        assertFalse(coreMania.getMatrixWeights().size() == 0);

        // all the network weights should be 1/N
        for (Long m: coreMania.getMatrixWeights().keySet()) {
            double weight = coreMania.getMatrixWeights().get(m);
            assertEquals(1d/organism1NetworkIds.length, weight, .00001);
        }

        coreMania.computeDiscriminant(1, labels, null, "average");
        assertNotNull(coreMania.getDiscriminant());

        // discriminant scores regression test
        Utils.elementWiseCompare(expectedResult, coreMania.getDiscriminant(), 1e-10);

    }

    public void testMultipleCalculationsWithSameWeights() throws Exception {

        Vector expectedResult = getExpectedResult();

        // create some test data
        RandomDataCacheBuilder rcb = new RandomDataCacheBuilder(2112);
        rcb.setUp();
        long[] organism1NetworkIds = rcb.addOrganism(1, 50, 5, 0.5);
        long[] organism2NetworkIds = rcb.addOrganism(2, 20, 3, 0.5);

        long[] organism1NodeIds = rcb.getCache().getNodeIds(1).getNodeIds();
        long[] organism2NodeIds = rcb.getCache().getNodeIds(2).getNodeIds();

        // sanity check on test data
        assertEquals(5, organism1NetworkIds.length);
        assertEquals(3, organism2NetworkIds.length);
        assertEquals(50, organism1NodeIds.length);
        assertEquals(20, organism2NodeIds.length);

        // setup mania instance ... only data dependency is on the cache
        CoreMania coreMania = new CoreMania(rcb.getCache());

        // set first 20 labels to 1.0, the rest to -1.0;
        Vector labels = new DenseVector(50);
        for (int i=0; i<50; i++) {
            if (i < 20) {
                labels.set(i, 1.0);
            }
            else {
                labels.set(i, -1.0);
            }
        }

        // all the networks in one group
        Collection<Collection<Long>> networkIds = new ArrayList<Collection<Long>>();
        Collection<Long> group1 = new ArrayList<Long>();
        for (int i=0; i<organism1NetworkIds.length; i++) {
            group1.add(organism1NetworkIds[i]);
        }
        networkIds.add(group1);

        // compute & check
        coreMania.computeWeights(Data.CORE, 1, labels, Constants.CombiningMethod.AVERAGE, networkIds);
        assertNotNull(coreMania.getCombinedKernel());
        assertNotNull(coreMania.getMatrixWeights());
        assertFalse(coreMania.getMatrixWeights().size() == 0);

        // all the network weights should be 1/N
        for (Long m: coreMania.getMatrixWeights().keySet()) {
            double weight = coreMania.getMatrixWeights().get(m);
            assertEquals(1d/organism1NetworkIds.length, weight, .00001);
        }

        coreMania.computeDiscriminant(1, labels, null, "average");
        assertNotNull(coreMania.getDiscriminant());

        // discriminant scores regression test
        Utils.elementWiseCompare(expectedResult, coreMania.getDiscriminant(), 1e-10);

        // another set of labels, first 30 set to 1
        Vector labels2 = new DenseVector(50);
        for (int i=0; i<50; i++) {
            if (i < 30) {
                labels2.set(i, 1.0);
            }
            else {
                labels2.set(i, -1.0);
            }
        }

        // run the second query with original combined networks, just regression test
        // first few elements
        coreMania.computeDiscriminant(1, labels2, null, "average");
        assertNotNull(coreMania.getDiscriminant());
        System.out.println(coreMania.getDiscriminant());
        assertEquals(5.948889395253e-01, coreMania.getDiscriminant().get(0), 1e-10);
        assertEquals(5.992815340716e-01, coreMania.getDiscriminant().get(1), 1e-10);
        assertEquals(6.017207119987e-01, coreMania.getDiscriminant().get(2), 1e-10);
        assertEquals(5.800145918994e-01, coreMania.getDiscriminant().get(3), 1e-10);
        assertEquals(5.881483019749e-01, coreMania.getDiscriminant().get(4), 1e-10);


        // first query again, should give the original result
        coreMania.computeDiscriminant(1, labels, null, "average");
        assertNotNull(coreMania.getDiscriminant());
        Utils.elementWiseCompare(expectedResult, coreMania.getDiscriminant(), 1e-10);

    }
}
