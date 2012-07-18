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

package org.genemania.engine.core.mania;

import java.util.Collection;
import java.util.Map;
import no.uib.cipr.matrix.Vector;
//import org.genemania.engine.matricks.Vector;
import org.apache.log4j.Logger;
import org.genemania.engine.Constants.CombiningMethod;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.config.Config;
import org.genemania.engine.core.propagation.PropagateLabels;
import org.genemania.engine.core.utils.Normalization;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;
import org.genemania.util.NullProgressReporter;
import org.genemania.util.ProgressReporter;

/*
 * Apply the genemania algorithm with the given params.
 * Data must be in cache files. No input/output conversion
 * or filtering is performed here, minimal dependencies.
 *
 * To use, create an instance, call compute(), then call
 * getters to get the outputs.
 *
 * Alternatively, to compute just the weights and combined kernel,
 * call computeWeights(). The computation of the discriminant using
 * this set of weights can then be done using computeDiscriminant().
 * This may be useful if eg using the same weight matrix for
 * multiple discriminant calculation (eg for equal weighting).
 *
 */
public class CoreMania {

    private static Logger logger = Logger.getLogger(CoreMania.class);
    private DataCache cache;
    private Vector discriminant;
    private SymMatrix combinedKernel;
    private Map<Long, Double> idWeights;
    private ProgressReporter progress;
    
    public CoreMania(DataCache cache, ProgressReporter progress) {
        this.cache = cache;
        this.progress = progress;
    }

    public CoreMania(DataCache cache) {
        this(cache, NullProgressReporter.instance());
    }
    
    /*
     * general use method that performs both network combination and
     * label propagation for the given query parameters.
     */
    public void compute(String namespace, long organismId, Vector labels, CombiningMethod combiningMethod,
    		Collection<Collection<Long>> networkIds, String goCategory, String biasingMethod) throws ApplicationException {

        long t1 = System.nanoTime();

        // network combination
        computeWeights(namespace, organismId, labels, combiningMethod, networkIds);

        // label propagation
        computeDiscriminant(organismId, labels, goCategory, biasingMethod);

        long t2 = System.nanoTime();
        logger.info("total time for compute: " + (t2-t1));
    }

    /*
     * Compute network weighting for the given networks and combining method.
     * A map of the weights and the resulting combined kernel are stored in
     * member fields.
     */
    public void computeWeights(String namespace, long organismId, Vector labels, CombiningMethod combiningMethod, Collection<Collection<Long>> networkIds) throws ApplicationException {
        logger.info("computing weights");

        long t1 = System.nanoTime();
        CalculateNetworkWeights calculator = new CalculateNetworkWeights(namespace, cache, networkIds, (int)organismId, labels,
				combiningMethod, progress);
//        CalculateNetworkWeights calculator = new CalculateNetworkWeights(namespace, cache, networkIds, (int)organismId, labels,
//				combiningMethod, progress);
        calculator.process();

        SymMatrix combinedKernel = calculator.getCombinedMatrix();
        Map<Long, Double> idWeights = calculator.getWeights();

        if (Config.instance().isCombinedNetworkRenormalizationEnabled()) {
            logger.debug("renormalizing combined network");
            Normalization.normalizeNetwork(combinedKernel);
        }

        this.combinedKernel = combinedKernel;
        this.idWeights = idWeights;

	long t2 = System.nanoTime();
        logger.info("time for computeWeights: " + (t2-t1));
    }

    /*
     * Compute the discriminant scores given the vector of labels, and using the
     * combined kernel that was computed from the last call to computeWeights().
     *
     * The resulting discriminant score vector is written is stored in a member field.
     */
    public void computeDiscriminant(long organismId, Vector labels, String goCategory, String biasingMethod) throws ApplicationException {
        logger.info("computing scores");

        long t1 = System.nanoTime();

        Vector discriminant = null;
        if (biasingMethod.equalsIgnoreCase("hierarchy")) {
            logger.info("using GO hierarchy label bias method");
            throw new ApplicationException("hierarchical biasing not implemented");
        }
        else if (biasingMethod.equalsIgnoreCase("average")) {

            logger.info("using average label bias method");
            discriminant = PropagateLabels.process(
                    combinedKernel, labels, progress);

        }
        else {
            throw new ApplicationException("illegal biasing method name");
        }

        this.discriminant = discriminant;

        long t2 = System.nanoTime();
        logger.info("time for computeDiscriminant: " + (t2-t1));

    }

    /**
     * @return the discriminant
     */
    public Vector getDiscriminant() {
        return discriminant;
    }

    /**
     * @return the combinedKernel
     */
    public SymMatrix getCombinedKernel() {
        return combinedKernel;
    }

    /**
     * @return the matrixWeights
     */
    public Map<Long, Double> getMatrixWeights() {
        return idWeights;
    }

    
}
