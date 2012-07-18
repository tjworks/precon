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
 * DataConverterUtils
 * Created Oct 15, 2008
 * @author Ovi Comes
 */
package org.genemania.util;

import java.io.IOException;
import java.io.LineNumberReader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.exception.ValidationException;
import org.genemania.type.DataLayout;

public class DataConverterUtils {

	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(DataConverterUtils.class);
	
	// __[public helpers]______________________________________________________
	public static DataLayout getDataLayout(String data, GeneCompletionProvider geneCompletionProvider) throws ValidationException, IOException {
		DataLayout ret = DataLayout.UNKNOWN;
		List<String> body = getBody(data);
		if((body != null) && (body.size() > 0)) {
			String firstLine = new LineNumberReader(new StringReader(data)).readLine(); 
			if(firstLine.indexOf(Constants.GEO_PROFILE_SIGNATURE) == 0) {
				ret = DataLayout.GEO_PROFILE;
			} else {
				String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;// GeneManiaStringUtils.extractSeparator(maxLine);
				String mostRepresentativeLine = getMostRepresentativeLine(body, geneCompletionProvider);
				Collection<String> fields = getFields(mostRepresentativeLine , separator);
				Iterator<String> iterator = fields.iterator();
				if(fields.size() < 2) {
					ret = DataLayout.UNKNOWN;
				} else if(fields.size() == 2) {
					String field1 = iterator.next();
					Long node1 = geneCompletionProvider.getNodeId(field1);
					if(node1 != null) {
						String field2 = iterator.next();
						Long node2 = geneCompletionProvider.getNodeId(field2);
						if(node2 != null) {
							ret = DataLayout.BINARY_NETWORK;
						} else {
							if(GeneManiaStringUtils.isDoublePrecisionNumber(field2)) {
								ret = DataLayout.PROFILE;
							} else {
								ret = DataLayout.SPARSE_PROFILE;
							}
						}
					}
				} else if(fields.size() == 3) {
					String field1 = iterator.next();
					Long node1 = geneCompletionProvider.getNodeId(field1);
					if(node1 != null) {
						String field2 = iterator.next();
						String field3 = iterator.next();
						Long node2 = geneCompletionProvider.getNodeId(field2);
						if(node2 != null) {
							if(GeneManiaStringUtils.isDoublePrecisionNumber(field3)) {
								ret = DataLayout.WEIGHTED_NETWORK;
							}
						} else {
							if(GeneManiaStringUtils.isDoublePrecisionNumber(field2) && GeneManiaStringUtils.isDoublePrecisionNumber(field3)) {
								ret = DataLayout.PROFILE;
							} else {
								ret = DataLayout.SPARSE_PROFILE;
							}
						}
					}
				} else {
					String field1 = iterator.next();
					Long node1 = geneCompletionProvider.getNodeId(field1);
					if(node1 != null) {
						boolean allNumbersFlag = true;
						while(iterator.hasNext()) {
							String nextField = iterator.next();
							allNumbersFlag &= GeneManiaStringUtils.isDoublePrecisionNumber(nextField);
						}
						if(allNumbersFlag) {
							ret = DataLayout.PROFILE;
						} else {
							ret = DataLayout.SPARSE_PROFILE;
						}
					}					
				}
			}
		} else {
			LOG.warn("no data");
		}
		return ret;
	}
	
