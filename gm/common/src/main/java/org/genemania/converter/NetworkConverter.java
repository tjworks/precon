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
 * NetworkConverter: Data converter from text format into network model 
 * Created Oct 23, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.dto.InteractionDto;
import org.genemania.dto.NetworkConversionDto;
import org.genemania.dto.NetworkDto;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;
import org.genemania.type.DataLayout;
import org.genemania.util.DataConverterUtils;
import org.genemania.util.GeneHelper;
import org.genemania.util.UidGenerator;

public class NetworkConverter {
	
	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(NetworkConverter.class);
	
	// __[attributes]__________________________________________________________
	private long organismId;
	private GeneCompletionProvider geneCompletionProvider;
	private List<InteractionDto> duplicatedInteractions = new ArrayList<InteractionDto>();
	private List<String> unrecognizedInteractions = new ArrayList<String>();
	
	
	// __[constructors]________________________________________________________
	public NetworkConverter(long organismId) {
		this.organismId = organismId;
		geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(organismId);
	}
	
	// __[accessors]___________________________________________________________
	
	// __[public helpers]______________________________________________________
	public NetworkConversionDto fromString(String rawData) throws ValidationException, SystemException {
		LOG.debug("parsing network data");
		NetworkConversionDto ret = new NetworkConversionDto();
		try {
			DataLayout dataLayout = DataConverterUtils.getDataLayout(rawData, geneCompletionProvider);
			if(DataLayout.UNKNOWN.equals(dataLayout)) {
				throw new ValidationException("Unrecognized data layout", Constants.ERROR_CODES.UNKNOWN_FILE_FORMAT);
			}
			ret.setLayout(dataLayout);
			NetworkDto network = buildNetwork(rawData, dataLayout);
			ret.setNetwork(network);
			ret.setTotalLinesCount(DataConverterUtils.getTotalLineCount(rawData));
			ret.setUnrecognizedLines(unrecognizedInteractions);
			ret.setDuplicatedInteractions(duplicatedInteractions);
		} catch (IOException e) {
			throw new SystemException(e);
		}
		return ret;
	}
	
	// __[private helpers]_____________________________________________________
	private NetworkDto buildNetwork(String data, DataLayout dataLayout) throws IOException, ValidationException {
		NetworkDto ret = new NetworkDto();
		List<String> interactionLines = DataConverterUtils.getBody(data);
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;//GeneManiaStringUtils.extractSeparator(interactionLines.get(0));
		unrecognizedInteractions = new ArrayList<String>();
		switch (dataLayout) {
		case WEIGHTED_NETWORK:
		case BINARY_NETWORK:
			ret = extractNetwork(dataLayout, interactionLines, separator);
			break;
		default:
			break;
		}
		ret.setId(UidGenerator.getInstance().getNegativeUid());
		return ret;
	}

	private NetworkDto extractNetwork(DataLayout dataLayout, List<String> interactionLines, String separator) throws IOException {
		NetworkDto ret = new NetworkDto();
		ParsableInteraction parsableInteraction = new ParsableInteraction(organismId);
		Set<String> uniqueInteractions = new HashSet<String>();  
		for(int i=0; i<interactionLines.size(); i++) {
			String nextLine = interactionLines.get(i);
			try {
				InteractionDto interaction = parsableInteraction.parse(nextLine);
				if(DataLayout.BINARY_NETWORK.equals(dataLayout)) {
					interaction.setWeight(1.0);
				}
				uniqueInteractions.add(interaction.toString());
				ret.addInteraction(interaction);
			} catch (ValidationException e) {
				unrecognizedInteractions.add(e.getMessage());
			}
		}
		LOG.debug(interactionLines.size() + " total lines / " +  ret.getInteractions().size() + " interactions found / " +  unrecognizedInteractions.size() + " unrecognized lines");
//		LOG.debug("Unrecognized lines:");
//		for(int i=0; i<unrecognizedInteractions.size(); i++) {
//			LOG.debug(unrecognizedInteractions.get(i));
//		}
		return ret;
	}
	
}
