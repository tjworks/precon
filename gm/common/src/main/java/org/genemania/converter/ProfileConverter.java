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
 * ProfileConverter: Data converter from text format into network model 
 * Created Oct 29, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.dto.ProfileConversionDto;
import org.genemania.dto.ProfileDto;
import org.genemania.dto.ProfileRowDto;
import org.genemania.exception.SystemException;
import org.genemania.exception.ValidationException;
import org.genemania.type.DataLayout;
import org.genemania.util.DataConverterUtils;
import org.genemania.util.GeneHelper;
import org.genemania.util.UidGenerator;


public class ProfileConverter {
	
	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(ProfileConverter.class);
	
	// __[attributes]__________________________________________________________
	private long organismId;
	private GeneCompletionProvider geneCompletionProvider;
	private List<String> unrecognizedRows;  
	
	// __[constructors]________________________________________________________
	public ProfileConverter(long organismId) {
		this.organismId = organismId;
		geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(organismId);
	}
	
	// __[accessors]___________________________________________________________
	
	// __[public helpers]______________________________________________________
	public ProfileConversionDto fromString(String rawData) throws ValidationException, SystemException {
		ProfileConversionDto ret = new ProfileConversionDto();
		try {
			DataLayout dataLayout = DataConverterUtils.getDataLayout(rawData, geneCompletionProvider);
			if(DataLayout.UNKNOWN.equals(dataLayout)) {
				throw new ValidationException("Unrecognized data layout", Constants.ERROR_CODES.UNKNOWN_FILE_FORMAT);
			}
			ret.setLayout(dataLayout);
			ProfileDto profile = buildProfile(rawData, dataLayout);
			ret.setProfile(profile);
			ret.setTotalLinesCount(profile.getIndividualGeneProfiles().size() + unrecognizedRows.size());
			ret.setUnrecognizedLines(unrecognizedRows);
		} catch (IOException e) {
			throw new SystemException(e);
		}
		return ret;
	}
	
	// __[private helpers]_____________________________________________________
	private ProfileDto buildProfile(String data, DataLayout dataLayout) throws IOException, ValidationException {
		ProfileDto ret = new ProfileDto();
		List<String> profileRows = DataConverterUtils.getBody(data);
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;// GeneManiaStringUtils.extractSeparator(profileRows.get(0));
		unrecognizedRows = new ArrayList<String>();
		switch (dataLayout) {
			case PROFILE:
			case SPARSE_PROFILE:
			case GEO_PROFILE:
				ret = extractProfile(profileRows, separator, dataLayout);
				break;
			default:
				break;
		}
		ret.setId(UidGenerator.getInstance().getNegativeUid());
		return ret;
	}
	
	private ProfileDto extractProfile(List<String> rows, String separator, DataLayout dataLayout) throws IOException {
		ProfileDto ret = new ProfileDto();
		ParsableProfileRow parsableProfileRow = new ParsableProfileRow(organismId, dataLayout);
		// first pass - parse lines
		LOG.debug("extracting profile, estimated time: " + rows.size()/6000 + " minutes");
		LOG.debug("extract profile step 1/2");
		List<ProfileRowDto> profileRows = new ArrayList<ProfileRowDto>();
		int maxNrOfFeatures = 0;
		for(int i=0; i<rows.size(); i++) {
			String nextRow = rows.get(i);
			try {
				ProfileRowDto profileRow = parsableProfileRow.parse(nextRow);
				profileRows.add(profileRow);
				if(profileRow.getFeatures().size() > maxNrOfFeatures) {
					maxNrOfFeatures = profileRow.getFeatures().size();
				}
			} catch (ValidationException e) {
				unrecognizedRows.add(e.getMessage());
			}
		}
		// second pass - complete missing features
		LOG.debug("extract profile step 2/2");
		for(int i=0; i<profileRows.size(); i++) {
			ProfileRowDto nextProfileRow = profileRows.get(i);
			int missingFeatures = maxNrOfFeatures - nextProfileRow.getFeatures().size();
			if(missingFeatures > 0) {
				LOG.debug("padding profile row with " + missingFeatures + " missing feature(s)");
				for(int j=0; j<missingFeatures; j++) {
					nextProfileRow.addFeature("");
				}
			}
		}
		// populate the return object
		ret.setIndividualGeneProfiles(profileRows);
		LOG.debug("extract profile done.");
		return ret;
	}
	
}
