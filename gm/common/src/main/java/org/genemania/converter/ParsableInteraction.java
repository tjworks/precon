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
 * ParsableInteraction: helper class used to convert interaction represented data in text format into a domain object 
 * Created Oct 29, 2009
 * @author Ovi Comes
 */
package org.genemania.converter;

import java.util.Collection;
import java.util.Iterator;

import org.genemania.Constants;
import org.genemania.completion.lucene.GeneCompletionProvider;
import org.genemania.dto.InteractionDto;
import org.genemania.dto.NodeDto;
import org.genemania.exception.ValidationException;
import org.genemania.util.DataConverterUtils;
import org.genemania.util.GeneHelper;
import org.genemania.util.GeneManiaStringUtils;

public class ParsableInteraction implements ParsableEntity {
	
	// __[static]______________________________________________________________
//	private static Logger LOG = Logger.getLogger(ParsableInteraction.class);
	
	// __[attributes]__________________________________________________________
	private long organismId;

	// __[constructors]________________________________________________________
	public ParsableInteraction(long organismId) {
		this.organismId = organismId;
	}
	
	// __[interface implementation]____________________________________________
	public InteractionDto parse(String rawText) throws ValidationException {
		InteractionDto ret = null;
		String separator = Constants.DEFAULT_FIELD_SEPARATOR_TXT;// GeneManiaStringUtils.extractSeparator(rawText);
		Collection<String> fields = DataConverterUtils.getFields(rawText, separator);
		GeneCompletionProvider geneCompletionProvider = GeneHelper.getGeneCompletionProviderFor(organismId);
		Iterator<String> fieldIterator = fields.iterator();
		String fromGeneSymbol = fieldIterator.next();
		String toGeneSymbol = fieldIterator.next();
		double score = 1;
		if(fieldIterator.hasNext()) {
			String scoreStr = fieldIterator.next();
			if(GeneManiaStringUtils.isDoublePrecisionNumber(scoreStr)) {
				score = Double.parseDouble(scoreStr);
				if(score < 0) {
					throw new ValidationException("Invalid score " + score + " in line [" + rawText + "]");
				}
			} else {
				throw new ValidationException("Invalid score " + score + " in line [" + rawText + "]");
			}
		}
		Long fromNodeId = geneCompletionProvider.getNodeId(fromGeneSymbol);
		if(fromNodeId == null) {
			throw new ValidationException("Invalid symbol [" + fromGeneSymbol + "] in line [" + rawText + "]");
		}
		Long toNodeId = geneCompletionProvider.getNodeId(toGeneSymbol);
		if(toNodeId == null) {
			throw new ValidationException("Invalid symbol [" + toGeneSymbol + "] in line [" + rawText + "]");
		}
		ret = new InteractionDto(new NodeDto(fromNodeId), new NodeDto(toNodeId), score);		
		return ret;
	}

}
