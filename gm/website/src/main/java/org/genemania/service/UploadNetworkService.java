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

import java.io.IOException;
import java.io.InputStream;

import org.genemania.domain.InteractionNetwork;
import org.genemania.exception.ApplicationException;
import org.genemania.exception.DataStoreException;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;

public interface UploadNetworkService {

	/**
	 * Uploads a network to the engine
	 * 
	 * @param name
	 *            The network name
	 * @param stream
	 *            The input stream containing the network file
	 * @param organismId
	 *            The organismId corresponding to the network
	 * @param sessionId
	 *            The user's sessionId
	 * @return The uploaded network
	 */
	public InteractionNetwork upload(String name, InputStream stream,
			long organismId, String sessionId) throws ApplicationException,
			IOException, DataStoreException, ValidationException,
			SystemException;

	/**
	 * Deletes a user network from the engine
	 * 
	 * @param organismId
	 *            The organism for the network
	 * @param networkId
	 *            The network ID
	 * @param sessionId
	 *            The user's session ID
	 * @throws ApplicationException
	 *             if the network can't be deleted
	 */
	public void delete(Integer organismId, Long networkId, String sessionId)
			throws DataStoreException;

}
