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

import java.util.Map;
import java.util.Vector;

import org.genemania.engine.Constants;

import no.uib.cipr.matrix.DenseMatrix;
import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Matrix;
import junit.framework.TestCase;

public class CombineNetworksTest extends TestCase {

	/**
	 * average a couple of tiny matrices that always combine to the value 2.0
	 * 
	 * @throws Exception
	 */
	public void testCombineAverage() throws Exception {
		Matrix m1 = new DenseMatrix(new double[][] {{1,2},{3,4}});
		Matrix m2 = new DenseMatrix(new double[][] {{3,2},{1,0}});
		Vector networks = new Vector();
		networks.add(m1);
		networks.add(m2);
		
		Matrix result = CombineNetworks.combine(networks, null, Constants.CombiningMethod.AVERAGE);
		
		assertNotNull(result);
		for (int i=0; i<2; i++) {
			for (int j=0; j<2; j++) {
				assertEquals(result.get(i, j), 2.0d);				
			}
		}		
	}
	
	public void testCombineAutomatic() throws Exception {
	
		int numNetworks = 5;
		int networkSize = 5;
		Vector networks = new Vector();
		
		double [][] m1 = {
			   {0.00000,   0.95751,   1.13576,   0.72828,   0.90080},
			   {0.95751,   0.00000,   1.03457,   1.44304,   0.78404},
			   {1.13576,   1.03457,   0.00000,   1.64753,   0.89874},
			   {0.72828,   1.44304,   1.64753,   0.00000,   0.95460},
			   {0.90080,   0.78404,   0.89874,   0.95460,   0.00000}};

		double [][] m2 = {
			   {0.00000,   1.14068,   0.40943,   0.35954,   0.41156},
			   {1.14068,   0.00000,   1.28811,   0.65315,   0.73067},
			   {0.40943,   1.28811,   0.00000,   0.67545,   1.16877},
			   {0.35954,   0.65315,   0.67545,   0.00000,   0.59709},
			   {0.41156,   0.73067,   1.16877,   0.59709,   0.00000}};

				double [][] m3 = {
			   {0.00000,   1.04149,   0.94394,   1.27115,   0.36028},
			   {1.04149,   0.00000,   0.69517,   1.24144,   0.95497},
			   {0.94394,   0.69517,   0.00000,   0.56282,   0.67804},
			   {1.27115,   1.24144,   0.56282,   0.00000,   1.30646},
			   {0.36028,   0.95497,   0.67804,   1.30646,   0.00000}};

				double [][] m4 = {
			   {0.00000,   0.58673,   0.88280,   0.68933,   1.00151},
			   {0.58673,   0.00000,   0.56713,   1.30823,   0.57809},
			   {0.88280,   0.56713,   0.00000,   1.62281,   0.97592},
			   {0.68933,   1.30823,   1.62281,   0.00000,   0.66215},
			   {1.00151,   0.57809,   0.97592,   0.66215,   0.00000}};

				double [][] m5 = {
			   {0.00000,   1.53764,   1.30612,   0.50920,   0.61161},
			   {1.53764,   0.00000,   0.34499,   0.94434,   1.36704},
			   {1.30612,   0.34499,   0.00000,   0.19070,   1.61478},
			   {0.50920,   0.94434,   0.19070,   0.00000,   1.89331},
			   {0.61161,   1.36704,   1.61478,   1.89331,   0.00000}};

		networks.add(new DenseMatrix(m1));
		networks.add(new DenseMatrix(m2));
		networks.add(new DenseMatrix(m3));
		networks.add(new DenseMatrix(m4));
		networks.add(new DenseMatrix(m5));
		
		no.uib.cipr.matrix.Vector labels = new DenseVector(new double [] {1d, 1d, -1d, -1d, -1d});
		
		//Matrix result = CombineNetworks.combine(networks, labels, "automatic");
		Map<Matrix, Double>  weightMap = CombineNetworks.automatic(networks, labels);
		
		// result of weights should be 1.17784, 0.12283, 0.99658 for networks m2, m3, m5
		assertEquals(3, weightMap.size());
		assertEquals(1.17784, weightMap.get(networks.get(1)), 0.00001d);
		assertEquals(0.12283, weightMap.get(networks.get(2)), 0.00001d);
		assertEquals(0.99658, weightMap.get(networks.get(4)), 0.00001d);
		
		// reorder inputs, should give same result
		networks.clear();
		networks.add(new DenseMatrix(m5));
		networks.add(new DenseMatrix(m4));
		networks.add(new DenseMatrix(m3));
		networks.add(new DenseMatrix(m2));
		networks.add(new DenseMatrix(m1));
		
		labels = new DenseVector(new double [] {1d, 1d, -1d, -1d, -1d});
		
		//Matrix result = CombineNetworks.combine(networks, labels, "automatic");
		 weightMap = CombineNetworks.automatic(networks, labels);
		
		// result of weights should be 1.17784, 0.12283, 0.99658 for networks m2, m3, m5
		assertEquals(3, weightMap.size());
		assertEquals(1.17784, weightMap.get(networks.get(3)), 0.00001d);
		assertEquals(0.12283, weightMap.get(networks.get(2)), 0.00001d);
		assertEquals(0.99658, weightMap.get(networks.get(0)), 0.00001d);
		
	}
}
