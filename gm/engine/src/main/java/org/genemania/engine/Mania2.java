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

package org.genemania.engine;

import org.genemania.dto.AddOrganismEngineResponseDto;
import org.genemania.engine.actions.FindRelated;
import org.apache.log4j.Logger;
import org.genemania.dto.AddOrganismEngineRequestDto;
import org.genemania.dto.EnrichmentEngineRequestDto;
import org.genemania.dto.EnrichmentEngineResponseDto;
import org.genemania.dto.ListNetworksEngineRequestDto;
import org.genemania.dto.ListNetworksEngineResponseDto;
import org.genemania.dto.RelatedGenesEngineRequestDto;
import org.genemania.dto.RelatedGenesEngineResponseDto;
import org.genemania.dto.RemoveNetworkEngineRequestDto;
import org.genemania.dto.RemoveNetworkEngineResponseDto;
import org.genemania.dto.UploadNetworkEngineRequestDto;
import org.genemania.dto.UploadNetworkEngineResponseDto;
import org.genemania.engine.actions.AddOrganism;
import org.genemania.engine.actions.ComputeEnrichment;
import org.genemania.engine.actions.ListNetworks;
import org.genemania.engine.actions.RemoveNetworks;
import org.genemania.engine.actions.UploadNetwork;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.config.Config;
import org.genemania.exception.ApplicationException;

/**
 * Algorithm implementation on top of data objects implemented
 * in the core.data and cache packages.
 */
public class Mania2 implements IMania {

    private static Logger logger = Logger.getLogger(Mania2.class);
    private DataCache cache;
    
    public Mania2(DataCache cache) {
        this.cache = cache;
    }

    public RelatedGenesEngineResponseDto findRelated(RelatedGenesEngineRequestDto request) throws ApplicationException {

        FindRelated findRelated = new FindRelated(cache, request);
        return findRelated.process();

    }

    public ListNetworksEngineResponseDto listNetworks(ListNetworksEngineRequestDto request) throws ApplicationException {
        ListNetworks listNetworks = new ListNetworks(cache, request);
        return listNetworks.process();
    }

    public UploadNetworkEngineResponseDto uploadNetwork(UploadNetworkEngineRequestDto request) throws ApplicationException {
        UploadNetwork uploadNetwork = new UploadNetwork(cache, request);
        return uploadNetwork.process();
    }

    public RemoveNetworkEngineResponseDto removeUserNetworks(RemoveNetworkEngineRequestDto request) throws ApplicationException {
        RemoveNetworks removeNetworks = new RemoveNetworks(cache, request);
        return removeNetworks.process();
    }

    public void clearMemCache() {
        logger.warn("mem cache clearing not implemented");
    }

    public String getVersion() {
        return Config.instance().getVersion();
    }

    public EnrichmentEngineResponseDto computeEnrichment(EnrichmentEngineRequestDto request) throws ApplicationException {
        ComputeEnrichment computeEnrichment = new ComputeEnrichment(cache, request);
        return computeEnrichment.process();
    }

    public AddOrganismEngineResponseDto addOrganism(AddOrganismEngineRequestDto request) throws ApplicationException {
        AddOrganism addOrganism = new AddOrganism(cache, request);
        return addOrganism.process();
    }
}