	public static long getTotalLineCount(String data) throws IOException {
		long ret = 0;
		LineNumberReader lnr = new LineNumberReader(new StringReader(StringUtils.trim(data)));
		while(StringUtils.isNotEmpty(lnr.readLine())) {
			ret++;
		}
		return ret;
	}
	
/*	
	public static UserDataHeader getHeader(String data, GeneCompletionProvider geneCompletionProvider) throws IOException, ValidationException {
		UserDataHeader ret = new UserDataHeader(); 
		LineNumberReader lnr = new LineNumberReader(new StringReader(StringUtils.trim(data)));
		String nextLine = lnr.readLine();
		if(nextLine.indexOf(Constants.GEO_PROFILE_SIGNATURE) == 0) {
			boolean commentLine = true;
			while(commentLine) {
				nextLine = lnr.readLine();
				ret.getLines().add(nextLine);
				commentLine = !nextLine.startsWith(Constants.GEO_PROFILE_DATASET_BEGIN_INSTRUCTION); 
			}
			ret.getLines().add(lnr.readLine()); // add the table header line
		} else {
			boolean noGenesInLine = true;
			while(noGenesInLine) {
				String separator = GeneManiaStringUtils.extractSeparator(nextLine);
				if(StringUtils.isNotEmpty(nextLine)) {
					noGenesInLine = true;
					Collection<String> words = getFields(nextLine, separator);
					for(String nextWord: words) {
						Long nodeId = geneCompletionProvider.getNodeId(nextWord);
						if(nodeId != null) {
							noGenesInLine = false;
							break;
						}
					}
					if(noGenesInLine) {
						ret.getLines().add(nextLine);
					}
				}
				nextLine = lnr.readLine();
			}
		}
//		LOG.debug(ret.size() + " line header found");
		return ret;
	}
	
	public static void isValid(String line, GeneCompletionProvider geneCompletionProvider) throws IOException {
		boolean isValid = false;
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT; 
		if(StringUtils.isNotEmpty(line)) {
			isValid = true;
			Collection<String> words = getFields(line, separator);
			for(String nextWord: words) {
				Long nodeId = geneCompletionProvider.getNodeId(nextWord);
				if(nodeId != null) {
					isValid = false;
					break;
				}
			}
		}
		if(!isValid) {
			throw new ValidationException(line, Constants.ERROR_CODES.INVALID_DATA);
		}
	}
*/	
	public static List<String> getBody(String data) throws IOException, ValidationException {
		List<String> ret = new ArrayList<String>();
		LineNumberReader lnr = new LineNumberReader(new StringReader(StringUtils.trim(data)));
		// remove lines without at least one TAB
		String nextLine;
		while(StringUtils.isNotEmpty(nextLine = StringUtils.trim(lnr.readLine()))) {
			if(nextLine.indexOf("\t") > 0) {
				ret.add(nextLine);
			} else {
				LOG.debug("removed non-coding line: " + nextLine);
			}
		}
		
//		// remove lines that don't contain a valid gene symbol in the first or in the second field
//		while(StringUtils.isNotEmpty(nextLine = lnr.readLine())) {
//			boolean isLineValid = false;
//			StringTokenizer st = new StringTokenizer(nextLine, Constants.DEFAULT_FIELD_SEPARATOR_TXT);
//			String firstField = st.nextToken();
//			Long firstNodeId = geneCompletionProvider.getNodeId(firstField);
//			if(firstNodeId != null) {
//				isLineValid = true;
//			} else {
//				String secondField = st.nextToken();
//				Long secondNodeId = geneCompletionProvider.getNodeId(secondField);
//				if(secondNodeId != null) {
//					isLineValid = true;
//				}
//			}
//			if(isLineValid) {
//				ret.add(nextLine);
//			} else {
//				LOG.debug("removed line contain invalid symbol: " + nextLine);
//			}
//		}
		return ret;
	}

	public static Collection<String> getFields(String line, String separator) throws ValidationException {
		Collection<String> ret = new ArrayList<String>();
		if(StringUtils.isEmpty(separator)) {
			throw new ValidationException("invalid field separator");
		}
//		String logSeparator = (separator == "\n") ? "CR" : ((separator == "\t") ? "TAB" : separator);
//		LOG.debug("the separator detected for the line: [" + line + "] was " + "[" + logSeparator + "]");
		StringTokenizer st = new StringTokenizer(line, separator);
		while(st.hasMoreTokens()) {
			ret.add(st.nextToken());
		}
		return ret;
	}

