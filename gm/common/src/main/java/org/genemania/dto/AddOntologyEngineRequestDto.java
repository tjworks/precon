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
package org.genemania.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.genemania.util.ProgressReporter;

/*
 * categoryIds.size() == nodeIds.size(), and
 * nodeIds.get(i) is annotated to categoryIds.get(i)
 * 
 * not the most compact representation, but convenient to build/use.
 * the categorynames are similarly organized, but should probably
 * be treated as optional. seem to only currently be used by cross-validation
 * to retrieve annotations from the cache instead of from the file, but 
 * that code could be changed to convert from name->id in another layer (lucene), 
 * and then lookup by id. i think.
 * 
 * WARNING: i don't think this is any good. Probably going to split into two api's,
 * one to just add the categoryIds (with optional names), and a second to add the
 * enrichment ontology. Will be more like adding an organism where you separately
 * add a table of nodes and then add the interaction networks.
 */
public class AddOntologyEngineRequestDto implements Serializable {

    private static final long serialVersionUID = -238664119196603987L;
    
    private long organismId;
    private long ontologyId;
    private List<Long> categoryIds = new ArrayList<Long>();
    private List<Long> nodeIds = new ArrayList<Long>();
    private List<String> categoryNames = new ArrayList<String>();
    private ProgressReporter progressReporter;
    
    public void setOrganismId(long organismId) {
        this.organismId = organismId;
    }
    
    public long getOrganismId() {
        return organismId;
    }
    
    public void setOntologyId(long ontologyId) {
        this.ontologyId = ontologyId;
    }
    
    public long getOntologyId() {
        return ontologyId;
    }
    
    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
    
    public List<Long> getCategoryIds() {
        return categoryIds;
    }
    
    public void setNodeIds(List<Long> nodeIds) {
        this.nodeIds = nodeIds;
    }
    
    public List<Long> getNodeIds() {
        return nodeIds;
    }

    public void setCategoryNames(List<String> categoryNames) {
        this.categoryNames = categoryNames;
    }

    public List<String> getCategoryNames() {
        return categoryNames;
    }

    public void setProgressReporter(ProgressReporter progressReporter) {
        this.progressReporter = progressReporter;
    }

    public ProgressReporter getProgressReporter() {
        return progressReporter;
    }
}
