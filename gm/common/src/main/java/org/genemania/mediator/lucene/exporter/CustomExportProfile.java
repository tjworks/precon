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
package org.genemania.mediator.lucene.exporter;

import static org.genemania.mediator.lucene.exporter.Generic2LuceneExporter.NETWORK_NAME;

import java.io.FileReader;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import org.genemania.configobj.ConfigObj;
import org.genemania.configobj.Section;

public class CustomExportProfile implements ExportProfile {

	Set<String> excludedNetworkNames;
	Pattern excludeNetworkPattern;
	
	public CustomExportProfile(String configFileName) throws IOException {
		this.excludedNetworkNames = new HashSet<String>();
		ConfigObj config = new ConfigObj(new FileReader(configFileName));
		Section section = config.getSection("Networks");
		excludedNetworkNames.addAll(section.getEntries("excludeNames"));
		String excludeNetworkPatternString = section.getEntry("excludePattern");
		if (excludeNetworkPatternString != null) {
			excludeNetworkPattern = Pattern.compile(excludeNetworkPatternString);
		}
	}
	
	@Override
	public boolean includesNetwork(String[] networkData) {
		String name = networkData[NETWORK_NAME];
		if (excludedNetworkNames.contains(name)) {
			return false;
		}
		if (excludeNetworkPattern != null && excludeNetworkPattern.matcher(name).matches()) {
			return false;
		}
		return true;
	}
}
