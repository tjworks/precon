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
package org.genemania.controller.rest;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import javax.servlet.http.HttpSession;

import org.genemania.domain.InteractionNetwork;
import org.genemania.domain.NetworkMetadata;
import org.genemania.exception.DataStoreException;
import org.genemania.service.UploadNetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UploadNetworkController {

	@Autowired
	UploadNetworkService uploadNetworkService;

	@RequestMapping(method = RequestMethod.POST, value = "/upload_network")
	@ResponseBody
	public NetworkUploadResponse create(
			@RequestParam("organism_id") Integer organismId,
			@RequestParam("file") String file,
			@RequestParam("file_name") String fileName, HttpSession session) {

		NetworkUploadResponse response = new NetworkUploadResponse();
		InteractionNetwork network = null;

		try {
			InputStream is = new ByteArrayInputStream(file.getBytes("UTF-8"));

			network = uploadNetworkService.upload(fileName, is, organismId,
					session.getId());
			response.setNetwork(network);

			if (network.getMetadata().getInteractionCount() == 0) {
				response
						.setError("No interactions were able to be read in the uploaded network; no recognised genes?");
			}

		} catch (Exception e) {
			response.setError(e.getMessage());
		}

		return response;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/delete_network")
	@ResponseBody
	public NetworkDeleteResponse delete(
			@RequestParam("organism_id") Integer organismId,
			@RequestParam("network_id") Long networkId, HttpSession session) {

		NetworkDeleteResponse response = new NetworkDeleteResponse();

		try {
			uploadNetworkService.delete(organismId, networkId, session.getId());
		} catch (DataStoreException e) {
			response.setError(e.getMessage());
		}

		return response;
	}

	public UploadNetworkService getUploadNetworkService() {
		return uploadNetworkService;
	}

	public void setUploadNetworkService(
			UploadNetworkService uploadNetworkService) {
		this.uploadNetworkService = uploadNetworkService;
	}

	public static class NetworkUploadResponse {
		private InteractionNetwork network = null;
		private String error = null;

		public InteractionNetwork getNetwork() {
			return network;
		}

		public void setNetwork(InteractionNetwork network) {
			this.network = network;
		}

		public String getError() {
			return error;
		}

		public void setError(String error) {
			this.error = error;
		}

	}

	public static class NetworkDeleteResponse {
		String error = null;

		public String getError() {
			return error;
		}

		public void setError(String error) {
			this.error = error;
		}

	}

}
