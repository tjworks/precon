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
 * RelatedGenesWebRequestDto: Website-specific Related Genes request data transfer object   
 * Created Jul 22, 2009
 * @author Ovi Comes
 */
package org.genemania.dto;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.genemania.domain.Gene;
import org.genemania.domain.InteractionNetwork;
import org.genemania.type.CombiningMethod;

public class RelatedGenesWebRequestDto implements Serializable {

	// __[static]______________________________________________________________
	private static final long serialVersionUID = -5062149471128161811L;

	// __[attributes]__________________________________________________________
	private long organismId;
	private Collection<Gene> inputGenes;
	private Collection<InteractionNetwork> inputNetworks;
	private int pageSize;
	private int pages;
	private CombiningMethod combiningMethod;
	private String userDefinedNetworkNamespace;
	private long ontologyId; // for enrichment analysis

	// __[constructors]________________________________________________________
	public RelatedGenesWebRequestDto() {
	}

	// __[accessors]___________________________________________________________
	public String toString() {
		int i;

		String organismToken = "organim=" + getOrganismId() + ";";

		long[] genes = new long[this.getInputGenes().size()];
		String geneToken = "genes=";
		i = 0;
		for (Gene gene : this.getInputGenes()) {
			genes[i] = gene.getNode().getId();
			i++;
		}
		Arrays.sort(genes);
		for (i = 0; i < genes.length; i++) {
			geneToken += genes[i] + (i < genes.length - 1 ? "," : "");
			i++;
		}
		geneToken += ";";

		String sizeToken = "size=" + this.getPageSize() + ";";

		String networkToken = "networks=";
		long[] networks = new long[this.getInputNetworks().size()];
		i = 0;
		for (InteractionNetwork network : this.getInputNetworks()) {
			networks[i] = network.getId();
			i++;
		}
		Arrays.sort(networks);
		for (i = 0; i < networks.length; i++) {
			networkToken += networks[i] + (i < networks.length - 1 ? "," : "");
			i++;
		}
		networkToken += ";";

		String weightingToken = "weighting=" + this.getCombiningMethod() + ";";

		return organismToken + geneToken + networkToken + weightingToken
				+ sizeToken;
	}

	public long getOrganismId() {
		return organismId;
	}

	public void setOrganismId(long organismId) {
		this.organismId = organismId;
	}

	public Collection<Gene> getInputGenes() {
		return inputGenes;
	}

	public void setInputGenes(Collection<Gene> inputGenes) {
		this.inputGenes = inputGenes;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public Collection<InteractionNetwork> getInputNetworks() {
		return inputNetworks;
	}

	public void setInputNetworks(Collection<InteractionNetwork> inputNetworks) {
		this.inputNetworks = inputNetworks;
	}

	public CombiningMethod getCombiningMethod() {
		return combiningMethod;
	}

	public void setCombiningMethod(CombiningMethod combiningMethod) {
		this.combiningMethod = combiningMethod;
	}

	public String getUserDefinedNetworkNamespace() {
		return userDefinedNetworkNamespace;
	}

	public void setUserDefinedNetworkNamespace(
			String userDefinedNetworkNamespace) {
		this.userDefinedNetworkNamespace = userDefinedNetworkNamespace;
	}

	public long getOntologyId() {
		return ontologyId;
	}

	public void setOntologyId(long ontolgyId) {
		this.ontologyId = ontolgyId;
	}

}
