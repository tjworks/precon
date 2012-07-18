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

package org.genemania.domain;

import java.util.Collection;
import java.util.LinkedList;

import org.genemania.type.CombiningMethod;

public class SearchResults {
	private Collection<ResultInteractionNetworkGroup> resultNetworkGroups = new LinkedList<ResultInteractionNetworkGroup>();
	private Collection<ResultGene> resultGenes = new LinkedList<ResultGene>();
	private Collection<ResultOntologyCategory> resultOntologyCategories = new LinkedList<ResultOntologyCategory>();
	private CombiningMethod weighting;

	public SearchResults() {
	}

	public SearchResults(
			Collection<ResultInteractionNetworkGroup> resultNetworkGroups,
			Collection<ResultGene> resultGenes,
			Collection<ResultOntologyCategory> resultOntologyCategories,
			CombiningMethod weighting) {
		super();
		this.resultNetworkGroups = resultNetworkGroups;
		this.resultGenes = resultGenes;
		this.resultOntologyCategories = resultOntologyCategories;
		this.weighting = weighting;
	}

	public Collection<ResultOntologyCategory> getResultOntologyCategories() {
		return resultOntologyCategories;
	}

	public void setResultOntologyCategories(
			Collection<ResultOntologyCategory> resultOntologyCategories) {
		this.resultOntologyCategories = resultOntologyCategories;
	}

	public Collection<ResultInteractionNetworkGroup> getResultNetworkGroups() {
		return resultNetworkGroups;
	}

	public void setResultNetworkGroups(
			Collection<ResultInteractionNetworkGroup> resultNetworkGroups) {
		this.resultNetworkGroups = resultNetworkGroups;
	}

	public Collection<ResultGene> getResultGenes() {
		return resultGenes;
	}

	public void setResultGenes(Collection<ResultGene> resultGenes) {
		this.resultGenes = resultGenes;
	}

	public CombiningMethod getWeighting() {
		return weighting;
	}

	public void setWeighting(CombiningMethod weighting) {
		this.weighting = weighting;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((resultGenes == null) ? 0 : resultGenes.hashCode());
		result = prime
				* result
				+ ((resultNetworkGroups == null) ? 0 : resultNetworkGroups
						.hashCode());
		result = prime
				* result
				+ ((resultOntologyCategories == null) ? 0
						: resultOntologyCategories.hashCode());
		result = prime * result
				+ ((weighting == null) ? 0 : weighting.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SearchResults other = (SearchResults) obj;
		if (resultGenes == null) {
			if (other.resultGenes != null)
				return false;
		} else if (!resultGenes.equals(other.resultGenes))
			return false;
		if (resultNetworkGroups == null) {
			if (other.resultNetworkGroups != null)
				return false;
		} else if (!resultNetworkGroups.equals(other.resultNetworkGroups))
			return false;
		if (resultOntologyCategories == null) {
			if (other.resultOntologyCategories != null)
				return false;
		} else if (!resultOntologyCategories
				.equals(other.resultOntologyCategories))
			return false;
		if (weighting == null) {
			if (other.weighting != null)
				return false;
		} else if (!weighting.equals(other.weighting))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "SearchResults [resultGenes=" + resultGenes
				+ ", resultNetworkGroups=" + resultNetworkGroups
				+ ", resultOntologyCategories=" + resultOntologyCategories
				+ ", weighting=" + weighting + "]";
	}

}
