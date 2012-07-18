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

package org.genemania.engine.core;

public class Pair implements Comparable<Pair>{
	
   private final double first;
   private final int second;

   public Pair( double f, int s )
   {
	   this.first = f;
	   this.second = s;
   }

   public double getFirst()
   {
	   return first;
   }
   
   public int getSecond()
   {
	   return second;
   }

	public int compareTo(Pair o) {
		if ( this.first < o.first )
			return -1;
		else if ( this.first == o.first )
			return 0;
		else return 1;	
	}
}
