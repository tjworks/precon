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
 * ProfileConverterTest: JUnit test class for ProfileConverter
 * Created Oct 29, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.io.IOException;

import org.genemania.AbstractTest;
import org.genemania.dto.ProfileConversionDto;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;
import org.junit.Test;

public class ProfileConverterTest extends AbstractTest {

	// __[static]______________________________________________________________
	private static final long ORGANISM_ID = 6;
//	private static final String PROFILE_NAME = "test";
	private static final String PROFILE_FILENAME = "src/test/resources/profileNetworkNoHeader.txt";
//	private static final String SPARSE_PROFILE_FILENAME = "src/test/resources/sparseProfileNetwork.txt";
	private static final String INVALID_PROFILE_FILENAME = "src/test/resources/profileNetworkWithInvalidLines.txt";
	private static final String GEO_SOFT_PROFILE_FILENAME = "src/test/resources/yeast - GDS3198 - small.soft";
	
	// __[attributes]__________________________________________________________
	
	// __[test cases]__________________________________________________________
	@Test
	public void testFromStringProfile() {
		try {
			String data = readTestFile(PROFILE_FILENAME);
			ProfileConverter profileConverter = new ProfileConverter(ORGANISM_ID);
			ProfileConversionDto dto = profileConverter.fromString(data);
			assertNotNull(dto);
			assertNotNull("profile should not be null", dto.getProfile());
			assertEquals("total lines count", 3, dto.getTotalLinesCount());
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
	
	@Test
	public void testFromStringInvalidProfile() {
		try {
			String data = readTestFile(INVALID_PROFILE_FILENAME);
			ProfileConverter profileConverter = new ProfileConverter(ORGANISM_ID);
			ProfileConversionDto dto = profileConverter.fromString(data);
			assertNotNull(dto);
			assertNotNull("profile should not be null", dto.getProfile());
			assertEquals("total lines count", 4, dto.getTotalLinesCount());
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
	
//	@Test
//	public void testFromStringGeoSoftProfile() {
//		try {
//			String data = readTestFile(GEO_SOFT_PROFILE_FILENAME);
//			ProfileConverter profileConverter = new ProfileConverter(ORGANISM_ID);
//			ProfileConversionDto dto = profileConverter.fromString(data);
//			assertNotNull(dto);
//			assertNotNull("profile should not be null", dto.getProfile());
//			assertEquals("total lines count", 10, dto.getTotalLinesCount());
//			assertNotNull("unrecognized lines should not be null", dto.getUnrecognizedLines());
//			assertEquals("unrecognized lines count", 0, dto.getUnrecognizedLines().size());
//		} catch (IOException e) {
//			fail(e.getMessage());
//		} catch (ValidationException e) {
//			fail(e.getMessage());
//		} catch (SystemException e) {
//			fail(e.getMessage());
//		}
//	}
	
	
}
