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
package org.genemania.controller;

import javax.servlet.http.HttpSession;

import org.genemania.exception.DataStoreException;
import org.genemania.service.OrganismService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Export all networks as HTML
 */

@Controller
public class NetworksController {
	
	@Autowired
	OrganismService organismService;
	
	public OrganismService getOrganismService() {
		return organismService;
	}

	public void setOrganismService(OrganismService organismService) {
		this.organismService = organismService;
	}
	
	/**
	 * Test the error page
	 */
	@RequestMapping(method = RequestMethod.GET, value = "/networks")
	public ModelAndView error(HttpSession session) {

		ModelAndView mv = new ModelAndView("WEB-INF/jsp/networks.jsp");
		
		try {
			mv.addObject("organisms", organismService.getOrganisms());
		} catch (DataStoreException e) {
			// can't do anything
		}
		
		return mv;
	}
}
