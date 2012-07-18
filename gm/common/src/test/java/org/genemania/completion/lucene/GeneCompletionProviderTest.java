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

package org.genemania.completion.lucene;

import org.genemania.AbstractTest;
import org.genemania.util.GeneHelper;
import org.junit.Test;

public class GeneCompletionProviderTest extends AbstractTest {

	// __[static]______________________________________________________________
	private static final long ORGANISM_ID = 6;
	private static final String TEST_SYMBOL = "TFC3";
	private static final long EXPECTED_NODE_ID = 177049;
	
	// __[test cases]__________________________________________________________
	@Test
	public void testGetNodeId() {
		GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(ORGANISM_ID);
		assertNotNull("geneCompletionProvider", geneCompletionProvider);
		Long actualNodeId = geneCompletionProvider.getNodeId(TEST_SYMBOL);
		assertEquals("node id", EXPECTED_NODE_ID, actualNodeId.longValue());
	}
	
}
