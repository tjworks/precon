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
package org.genemania.service;

import java.util.Collection;

import org.genemania.domain.Organism;
import org.genemania.exception.DataStoreException;

/**
 * Used to access organism domain data
 */
public interface OrganismService {

	/**
	 * Gets all organisms
	 * 
	 * @return The set of all organisms
	 */
	public Collection<Organism> getOrganisms() throws DataStoreException;

	/**
	 * Gets a particular organism by its ID
	 * 
	 * @param id
	 *            The organism ID
	 * @return The organism corresponding to the ID
	 */
	public Organism findOrganismById(Long id) throws DataStoreException;

	/**
	 * Gets the default query organism
	 * 
	 * @return The default query organism
	 */
	public Organism getDefaultOrganism() throws DataStoreException;

}
