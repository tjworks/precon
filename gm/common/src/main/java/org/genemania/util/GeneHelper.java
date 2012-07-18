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
 * GeneUtils: utility methods for gene-related operations 
 * Created Oct 22, 2009
 * @author Ovi Comes
 */
package org.genemania.util;

import java.io.File;
import java.io.IOException;
import java.util.Hashtable;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;

public class GeneHelper {

	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(GeneHelper.class);
	private static Map<Long, GeneCompletionProvider> completionProviderOrganismIdMap = new Hashtable<Long, GeneCompletionProvider>();
	
	// __[public helpers]______________________________________________________
	public static GeneCompletionProvider getGeneCompletionProviderFor(long organismId) {
		GeneCompletionProvider ret = null;
		if(completionProviderOrganismIdMap.get(organismId) != null) {
			ret = (GeneCompletionProvider)completionProviderOrganismIdMap.get(organismId);
		} else {
			IndexReader reader = null;
			try {
				String geneIndexDir = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.GENE_INDEX_DIR);
				String indexPath = geneIndexDir + File.separator + organismId;
				File f = new File(indexPath);
				if(!f.exists()) {
					LOG.error("no gene index for organism id=" + organismId + ". Skipping gene validation.");				
					return ret;
				}
				FSDirectory directory = FSDirectory.open(new File(indexPath));
				reader = IndexReader.open(directory);
				Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_29);
				LOG.error("new completion provider for organism " + organismId);				
				ret = new GeneCompletionProvider(reader, analyzer);
				if(ret != null) {
					completionProviderOrganismIdMap.put(organismId, ret);
				} else {
					LOG.error("null ref: GeneCompletionProvider");
				}
			} catch (CorruptIndexException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return ret;
	}

//	public static void sql2cass(long organismId) {
////		String contextPath = "/java/projects/genemania/website/target/genemania/WEB-INF/applicationContext.xml";
////		ApplicationContext context = new FileSystemXmlApplicationContext(contextPath);
////		SessionFactory factory = (SessionFactory) context.getBean("sessionFactory");
////		Session session = SessionFactoryUtils.getSession(factory, true);
////		TransactionSynchronizationManager.bindResource(factory, new SessionHolder(session));
////		GeneMediator geneMediator = (GeneMediator) context.getBean("geneMediator");
////		CassandraThriftConnector cassandraConnector = new CassandraThriftConnector();
//		List<Gene> allGenes = geneMediator.getAllGenes(6);
//		System.out.println(allGenes.size());
//	}
	
}