	//todo: needs redesign
	public static void validateOrganism(String rawContent, long organismId) throws ValidationException {
		// init
		try {
			// count the invalid genes in the first column from the first 5 lines for the given organism
			int validSymbols = countInvalidGenes(rawContent, organismId);
			// count the invalid genes in the first column from the first 5 lines for the given organism
			if(validSymbols != Constants.ORGANISM_VALIDATION_CHECK_LINES) {
				for(int i=1; i<=6; i++) {// quick hack, redesign required
					if(i != organismId) {
						validSymbols = countInvalidGenes(rawContent, i);
						if(validSymbols == Constants.ORGANISM_VALIDATION_CHECK_LINES) {
							throw new ValidationException(String.valueOf(i), Constants.ERROR_CODES.INVALID_ORGANISM); 
						}
					}
				}
			}
		} catch (IOException e) {
			throw new ValidationException(e.getMessage());
		}
	}

	// __[private helpers]_____________________________________________________
	private static String[] getMinMaxLines(List<String> bodyLines) throws ValidationException {
		String[] ret = new String[2];
		int minFieldCount = 999;
		int maxFieldCount = 0;
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;// GeneManiaStringUtils.extractSeparator(firstLine);
		for(int i=0; i<bodyLines.size(); i++) {
			String nextLine = bodyLines.get(i);
			Collection<String> fields = getFields(nextLine, separator);
			if((fields.size() < minFieldCount) && (fields.size() > 0)) {
				minFieldCount = fields.size(); 
				ret[0] = nextLine;
			}
			if(fields.size() >= maxFieldCount) {
				maxFieldCount = fields.size(); 
				ret[1] = nextLine;
			}
		}
		// done
//		LOG.debug("min line is [" + ret[0] + "][" + minFieldCount + " fields]");
//		LOG.debug("max line is [" + ret[1] + "][" + maxFieldCount + " fields]");
		return ret;
	}

	private static int countInvalidGenes(String data, long organismId) throws IOException {
		int ret = 0;
		LineNumberReader lnr = new LineNumberReader(new StringReader(StringUtils.trim(data)));
//		// skip first line as it may be a header
//		lnr.readLine();
		GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(organismId);
		for(int i=0; i<Constants.ORGANISM_VALIDATION_CHECK_LINES; i++) {
			String line = lnr.readLine();
			if(StringUtils.isNotEmpty(line)) {
				String separator = GeneManiaStringUtils.extractSeparator(line);
				StringTokenizer st = new StringTokenizer(line, separator);
				String firstField = st.nextToken();
				if((geneCompletionProvider != null) && (geneCompletionProvider.getNodeId(firstField) != null)) {
					ret++;	
				}
			}
		}
		return ret;
	}
	
	private static String getMostRepresentativeLine(List<String> bodyLines, GeneCompletionProvider geneCompletionProvider) throws ValidationException {
		String ret = "";
		boolean lineFound = false;
		boolean eligibleLine = true;
		int maxSymbolsPerLine = 0;
		for(String line: bodyLines) {
			Collection<String> fields = getFields(line, Constants.DEFAULT_FIELD_SEPARATOR_TXT);
			Iterator<String> iterator = fields.iterator();
			int symbolCounter = 0;
			int fieldCounter = 0;
			while(iterator.hasNext()) {
				String field = iterator.next();
				fieldCounter++;
				Long nodeId = geneCompletionProvider.getNodeId(field);
				if(nodeId != null) {
					symbolCounter++;
				}
				// if there are 2 symbols on a line, and the third field is a weight we have a good enough line 
				if((fieldCounter > 2) && (symbolCounter == 2)) {
					if(GeneManiaStringUtils.isDoublePrecisionNumber(field)) {
						eligibleLine = true;
						lineFound = true;
					} else {
						eligibleLine = false;
					}
				}
			}
			if(eligibleLine && (symbolCounter > maxSymbolsPerLine)) {
				maxSymbolsPerLine = symbolCounter;
				ret = line;
			}
			if(lineFound) {
				break;
			}
		}
		return ret;
	}
	
}
