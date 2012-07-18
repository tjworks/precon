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

/**
 * EngineFacade: a JMS consumer that acts as a facade to the engine server  
 * Created Jul 16, 2009
 * @author Ovi Comes
 */
package org.genemania.broker;

import javax.jms.Connection;
import javax.jms.DeliveryMode;
import javax.jms.ExceptionListener;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.MessageListener;
import javax.jms.MessageProducer;
import javax.jms.Queue;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.log4j.Logger;
import org.genemania.message.RelatedGenesRequestMessage;
import org.genemania.message.UploadNetworkRequestMessage;
import org.genemania.util.ApplicationConfig;
/**
 * @deprecated
 */
public class EngineFacade implements MessageListener, ExceptionListener {

	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(EngineFacade.class);
	
	// __[attributes]__________________________________________________________
    private Session session;
    private MessageConsumer clientRequestHandler;
    private MessageProducer workerController;
	private String clientRequestsQueueName;
	private String workerRequestsQueueName;
	private String workerRepliesQueueName;
	private Queue workerRepliesQueue;
    
	// __[public interface]____________________________________________________
	public void start() {
		try {
			// read config data
			String appVer = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.APP_VER);
			String brokerAdminPort = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.BROKER_ADMIN_PORT);
			String brokerProtocol = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.BROKER_PROTOCOL);
			String brokerHost = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.BROKER_HOST);
			String brokerPort = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.BROKER_PORT);
			String brokerUrl = brokerProtocol + "://" + brokerHost + ":" + brokerPort;
//			clientRequestsQueueName = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.CLIENT_REQUESTS_QUEUE_NAME);
//			workerRequestsQueueName = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.WORKER_REQUESTS_QUEUE_NAME);
//			workerRepliesQueueName = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.WORKER_REPLIES_QUEUE_NAME);
			// setup message queues
			ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory(brokerUrl);
			Connection connection = connectionFactory.createConnection();
            connection.setExceptionListener(this);
            connection.start();
            session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            session.createProducer(null);
            clientRequestHandler = session.createConsumer(session.createQueue(clientRequestsQueueName));
            clientRequestHandler.setMessageListener(this);
            workerController = session.createProducer(session.createQueue(workerRequestsQueueName));
            workerRepliesQueue = session.createQueue(workerRepliesQueueName);
            // output startup info
			LOG.info("GeneMANIA Engine Broker ver. " + appVer);
			LOG.info("listening on port " + brokerPort + ", queue: " + clientRequestsQueueName);
			LOG.info("admin url: http://" + brokerHost + ":" + brokerAdminPort + "/admin/");
		} catch (JMSException e) {
        	LOG.error("Broker startup error", e);
		}
	}
	
	// __[interface implementation]____________________________________________
	public void onMessage(Message msg) {
        if (msg instanceof TextMessage) {
			try {
		        LOG.debug("new message: type=" + msg.getJMSType() + ", correlation id= " + msg.getJMSCorrelationID());
				Queue queue = (Queue)msg.getJMSDestination();
				TextMessage message = (TextMessage)msg;
				if(queue.getQueueName().equalsIgnoreCase(clientRequestsQueueName)) {
	            	TextMessage workerMessage = getWorkerMessage(message);
			        workerController.setDeliveryMode(DeliveryMode.PERSISTENT);
			        workerController.send(workerMessage);
			        LOG.debug("message sent to: " + ((Queue)workerController.getDestination()).getQueueName());
				} else {
                	LOG.warn(clientRequestsQueueName + " queue was expected but was " + queue.getQueueName()); 
				}
			} catch (JMSException e) {
	        	LOG.error("Error dispatching a job: " + e.getMessage());
			}
        } else {
        	LOG.warn("Unknown message type: " + msg);
        }
	}

	public synchronized void onException(JMSException e) {
        LOG.error("Broker JMS Exception", e);
    }

	// __[private helpers]_____________________________________________________
    private TextMessage getWorkerMessage(TextMessage message) throws JMSException {
    	TextMessage ret = session.createTextMessage();
    	String jmsType = message.getJMSType();
    	String xml = "";
    	if(MessageType.RELATED_GENES.equals(MessageType.fromCode(jmsType))) {
    		xml = RelatedGenesRequestMessage.fromXml(message.getText()).toXml();
            ret.setJMSType(MessageType.RELATED_GENES.getCode());
    	} else if(MessageType.TEXT2NETWORK.equals(MessageType.fromCode(jmsType))) {
    		xml = UploadNetworkRequestMessage.fromXml(message.getText()).toXml();
            ret.setJMSType(MessageType.TEXT2NETWORK.getCode());
    	} else {
    		LOG.error("Unknown JMS type: " + message.getJMSType()); 
    	}
   		ret.setText(xml); 
   		ret.setJMSReplyTo(workerRepliesQueue);
   		ret.setJMSCorrelationID(message.getJMSCorrelationID());
        return ret;
	}

	// __[main]________________________________________________________________
	public static void main(String[] args) {
//		EngineFacade ef = new EngineFacade();
//		ef.start();
	}
	
}
