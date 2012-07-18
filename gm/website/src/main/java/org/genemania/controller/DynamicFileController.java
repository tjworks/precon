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

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class DynamicFileController {

	// usually just for testing (you want to post for long content)
	@RequestMapping(method = RequestMethod.GET, value = "/dynamic_file")
	public ModelAndView show(
			@RequestParam("content") String content,
			@RequestParam("type") String contentType,
			@RequestParam(required = false, value = "disposition") String disposition,
			HttpSession session) {

		return getModelAndView(content, contentType, disposition);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/dynamic_file")
	public ModelAndView create(
			@RequestParam("content") String content,
			@RequestParam("type") String contentType,
			@RequestParam(required = false, value = "disposition") String disposition,
			HttpSession session) {

		return getModelAndView(content, contentType, disposition);
	}

	private ModelAndView getModelAndView(String content, String contentType,
			String disposition) {
		ModelAndView mv = new ModelAndView("WEB-INF/jsp/dynamicFile.jsp");
		mv.addObject("content", content);
		mv.addObject("contentType", contentType);
		mv.addObject("disposition", disposition);

		return mv;
	}
}
