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

package org.genemania.engine.core.propagation;

import no.uib.cipr.matrix.DenseVector;
import no.uib.cipr.matrix.Vector;
import no.uib.cipr.matrix.sparse.CG;
import no.uib.cipr.matrix.sparse.IterativeSolverNotConvergedException;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants;
import org.genemania.engine.core.MatrixUtils;

import org.genemania.engine.matricks.Matrix;
//import org.genemania.engine.matricks.Vector;
import org.genemania.engine.exception.PropagationFailedException;
import org.genemania.engine.matricks.MatricksException;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.engine.matricks.mtj.SymWrap;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * This class performs labeling biasing and label propagation.
 *
 * if we want to make this interruptable (via the progress reporter),
 * we'll need to implement our own CG code. since this doesn't seem to
 * be timeconsuming step at this time, we won't try that yet.
 */
public class PropagateLabels {
	
	private static Logger logger = Logger.getLogger(PropagateLabels.class);

	/**
	 * Returns a propagated vector. This uses average biasing for label biasing.
	 * Any unknowns get (N+ - N-) / (N+ + N-) where N+ is the number of positives 
	 * and N- is the number of negatives
	 */
	public static Vector process(SymMatrix network, Vector labels, ProgressReporter progress) throws ApplicationException {
                progress.setStatus(Constants.PROGRESS_SCORING_MESSAGE);
                progress.setProgress(Constants.PROGRESS_SCORING);
		int n = network.numCols();
		// TODO: verify input sizes match
		
		DenseVector score = new DenseVector(n);
                //Vector score = Config.instance().getMatrixFactory().denseVector(n);

		setLabelBiases(labels);
                
                inplaceIPLTransform(network);
                try {
                    // TODO: control max iterations

                    // TODO: change interface to accept symmatrix instead of matrix?
                    SymWrap w = new SymWrap(network);
                    CG cg = new CG(new DenseVector(labels.size()));
                    cg.solve(w, labels, score);
                    //network.CG(labels, score);
                }
                catch (IterativeSolverNotConvergedException e) {
                    throw new PropagationFailedException("Label propagation failed", e);
                }

                finally {
                    inplaceUndoIPLTransform(network);
                }

		
		return score;
	}
	
	
	static void setLabelBiases(Vector labels) {
                //System.out.println("labels: " + labels);
		int n_pos = MatrixUtils.countMatches(labels, 1.0d);
		int n_neg = MatrixUtils.countMatches(labels, -1.0d);
		//int n_pos = labels.countMatches(1.0d);
		//int n_neg = labels.countMatches(-1.0d);
		
		double bias = (n_pos - n_neg) * 1.0d / ( (n_pos + n_neg) * 1.0d );
                logger.info(String.format("setting label biases, npos: %s, nneg %s, bias: %s", n_pos, n_neg, bias));
		MatrixUtils.setMatches(labels, Constants.EXCLUDED_ROW_VALUE, bias);
		//labels.findReplace(Constants.EXCLUDED_ROW_VALUE, bias);
                //System.out.println("labels after: " + labels);

	}
	
	/**
	 * m <- I - L == I - D + m
         *
         * not used, since we do an in-place transform to save memory
	 *
         * Returns a newly allocated matrix, the original is unhcanged.
	 * @param m
	 * @throws Exception
	 */
//	static Matrix createIPlusLaplacian(Matrix m) throws Exception {
//		Vector sums = m.rowSums();
//
//		Matrix m2 = new FlexCompColMatrix(m);
//		m2.scale(-1d);
//		for (int i=0; i<m.numRows(); i++) {
//			m2.setDouble(i, i, 1.0d + sums.getDouble(i)); // diagonal term of m is zero, so don't need to include -m.get(i,i)
//		}
//
//		//return new CompColMatrix(m2); // TODO: this conversion performs poorly on large matrices so
//										// removed for now. investigate.
//		return m2;
//	}

        /*
         * as createIPlusLaplacian(), but convert the given matrix in-place
         * instead of allocating a new matrix.
         */
        static void inplaceIPLTransform(Matrix m) throws MatricksException {
//            Vector sums = m.rowSums();
            DenseVector sums = new DenseVector(m.numRows());
            m.rowSums(sums.getData());
            m.scale(-1d);
		for (int i=0; i<m.numRows(); i++) {
			m.set(i, i, 1.0d + sums.get(i)); // diagonal term of m is zero, so don't need to include -m.get(i,i)
		}
        }

        /*
         * undo the change made by inplaceIPLTransform(), the result
         * is the same as the original matrix m. for memory optimization
         */
        static void inplaceUndoIPLTransform(Matrix m) throws MatricksException {
		for (int i=0; i<m.numRows(); i++) {
			m.set(i, i, 0);
		}
                m.scale(-1d);
        }
}
