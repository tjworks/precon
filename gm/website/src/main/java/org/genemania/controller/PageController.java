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
import org.genemania.service.EmailService;
import org.genemania.service.OrganismService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PageController {

	@Autowired
	EmailService emailService;

	@Autowired
	OrganismService organismService;

	public EmailService getEmailService() {
		return emailService;
	}

	public void setEmailService(EmailService logEmailService) {
		this.emailService = logEmailService;
	}

	public OrganismService getOrganismService() {
		return organismService;
	}

	public void setOrganismService(OrganismService organismService) {
		this.organismService = organismService;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/page")
	public ModelAndView show(@RequestParam("page_id") String pageId,
			HttpSession session) {
		ModelAndView mv = null;

		if (!isIdValid(pageId)) {
			mv = new ModelAndView("WEB-INF/jsp/httpError.jsp");
		} else {
			mv = new ModelAndView("WEB-INF/jsp/page.jsp");
			mv.addObject("page_id", pageId);
			try {
				mv.addObject("organisms", organismService.getOrganisms());
			} catch (DataStoreException e) {
				// can't do anything
			}
		}

		return mv;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/page")
	public ModelAndView email(@RequestParam("page_id") String pageId,
			@RequestParam("name") String name,
			@RequestParam("from") String from,
			@RequestParam("subject") String subject,
			@RequestParam("message") String message, HttpSession session) {

		if (!isIdValid(pageId)) {
			ModelAndView mv = new ModelAndView("WEB-INF/jsp/httpError.jsp");
			return mv;
		} else {

			ModelAndView mv = new ModelAndView("WEB-INF/jsp/page.jsp");
			mv.addObject("page_id", pageId);

			String sub = "Contact form: " + subject;
			String msg = "The following message was sent on behalf of " + name
					+ " (" + from + ") by the GeneMANIA mailer\n--\n" + message;

			emailService.sendEmail(sub, msg);

			return mv;
		}

	}

	// for security (don't access ../../../myfiles/secret.doc)
	private boolean isIdValid(String id) {
		return id.matches("[a-z]+");
	}
}
