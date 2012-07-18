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

/**
 * wrapper class for CoAnnotation Matrix, vector y, and the constant
 * used by CalculateFastWeight
 * see geneMANIASW_V2.pdf for generation
 */
import java.io.Serializable;


import no.uib.cipr.matrix.Matrix;

public class CoAnnotationSet implements Serializable {

    private Matrix coAnnotationMatrix;
    private Matrix BHalf;
    private double constant;

    public CoAnnotationSet(Matrix coAnnotation, Matrix bh, double consta) {
        coAnnotationMatrix = coAnnotation;
        BHalf = bh;
        constant = consta;
    }

    public Matrix GetCoAnnotationMatrix() {
        return coAnnotationMatrix;
    }

    public Matrix GetBHalf() {
        return BHalf;
    }

    public Double GetConstant() {
        return constant;
    }

    public void putCoAnnotationMatrix(Matrix CoAnn) {
        coAnnotationMatrix = CoAnn;
    }

    public void putBHalf(Matrix BelowHalf) {
        BHalf = BelowHalf;
    }

    public void putConstant(Double C) {
        constant = C;
    }
}
