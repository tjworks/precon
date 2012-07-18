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
 * Txt2Network: Data converter from tab delimited text files into network model and vice-versa 
 * Created Sep 22, 2008
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.io.File;
import java.io.IOException;
import java.io.LineNumberReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.dto.InteractionDto;
import org.genemania.dto.NodeDto;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;
import org.genemania.util.ApplicationConfig;

/** @Deprecated use NetworkConverter */
public class Txt2Network {

	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(Txt2Network.class);
	
	// __[attributes]__________________________________________________________
	private GeneCompletionProvider geneCompletionProvider;
	private long organismId;
	private List<String> unrecognizedInteractions = new ArrayList<String>();
	private int lineCounter;
	private boolean indexLoaded = false;
	
	// __[constructors]________________________________________________________
	public Txt2Network() {
	}
	
	public Txt2Network(long organismId) {
		this.organismId = organismId;
		load(organismId);
	}
	
	// __[accessors]___________________________________________________________
	public long getOrganismId() {
		return organismId;
	}

	public void setOrganismId(long organismId) {
		this.organismId = organismId;
		load(organismId);
	}

	public GeneCompletionProvider getGeneCompletionProvider() {
		return geneCompletionProvider;
	}

	public void setGeneCompletionProvider(GeneCompletionProvider geneCompletionProvider) {
		this.geneCompletionProvider = geneCompletionProvider;
	}

	// __[public interface]____________________________________________________
//	public NetworkConversionDto text2network(String networkName, String text) throws ValidationException, SystemException {
//		ProfilingUtils.addStartMarker("text2model");
//		// ini
//		NetworkConversionDto ret = new NetworkConversionDto();
//		ret.setNetworkName(networkName);
//		// validate
//		DataLayout dataLayout = validate(text);
//		// create interactions
//		if(!DataLayout.UNKNOWN.equals(dataLayout)) {
//			List<InteractionVO> interactions = buildInteractions(text);
//			// create network
//			NetworkVO network = new NetworkVO();
//			network.setId(-(System.currentTimeMillis()<<1));
//			network.setInteractions(interactions);
//			ret.setNetwork(network);
//			ret.setUnrecognizedLines(unrecognizedInteractions);
//			ret.setTotalLinesCount(lineCounter);
//			//done
//			ProfilingUtils.addStopMarker("text2model");
//			ProfilingUtils.printMetrics();
//		}
//		return ret;
//	}

	// __[private helpers]_____________________________________________________
	private void load(long organismId) {
		if(!indexLoaded) {
			IndexReader reader;
			try {
				String geneIndexDir = ApplicationConfig.getInstance().getProperty(Constants.CONFIG_PROPERTIES.GENE_INDEX_DIR);
				LOG.debug("geneIndexDir=" + geneIndexDir);
				String indexPath = geneIndexDir + File.separator + organismId;
				File f = new File(indexPath);
				if(!f.exists()) {
					LOG.warn("no gene index for organism id=" + organismId + ". Skipping gene validation.");				
					return;
				}
				FSDirectory directory = FSDirectory.open(new File(indexPath));
				reader = IndexReader.open(directory);
				Set<String> stopWords = new HashSet<String>();
				stopWords.add(";");
				Analyzer analyzer = new StandardAnalyzer(Version.LUCENE_29, stopWords);
//				Analyzer analyzer = new SimpleAnalyzer();
				geneCompletionProvider = new GeneCompletionProvider(reader, analyzer);
			} catch (CorruptIndexException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			indexLoaded = true;
		}
	}
	
//	private DataLayout validate(String text) throws SystemException, ValidationException {
//		DataLayout ret = DataConverterUtils.getDataLayout(text, geneCompletionProvider);
//		// check table header
//		LineNumberReader lnr = new LineNumberReader(new StringReader(text)); 
//		String firstLine;
//		try {
//			firstLine = lnr.readLine();
//			StringTokenizer st = new StringTokenizer(firstLine, "\t");
//			int columns = st.countTokens();
//			if (columns != 3) {
//				throw new ValidationException(Constants.ERROR_CODES.UNKNOWN_FILE_FORMAT);
//			}
//		} catch (IOException x) {
//			throw new SystemException(x);
//		}
//		return ret;
//	}

	private List<InteractionDto> buildInteractions(String text) throws ValidationException, SystemException {
		// ini
		List<InteractionDto> ret = new ArrayList<InteractionDto>();
		LineNumberReader lnr = new LineNumberReader(new StringReader(text)); 
		String nextLine = "";
		lineCounter = 0;
		unrecognizedInteractions = new ArrayList<String>();
		try {
			if(lnr.markSupported()) {
				lnr.mark(9999);
			} else {
				LOG.warn("mark not supporterd on the test stream");
			}
			nextLine = lnr.readLine();
			String header = getHeader(nextLine);
			if(header != null) {
				LOG.debug("header detected: " + header);
				nextLine = lnr.readLine();
			} else {
				LOG.debug("no header detected");
			}
			// process the rest of the file
			while(StringUtils.isNotEmpty(nextLine)) {
				lineCounter++;
				StringTokenizer st = new StringTokenizer(nextLine, "\t");
				String fromGeneSymbol = st.nextToken();
				String toGeneSymbol = st.nextToken();
				float score = Float.parseFloat(st.nextToken());
				Long fromNodeId = geneCompletionProvider.getNodeId(fromGeneSymbol);
				Long toNodeId = geneCompletionProvider.getNodeId(toGeneSymbol);
				if((fromNodeId != null) && (toNodeId != null)) {
					InteractionDto interaction = new InteractionDto(new NodeDto(fromNodeId), new NodeDto(toNodeId), score);
					ret.add(interaction);
				} else {
					unrecognizedInteractions.add(nextLine);
				}
				nextLine = lnr.readLine();
			}
		} catch (NumberFormatException e) {
			throw new ValidationException("The last column of the line [" + nextLine + "] should contain a number", Constants.ERROR_CODES.INVALID_DATA);
		} catch (IOException x) {
			throw new SystemException(x);
		}
		// done
		return ret;
	}

	private String getHeader(String line) {
		String ret = null;
		StringTokenizer st = new StringTokenizer(line);
		if(st.countTokens() > 3) {
			ret = line;
		}
		return ret;
	}

}
