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
 * SpringTestCase: base JUnit test class requiring Spring support
 * Created Jul 31, 2009
 * @author Ovi Comes
 */
package org.genemania;

import org.genemania.mediator.GeneMediator;

public abstract class SpringTestCase extends AbstractTest {

	// __[attributes]__________________________________________________________
	protected GeneMediator geneMediator; 
	
	// __[accessors]___________________________________________________________
	
	// __[framework methods]___________________________________________________
//	@Override
//	protected void onSetUp() throws Exception {
//		super.onSetUp();
//	}
//
//	@Override
//	protected void onTearDown() throws Exception {
//		super.onTearDown();
//	}
	
//	@Override
//	protected void setUp() throws Exception {
//		super.setUp();
////		CallbackDao dao = new HibernateCallbackDao();
////		Configuration configuration = new Configuration();
////		Properties properties = new Properties();
////		properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
////		BasicDataSource dataSource = new BasicDataSource();
////		dataSource.setUrl("jdbc:mysql://server4.baderlab.med.utoronto.ca:3306/genemania22");
////		properties.put("dataSource", dataSource);
////		configuration.setProperties(properties);
////		Mapping mapping = configuration.buildMapping();
////		Settings settings = configuration.buildSettings();
////		EventListeners eventListeners = new EventListeners(); 
////		SessionFactory sessionFactory = new SessionFactoryImpl(configuration, mapping, settings, eventListeners);
////		((HibernateCallbackDao)dao).setSessionFactory(sessionFactory);
////		geneMediator = new HibernateGeneMediator();
////		((HibernateGeneMediator)geneMediator).setCallbackDao(dao);
//	}
//
//	@Override
//	protected void tearDown() throws Exception {
//		super.tearDown();
//	}
	
	// __[Spring requirements]_________________________________________________
//	@Override
//	protected String[] getConfigLocations(){
//        return new String[] {"classpath:/TestApplicationContext.xml"};
//	}
	
}
