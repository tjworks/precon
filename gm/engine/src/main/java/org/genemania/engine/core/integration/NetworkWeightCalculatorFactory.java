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

package org.genemania.engine.core.integration;

import org.genemania.engine.core.integration.calculators.AutomaticCalculator;
import org.genemania.engine.core.integration.calculators.AverageByCategoryCalculator;
import org.genemania.engine.core.integration.calculators.BranchSpecificCalculator;
import org.genemania.engine.core.integration.calculators.AverageByNetworkCalculator;
import java.util.Collection;
//import org.genemania.engine.matricks.Vector;
import no.uib.cipr.matrix.Vector;
import org.genemania.engine.Constants.CombiningMethod;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.integration.calculators.AutomaticFastCalculator;
import org.genemania.engine.core.integration.calculators.AutomaticRelevanceCalculator;
import org.genemania.exception.ApplicationException;
import org.genemania.util.ProgressReporter;

/**
 * return an appropriate weight calculator class, based
 * on the passed parameters
 */
public class NetworkWeightCalculatorFactory {
    
    public static INetworkWeightCalculator getCalculator(String namespace,
            DataCache cache, Collection<Collection<Long>> networkIds,
            int organismId, Vector label, CombiningMethod method, ProgressReporter progress) throws ApplicationException {

        // big if statement for now, maybe later a registry?
        if (method == CombiningMethod.AVERAGE) {
            return new AverageByNetworkCalculator(namespace, cache, networkIds, organismId, label, progress);
        }
        else if (method == CombiningMethod.AVERAGE_CATEGORY) {
            return new AverageByCategoryCalculator(namespace, cache, networkIds, organismId, label, progress);
        }
        else if (method == CombiningMethod.AUTOMATIC_RELEVANCE) {
            return new AutomaticRelevanceCalculator(namespace, cache, networkIds, organismId, label, progress);
        }
        else if (method == CombiningMethod.AUTOMATIC) {
            return new AutomaticCalculator(namespace, cache, networkIds, organismId, label, progress);
        }
        else if (method == CombiningMethod.BP || method == CombiningMethod.CC ||
                method == CombiningMethod.MF) {
            return new BranchSpecificCalculator(namespace, cache, networkIds, organismId, label, method, progress);
        }
        else if (method == CombiningMethod.AUTOMATIC_FAST) {
            return new AutomaticFastCalculator(cache, networkIds, organismId, label, progress);
        }
        else {
            throw new ApplicationException("don't know how to calculate combining method: " + method);
        }
    }
}
