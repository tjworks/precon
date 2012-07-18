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
 * NetworkConverterTest: JUnit test class for NetworkConverter
 * Created Oct 23, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.io.IOException;

import org.genemania.AbstractTest;
import org.genemania.dto.NetworkConversionDto;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;
import org.junit.Test;

public class NetworkConverterTest extends AbstractTest {

	// __[static]______________________________________________________________
//	private static Logger LOG = Logger.getLogger(NetworkConverterTest.class);
	private static final long ORGANISM_ID = 6;
//	private static final String ORGANISM_NAME = "S. cerevisiae (baker's yeast)";
//	private static final int TOTAL_LINES_EXPECTED = 1;
//	private static final String NETWORK_NAME = "test";
//	private static final String HEADER = "Interacting Protein #1	Interacting Protein #2	Confidence Score";
//	private static final String RAW_INTERACTIONS = "TFC3	TFC1	0.989";
//	private static final int VALID_INTERACTIONS_EXPECTED = 1;
	private static final String BINARY_NETWORK_FILENAME = "src/test/resources/binaryNetworkNoHeader.txt";
	private static final String WEIGHTED_NETWORK_FILENAME = "src/test/resources/weightedNetwork.txt";
	private static final String WEIGHTED_NETWORK_WITH_INVALID_LINES_FILENAME = "src/test/resources/weightedNetworkWithInvalidLines.txt";
//	private static final String TEST_NETWORK_NAME = "src/test/resources/weightedNetwork.txt";
	
	// __[attributes]__________________________________________________________
	
	// __[test cases]__________________________________________________________
	@Test
	public void testFromStringWeightedNetwork() {
		try {
			String data = readTestFile(WEIGHTED_NETWORK_FILENAME);
			NetworkConverter networkConverter = new NetworkConverter(ORGANISM_ID);
			NetworkConversionDto dto = networkConverter.fromString(data);
			assertNotNull(dto);
			assertNotNull("network should not be null", dto.getNetwork());
			assertEquals("total lines count", 10, dto.getTotalLinesCount());
			assertNotNull("unrecognized lines should not be null", dto.getUnrecognizedLines());
			assertEquals("unrecognized lines count", 1, dto.getUnrecognizedLines().size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		} catch (SystemException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testFromStringWeightedNetworkWithInvalidLines() {
		try {
			String data = readTestFile(WEIGHTED_NETWORK_WITH_INVALID_LINES_FILENAME);
			NetworkConverter networkConverter = new NetworkConverter(ORGANISM_ID);
			NetworkConversionDto dto = networkConverter.fromString(data);
			assertNotNull(dto);
			assertNotNull("network should not be null", dto.getNetwork());
			assertEquals("total lines count", 7, dto.getTotalLinesCount());
			assertNotNull("unrecognized lines should not be null", dto.getUnrecognizedLines());
			assertEquals("unrecognized lines count", 3, dto.getUnrecognizedLines().size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		} catch (SystemException e) {
			fail(e.getMessage());
		}
	}
	
	@Test
	public void testFromStringBinaryNetwork() {
		try {
			String data = readTestFile(BINARY_NETWORK_FILENAME);
			NetworkConverter networkConverter = new NetworkConverter(ORGANISM_ID);
			NetworkConversionDto dto = networkConverter.fromString(data);
			assertNotNull(dto);
			assertNotNull("network should not be null", dto.getNetwork());
			assertEquals("total lines count", 9, dto.getTotalLinesCount());
			assertNotNull("unrecognized lines should not be null", dto.getUnrecognizedLines());
			assertEquals("unrecognized lines count", 0, dto.getUnrecognizedLines().size());
		} catch (IOException e) {
			fail(e.getMessage());
		} catch (ValidationException e) {
			fail(e.getMessage());
		} catch (SystemException e) {
			fail(e.getMessage());
		}
	}
	
}
