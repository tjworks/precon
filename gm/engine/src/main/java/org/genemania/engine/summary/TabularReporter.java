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

package org.genemania.engine.summary;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.genemania.exception.ApplicationException;

import au.com.bytecode.opencsv.CSVWriter;

public class TabularReporter implements Reporter {
	
	public static final String ENCODING = "UTF8";
	public static final char FIELD_SEP = '\t';
	public static final char QUOTE_CHAR = CSVWriter.NO_QUOTE_CHARACTER;
	
	File file;
	CSVWriter writer;
	List<String> fieldNames;
	
	public TabularReporter(String location) throws IOException {
		file = new File(location);
		File dir = file.getParentFile();
		if (dir != null && !dir.isDirectory() && !dir.exists()) {
			dir.mkdirs();
		}
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), ENCODING));
		writer = new CSVWriter(out, FIELD_SEP, QUOTE_CHAR);
	}

	public void init(List<String> fieldNames) throws ApplicationException {
		this.fieldNames = fieldNames;
		writeHeader();
	}

	public void init(String ... fieldNames) throws ApplicationException {
		this.fieldNames = Arrays.asList(fieldNames);
		writeHeader();
	}
	
	void writeHeader() throws ApplicationException {
		write(fieldNames);
	}
	
	public void write(List<String> fieldValues) throws ApplicationException {
		if (fieldValues.size() != fieldNames.size()) {
			throw new ApplicationException("invalid record length");
		}
		
		write(fieldValues.toArray(new String[fieldValues.size()]));
	}
	
	public void write(String ... fieldValues) throws ApplicationException {
		if (fieldValues.length != fieldNames.size()) {
			throw new ApplicationException("invalid record length");
		}

		writer.writeNext(fieldValues);
	}

	public void write(Map<String, String> record) {
	}

	public void close() throws ApplicationException {
		try {
			writer.close();
		} catch (IOException e) {
			throw new ApplicationException("failed to close", e);
		}
	}

	public String getReportName() {
		return file.getName();
	}
}
