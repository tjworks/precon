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
package org.genemania.util;

import org.genemania.type.DataLayout;

public class UserNetworkConstants {
	public static final String CODE = "uploaded";
	public static final String SOURCE = "uploaded network";
	public static final String NETWORK_DESCRIPTION = "A user-uploaded network";
	public static final String GROUP_DESCRIPTION = "User-uploaded networks";
	public static final String GROUP_NAME = "Uploaded";

	public static String getProcessingDescription(DataLayout layout) {
		switch (layout) {
		case BINARY_NETWORK:
			return "A binary, user-uploaded network";
		case GEO_PROFILE:
			return "A GEO profile, user-uploaded network";
		case PROFILE:
			return "A profile, user-uploaded network";
		case SPARSE_PROFILE:
			return "A sparse profile, user-uploaded network";
		case UNKNOWN:
			return "A user-uploaded network of unknown format";
		case WEIGHTED_NETWORK:
			return "A weighted, user-uploaded network";
		default:
			return "A user-uploaded network";
		}
	}
}
