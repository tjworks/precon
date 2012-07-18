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
package org.genemania.engine.actions;


import static org.junit.Assert.*;

import java.util.HashSet;

import org.genemania.dto.AddOntologyEngineRequestDto;
import org.genemania.dto.AddOntologyEngineResponseDto;
import org.genemania.dto.AddOrganismEngineRequestDto;
import org.genemania.dto.AddOrganismEngineResponseDto;
import org.genemania.engine.IMania;
import org.genemania.engine.Mania2;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.cache.RandomDataCacheBuilder;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.data.DatasetInfo;
import org.genemania.engine.core.data.GoAnnotations;
import org.genemania.engine.core.data.NetworkIds;
import org.genemania.engine.core.data.NodeIds;
import org.genemania.util.NullProgressReporter;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class AddEnrichmentOntologyTest {

    static RandomDataCacheBuilder cacheBuilder;
    // params for test organism
    static int org1Id = 1;
    static int org1numGenes = 20;
    static int org1numNetworks = 10;
    static double org1networkSparsity = .5;
    static int numCategories = 50;
    static double org1AnnotationSparsity = .5;

    @Before
    public void setUp() throws Exception {
        cacheBuilder = new RandomDataCacheBuilder(7132);
        cacheBuilder.setUp();

        // random organism 1
        cacheBuilder.addOrganism(org1Id, org1numGenes, org1numNetworks,
                org1networkSparsity, numCategories, org1AnnotationSparsity);

    }

    @After
    public void tearDown() throws Exception {
        cacheBuilder.tearDown();
    }
    
    @Test
    public void testProcess() throws Exception {
        AddOntologyEngineRequestDto request = new AddOntologyEngineRequestDto();
        
        long newOntologyId = -1;
                
        request.setOrganismId(org1Id);
        request.setOntologyId(newOntologyId);
        request.setProgressReporter(NullProgressReporter.instance());
        
        AddEnrichmentOntology adder = new AddEnrichmentOntology(cacheBuilder.getCache(), request);
        
        AddOntologyEngineResponseDto response = adder.process();
        assertNotNull(response);
        
        // retrieve the newly created ontology matrix
        GoAnnotations annos = cacheBuilder.getCache().getGoAnnotations(org1Id, "" + newOntologyId);
        assertNotNull(annos);
    }
}
