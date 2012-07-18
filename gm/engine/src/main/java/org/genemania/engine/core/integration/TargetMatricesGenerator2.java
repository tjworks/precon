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

/**
 * parses a query file to generate a GoDataMatrix
 * 
 * Columns of the GoDataMatrix represents to a Gene Ontology term
 * Rows of the GoDataMatrix represents genes in the organism
 * a value of 1 indicates the gene is annotated in term
 * 
 * A map of column id to Gene Ontology id is produced for look up
 * 
 */
import java.util.*;
import java.io.*;

import org.apache.log4j.Logger;
import org.genemania.domain.Gene;
import org.genemania.domain.Organism;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.cache.FileSerializedObjectCache;
import org.genemania.engine.config.Config;
import org.genemania.engine.core.data.NodeIds;
import org.genemania.exception.ApplicationException;
import org.genemania.mediator.GeneMediator;
import org.genemania.mediator.NodeMediator;
import org.genemania.engine.matricks.Matrix;

public class TargetMatricesGenerator2 {

    private Matrix[] targetMatrices;
    private Map<String, Integer>[] goIndexMap;
    private DataCache cache;
    private GeneMediator geneMediator;
//    private Mapping mapping;
    private NodeIds nodeIds;
    public static Logger logger = Logger.getLogger(TargetMatricesGenerator2.class);

    public TargetMatricesGenerator2(GeneMediator geneMediator, NodeMediator nodeMediator) {
        this.geneMediator = geneMediator;
    }

    public TargetMatricesGenerator2(GeneMediator geneMediator, NodeMediator nodeMediator, String cacheDir) {
        this(geneMediator, nodeMediator);
        cache = new DataCache(new FileSerializedObjectCache(cacheDir));
    }

    public void computeTargetMatrices(String file, Organism org) throws ApplicationException {

        try {

            //index 0 -> cellular component
            //index 1 -> biological processes
            //index 2 -> molecular function
            Map<String, Integer> indices = new HashMap<String, Integer>();
            indices.put("cellular_component", 0);
            indices.put("biological_process", 1);
            indices.put("molecular_function", 2);

            targetMatrices = new Matrix[3];
            goIndexMap = new HashMap[3];


            logger.info("filename: " + file);
            Scanner sc = new Scanner(new File(file));


            int[] numTerms = new int[3];
            int matrixRows = -1;
            int index = -1;
            int currentCol = -1;
            int[] colNumber = new int[3];


            loadNodeIds(org);

            matrixRows = nodeIds.getNodeIds().length;

            while (sc.hasNextLine()) {

                String line = sc.nextLine();

                if (line.startsWith("# total generated terms for this species")) {

                    String[] tokens = line.split(" ");
                    numTerms[indices.get(tokens[tokens.length - 3])] = Integer.parseInt(tokens[tokens.length - 1]);

                }
                else if (line.startsWith("# processing terms for ")) {
                    logger.info("Index: " + index);
                    String[] tokens = line.split(" ");

                    index = indices.get((tokens[tokens.length - 1]));

                    targetMatrices[index] = Config.instance().getMatrixFactory().sparseMatrix(matrixRows, numTerms[index]);
                    goIndexMap[index] = new HashMap<String, Integer>();
                    currentCol = 0;

                }
                else if (line.startsWith("#")) {
                    continue;
                }
                else {

                    String[] tokens = line.split("\t");
                    String[] symbols = new String[tokens.length - 1];
                    for (int i = 0; i < symbols.length; i++) {
                        symbols[i] = tokens[i + 1];
                    }
                    List<String> identifiers = Arrays.asList(symbols);
                    identifiers.remove(tokens[0]);
                    goIndexMap[index].put(tokens[0], currentCol);
                    int k = 0;

                    // try cached lookups instead of using geneMediator.getGenes() every time
                    // old code commented out below
                    for (String identifier: identifiers) {
                        Integer rowIndex = lookupSymbol(org, identifier);
                        if (rowIndex != null) {
                            targetMatrices[index].set(rowIndex.intValue(), currentCol, 1);
                            k++;
                        }
                    }

                    /* old slow lookup code ... check for correctness
                    List<Gene> genes = geneMediator.getGenes(identifiers, org.getId());

                    for (Gene g : genes) {
                    int nodeID = (int)g.getNode().getId();
                    int rowIndex = mapping.getIndexForUniqueId(nodeID);
                    if (rowIndex != -1) {
                    targetMatrices[index].set(rowIndex, currentCol, 1);
                    k++;
                    }
                    }
                     */

                    colNumber[index] = currentCol;
                    currentCol++;
                }
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }


    private void loadNodeIds(Organism org) throws ApplicationException {
        nodeIds = cache.getNodeIds(org.getId());
    }
    
    public Matrix[] getMatrices() {
        return targetMatrices;
    }

    public Map<String, Integer>[] getGoIndexMap() {
        return goIndexMap;
    }
    /*
     * So symbol strings are used to lookup genes, from genes we
     * lookup nodes, and then use the node id to lookup the corresponding
     * index for that gene in our network matrices. This function
     * does the lookup, and as an optimization stores the
     * symbol string -> matrix index map because the db queries aren't
     * the fastest thing in the world, and the mapping table ought to
     * be small enough to comfortably fit in memory.
     *
     * this function returns null for symbols that could not be found.
     *
     * note we always put and check upper case for the cache, so search
     * is safely case insensitive
     *
     * TODO: this is quickly copied out of VectorCrossValidator, move to a common class
     */
    private long cachedSymbolsForOrganismId = -1;
    private Map<String, Integer> symbolToIndexCache = new HashMap<String, Integer>();
    private static final int SYMBOL_NOT_FOUND = -1;

    private Integer lookupSymbol(Organism organism, String symbol) {

        // quick safety check, we only cache symbols for one organism, make sure
        // the cache matches the requested organism (else flush)
        if (cachedSymbolsForOrganismId == -1) {
            cachedSymbolsForOrganismId = organism.getId();
        }
        else if (cachedSymbolsForOrganismId != organism.getId()) {
            logger.warn("got a different organism, flushing sybol cache");
            Map<String, Integer> symbolToIndexCache = new HashMap<String, Integer>();
            cachedSymbolsForOrganismId = organism.getId();
        }

        // check cache first
        Integer index = symbolToIndexCache.get(symbol.toUpperCase());

        // look in db if not found
        if (index == null) {
            Gene gene = geneMediator.getGeneForSymbol(organism, symbol);
            if (gene == null) {
                // not in db either, put a marker in the cache
                logger.info("symbol not in db: " + symbol);
                symbolToIndexCache.put(symbol.toUpperCase(), SYMBOL_NOT_FOUND);
            }
            else {
                // we got the gene, look up index, and again mark the
                // cache if not found. otherwise, cache it
                int nodeId = (int) gene.getNode().getId();

                try {
                    index = nodeIds.getIndexForId(nodeId);
                    symbolToIndexCache.put(symbol.toUpperCase(), index);
                }
                catch (ApplicationException e) {
                    logger.warn("gene not in mappings for " + gene.getSymbol());
                    symbolToIndexCache.put(symbol.toUpperCase(), SYMBOL_NOT_FOUND);
                    index = null;
                }
            }
        }
        else if (index == SYMBOL_NOT_FOUND) {
            index = null;
        }

        return index;
    }

    /*
     * convert map for one of the branches to an array so that array[index]=goterm
     */
    public static String [] getGoIndicesArray(Map<String, Integer> map) {
        String [] result = new String[map.size()];

        for (String term: map.keySet()) {
            int idx = map.get(term);
            result[idx] = term;
        }

        return result;
    }

}
