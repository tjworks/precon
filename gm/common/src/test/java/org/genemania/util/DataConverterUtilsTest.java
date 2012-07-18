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

/**
 * DataConverterUtilsTest: JUnit test class for DataConverterUtils
 * Created Oct 22, 2009
 * @author Ovi Comes
 */
package org.genemania.util;

import java.io.IOException;
import java.util.List;

import org.genemania.AbstractTest;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.exception.ValidationException;
import org.genemania.type.DataLayout;
import org.genemania.type.NetworkProcessingMethod;
import org.junit.Test;

public class DataConverterUtilsTest extends AbstractTest {

	// __[static]______________________________________________________________
	private static final int ORGANISM_ID = 6;
	private static final int INVALID_ORGANISM_ID = 1;
	private static final String ONE_LINE_HEADER_FILENAME = "src/test/resources/oneLineHeader.txt";
	private static final String THREE_LINE_HEADER_FILENAME = "src/test/resources/threeLineHeader.txt";
//	private static final String PROFILE_FILENAME = "src/test/resources/profileNetwork.txt";
	private static final String PROFILE_NO_HEADER_FILENAME = "src/test/resources/profileNoHeader.txt";
//	private static final String SPARSE_PROFILE_FILENAME = "src/test/resources/sparseProfile.txt";
	private static final String SPARSE_PROFILE_NO_HEADER_FILENAME = "src/test/resources/sparseProfileNoHeader.txt";
//	private static final String BINARY_NETWORK_FILENAME = "src/test/resources/binaryNetwork.txt";
	private static final String BINARY_NETWORK_NO_HEADER_FILENAME = "src/test/resources/binaryNetworkNoheader.txt";
	private static final String WEIGHTED_NETWORK_FILENAME = "src/test/resources/weightedNetwork.txt";
	private static final String YEAST_NETWORK_FILENAME = "src/test/resources/yeastNetwork.txt";
	private static final String PLANT_NETWORK_FILENAME = "src/test/resources/plantNetwork.txt";
	private static final NetworkProcessingMethod NETWORK_PROCESSING_METHOD = NetworkProcessingMethod.DIRECT;  
	private static final String YEAST_TEST_DATA1 = "src/test/resources/userDefinedNetwork_yeast_01.txt";
	
	// __[constructors]________________________________________________________
	public DataConverterUtilsTest() {
		super();
	}
	
	// __[test cases]__________________________________________________________
	@Test
	public void testParseTestData1() {
		try {
			String data = readTestFile(YEAST_TEST_DATA1);
			List<String> actualBody = DataConverterUtils.getBody(data);
			assertNotNull("body", actualBody);
			assertEquals(2048, actualBody.size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}

	@Test
	public void testGetSingleLineHeader() {
		try {
			String data = readTestFile(ONE_LINE_HEADER_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			List<String> body = DataConverterUtils.getBody(data);
			assertNotNull("body", body);
			assertEquals(3, body.size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testGetMultiLineHeader() {
		try {
			String data = readTestFile(THREE_LINE_HEADER_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			List<String> body = DataConverterUtils.getBody(data);
			assertNotNull("body", body);
			assertEquals(3, body.size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testGetDataLayoutWeightedNetwork() {
		try {
			String data = readTestFile(WEIGHTED_NETWORK_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			DataLayout actualDataLayout = DataConverterUtils.getDataLayout(data, geneCompletionProvider);
			assertNotNull("data layout", actualDataLayout);
			assertSame("data layout", DataLayout.WEIGHTED_NETWORK, actualDataLayout);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testGetDataLayoutBinaryNetwork() {
		try {
			String data = readTestFile(BINARY_NETWORK_NO_HEADER_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			DataLayout actualDataLayout = DataConverterUtils.getDataLayout(data, geneCompletionProvider);
			assertNotNull("data layout", actualDataLayout);
			assertSame("data layout", DataLayout.BINARY_NETWORK, actualDataLayout);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testGetDataProfile() {
		try {
			String data = readTestFile(PROFILE_NO_HEADER_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			DataLayout actualDataLayout = DataConverterUtils.getDataLayout(data, geneCompletionProvider);
			assertNotNull("data layout", actualDataLayout);
			assertSame("data layout", DataLayout.PROFILE, actualDataLayout);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testGetDataSparseProfile() {
		try {
			String data = readTestFile(SPARSE_PROFILE_NO_HEADER_FILENAME);
			GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
			DataLayout actualDataLayout = DataConverterUtils.getDataLayout(data, geneCompletionProvider);
			assertNotNull("data layout", actualDataLayout);
			assertSame("data layout", DataLayout.SPARSE_PROFILE, actualDataLayout);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}

	@Test
	public void testValidateValidOrganism() {
		try {
			String data = readTestFile(YEAST_NETWORK_FILENAME);
			DataConverterUtils.validateOrganism(data, ORGANISM_ID);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testValidateInvalidOrganism() {
		try {
			String data = readTestFile(PLANT_NETWORK_FILENAME);
			DataConverterUtils.validateOrganism(data, ORGANISM_ID);
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			int actualInvalidOrganismId = Integer.parseInt(e.getMessage());
			assertEquals(INVALID_ORGANISM_ID, actualInvalidOrganismId);
		}
	}
	
}
