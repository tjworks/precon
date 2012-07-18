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
 * RelatedGenesRequestMessage: JMS object wrapper for Related Genes request data   
 * Created Jul 17, 2009
 * @author Ovi Comes
 */
package org.genemania.message;


public class RelatedGenesRequestMessage extends RelatedGenesMessageBase {

	// __[static]______________________________________________________________
	private static final long serialVersionUID = 7406472225061579700L;
	
	// __[attributes]__________________________________________________________
	private int pageSize;
	private int pages;
	private String userDefinedNetworkNamespace;

	// __[constructors]________________________________________________________
	public RelatedGenesRequestMessage() {
	}

	// __[accessors]___________________________________________________________
	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}
	
	public int getResultsCount() {
		return pageSize * pages;
	}
	
	public String getUserDefinedNetworkNamespace() {
		return userDefinedNetworkNamespace;
	}

	public void setUserDefinedNetworkNamespace(String userDefinedNetworkNamespace) {
		this.userDefinedNetworkNamespace = userDefinedNetworkNamespace;
	}

	// __[public helpers]______________________________________________________
	@Override
	public String toString() {
		StringBuffer ret = new StringBuffer();
		ret.append(super.toString());
		ret.append(", pageSize=" + pageSize);
		ret.append(", pages=" + pages);
		ret.append(", user-defined network namespace=" + userDefinedNetworkNamespace);
		
		return ret.toString();
	}

	public static RelatedGenesRequestMessage fromXml(String xml) {
		return (RelatedGenesRequestMessage)XS.fromXML(xml);
	}

}
