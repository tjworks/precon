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

import javax.servlet.http.HttpSession;

import org.genemania.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class EmailController {

	@Autowired
	EmailService emailService;

	public EmailService getEmailService() {
		return emailService;
	}

	public void setEmailService(EmailService logEmailService) {
		this.emailService = logEmailService;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/mail")
	@ResponseBody
	public void create(@RequestParam("message") String message,
			@RequestParam(value = "subject", required = false) String subject,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "from", required = false) String from,
			HttpSession session) {

		if (name != null && from != null) {
			emailService.sendEmail(subject, message, name, from);
		} else if (subject != null) {
			emailService.sendEmail(subject, message);
		} else {
			emailService.sendEmail(message);
		}

	}
}
