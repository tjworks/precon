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
package org.genemania.service.impl;

import java.util.Collection;

import org.genemania.dao.OrganismDao;
import org.genemania.domain.Organism;
import org.genemania.exception.DataStoreException;
import org.genemania.service.OrganismService;
import org.springframework.beans.factory.annotation.Autowired;

public class OrganismServiceImpl implements OrganismService {

	@Autowired
	private OrganismDao organismDao;

	@Override
	public Organism findOrganismById(Long id) throws DataStoreException {
		return organismDao.findOrganism(id);
	}

	@Override
	public Collection<Organism> getOrganisms() throws DataStoreException {
		return organismDao.getAllOrganisms();
	}

	@Override
	public Organism getDefaultOrganism() throws DataStoreException {
		return this.findOrganismById(4L);
	}

	public OrganismDao getOrganismDao() {
		return organismDao;
	}

	public void setOrganismDao(OrganismDao organismDao) {
		this.organismDao = organismDao;
	}

}
