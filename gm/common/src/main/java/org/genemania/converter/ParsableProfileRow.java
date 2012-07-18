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
 * ParsableProfileRow: helper class used to convert individual gene profiles represented in text format into a domain object 
 * Created Oct 29, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.util.Collection;
import java.util.Iterator;

import org.apache.log4j.Logger;
import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.dto.ProfileRowDto;
import org.genemania.exception.ValidationException;
import org.genemania.type.DataLayout;
import org.genemania.util.DataConverterUtils;
import org.genemania.util.GeneHelper;

public class ParsableProfileRow implements ParsableEntity {
	
	// __[static]______________________________________________________________
	private static Logger LOG = Logger.getLogger(ParsableProfileRow.class);
	
	// __[attributes]__________________________________________________________
	private long organismId;
	private DataLayout dataLayout;

	// __[constructors]________________________________________________________
	public ParsableProfileRow(long organismId, DataLayout dataLayout) {
		this.organismId = organismId;
		this.dataLayout = dataLayout; 
	}
	
	// __[interface implementation]____________________________________________
	public ProfileRowDto parse(String rawText) throws ValidationException {
		ProfileRowDto ret = new ProfileRowDto();
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;// GeneManiaStringUtils.extractSeparator(rawText);
		Collection<String> fields = DataConverterUtils.getFields(rawText, separator);
		GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(organismId);
		Iterator<String> fieldIterator = fields.iterator();
		// for profile and sparse profile formats the symbol is the first field
		String geneSymbol = fieldIterator.next();
		if(DataLayout.GEO_PROFILE.equals(dataLayout)) {// for GEO format the symbol is the second field
			geneSymbol = fieldIterator.next();
		}
		Long nodeId = geneCompletionProvider.getNodeId(geneSymbol);
		if(nodeId == null) {
			throw new ValidationException("Invalid symbol [" + geneSymbol + "] in line [" + rawText + "]");
		}
		ret.setNodeId(nodeId.longValue());
		while(fieldIterator.hasNext()) {
			String nextFeature = fieldIterator.next();
			ret.addFeature(nextFeature);
		}
		return ret;
	}

}
