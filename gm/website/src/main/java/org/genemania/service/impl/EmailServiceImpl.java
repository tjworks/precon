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

import org.genemania.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;

public class EmailServiceImpl implements EmailService {

	@Autowired
	private MailSender mailSender;

	@Autowired
	private SimpleMailMessage mailMessage;

	@Override
	public void sendEmail(String message) {
		SimpleMailMessage msg = new SimpleMailMessage(this.mailMessage);
		msg.setText(message);
		mailSender.send(msg);
	}

	@Override
	public void sendEmail(String subject, String message) {
		SimpleMailMessage msg = new SimpleMailMessage(this.mailMessage);
		msg.setText(message);
		msg.setSubject(subject);
		mailSender.send(msg);
	}

	@Override
	public void sendEmail(String subject, String message, String name,
			String from) {
		SimpleMailMessage msg = new SimpleMailMessage(this.mailMessage);
		msg.setSubject(subject);
		msg.setText("The following message was sent on behalf of " + name + " (" + from + ") by the GeneMANIA mailer\n--\n" + message);
		msg.setFrom(from);
		mailSender.send(msg);
	}

	public MailSender getMailSender() {
		return mailSender;
	}

	public void setMailSender(MailSender mailSender) {
		this.mailSender = mailSender;
	}

	public SimpleMailMessage getMailMessage() {
		return mailMessage;
	}

	public void setMailMessage(SimpleMailMessage message) {
		this.mailMessage = message;
	}

}
