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

package org.genemania.engine.apps;

import java.io.File;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.genemania.engine.matricks.Matrix;

import org.apache.log4j.Logger;
import org.genemania.domain.Organism;
import org.genemania.mediator.GeneMediator;
import org.genemania.mediator.NetworkMediator;
import org.genemania.mediator.OrganismMediator;
import org.genemania.mediator.NodeMediator;
import java.util.Map;
import org.genemania.util.NullProgressReporter;
import org.genemania.util.ProgressReporter;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.kohsuke.args4j.Option;
import no.uib.cipr.matrix.DenseMatrix;
import org.genemania.engine.Constants;
import org.genemania.engine.Constants.DataFileNames;
import org.genemania.engine.cache.DataCache;
import org.genemania.engine.core.data.CoAnnotationSet;
import org.genemania.engine.core.data.DatasetInfo;
import org.genemania.engine.core.data.CombinedNetwork;
import org.genemania.engine.core.data.Data;
import org.genemania.engine.core.data.GoAnnotations;
import org.genemania.engine.core.data.GoIds;
import org.genemania.engine.core.data.KtK;
import org.genemania.engine.core.data.KtT;
import org.genemania.engine.core.data.NetworkIds;
import org.genemania.engine.core.integration.CalculateFastWeights2;
import org.genemania.engine.core.integration.MakeKtK2;
import org.genemania.engine.core.integration.TargetMatricesGenerator2;
import org.genemania.engine.core.mania.CalculateNetworkWeights;
import org.genemania.engine.matricks.SymMatrix;
import org.genemania.exception.ApplicationException;

/**
 * Generates and Stores the following in Cache
 * Computes the KtK and Ktt Matrix used by Simultaneous Weighting
 * Computes a map of NetworkId to weights generated for Simultaneous Weighting
 * Generates 3 Matrix where rows are genes and columns are GO categories
 * Generates a map of column number of the matrices above to GO id
 * 
 * When running this separately please set heap space to be over 4G for the GeneMania database
 * and make sure query files follow the requirements of TargetMatricesGenerator as it parse 
 * some comment lines.
 */
public class FastWeightCacheBuilder extends AbstractEngineApp {

    private static Logger logger = Logger.getLogger(FastWeightCacheBuilder.class);

    @Option(name = "-qdir", usage = "name of file name containing positiver go terms")
    private static String queryDir;

    @Option(name="-orgId", usage = "optional organism id, otherwise will process all oganisms")
    private static int orgId = -1;

    public static String METHOD_FAST = "FAST";
    public static String METHOD_SIMPLE = "SIMPLE";
    @Option(name="-method", usage = "computation core: fast or simple, defaults to fast")
    private String method = METHOD_SIMPLE;
    
    public NodeMediator getNodeMediator() {
        return nodeMediator;
    }

    public void setNodeMediator(NodeMediator nodeMediator) {
        this.nodeMediator = nodeMediator;
    }

    public OrganismMediator getOrganismMediator() {
        return organismMediator;
    }

    public void setOrganismMediator(OrganismMediator organismMediator) {
        this.organismMediator = organismMediator;
    }

    public NetworkMediator getNetworkMediator() {
        return networkMediator;
    }

    public void setNetworkMediator(NetworkMediator networkMediator) {
        this.networkMediator = networkMediator;
    }

    public GeneMediator getGeneMediator() {
        return geneMediator;
    }

    public void setGeneMediator(GeneMediator geneMediator) {
        this.geneMediator = geneMediator;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public void setCache(DataCache cache) {
        this.cache = cache;
    }

    public DataCache getCache() {
        return this.cache;
    }
    
    /**
     * produce all the cache files for a given organism. first the mapping from
     * matrix index's to GMID's is produced by scanning over the networks, next
     * each network is converted to matrix form.
     *
     * @param organism
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public void processAllOrganisms() throws Exception {
        processAllOrganisms(NullProgressReporter.instance());
    }

    public void processAllOrganisms(ProgressReporter progress) throws Exception {
        try {
            for (Organism organism: organismMediator.getAllOrganisms()) {
                processOrganism(organism, progress);
            }
        }
        finally {
        }
    }

    public void processOrganism(int organismId, ProgressReporter progress) throws Exception {
        Organism organism = organismMediator.getOrganism(organismId);
        processOrganism(organism, progress);
    }

    public void processOrganism(Organism organism, ProgressReporter progress) throws Exception {
        TargetMatricesGenerator2 labelsGenerator = new TargetMatricesGenerator2(geneMediator, nodeMediator, getCacheDir());
        logger.info("getting labels from file");
        labelsGenerator.computeTargetMatrices(queryDir + File.separator + organism.getId() + ".txt", organism);
        Matrix[] labels = labelsGenerator.getMatrices();
        Map[] goIndexMap = labelsGenerator.getGoIndexMap();

        buildFastWeightDataForOrganism(organism, labels, goIndexMap, progress);
    }
    
    public void buildFastWeightDataForOrganism(Organism organism, Matrix [] labels, Map[] goIndexMap, ProgressReporter progress) throws Exception {
        logger.info("processing organism " + organism.getId() + " " + organism.getName());
        
        Collection<Collection<Long>> groupedIdList = getAllNetworks(organism);
        int numNetworks = count(groupedIdList);

        NetworkIds networkIds = makeNetworkIds(organism, groupedIdList);
        cache.putNetworkIds(networkIds);
        
        logger.info("Number of Network is : " + numNetworks);



        DatasetInfo info = cache.getDatasetInfo(organism.getId());

        int numGenes = info.getNumGenes(); 
        if (numGenes != labels[0].numRows()) { 
            throw new ApplicationException("data inconsistency");
        }
        
        DenseMatrix basicKtK = new DenseMatrix(numNetworks + 1, numNetworks + 1);
        CalculateFastWeights2.computeBasicKtK(cache, organism.getId(), networkIds.getNetworkIds(), basicKtK, numGenes, NullProgressReporter.instance());
        KtK ktk = new KtK(Data.CORE, organism.getId(), DataFileNames.KtK_BASIC.getCode());
        ktk.setData(basicKtK);
        cache.putKtK(ktk);
        
        for (int goBranchNum = 0; goBranchNum < Constants.goBranches.length; goBranchNum++) {
            processGoBranch(organism, labels[goBranchNum], basicKtK, goBranchNum, info, networkIds, goIndexMap[goBranchNum], groupedIdList);            
        }
        
        // update the little summary counts
        cache.putDatasetInfo(info);

    }

    private void processGoBranch(Organism organism, Matrix labels, DenseMatrix basicKtK, int goBranchNum, 
            DatasetInfo info, NetworkIds networkIds, Map goIndexMap, Collection<Collection<Long>> groupedIdList) throws ApplicationException {
            logger.info("processing branch: " + Constants.goBranches[goBranchNum]);

            CoAnnotationSet annoSet = buildBranchCoannoSet(organism, labels, basicKtK, goBranchNum, info, goIndexMap);
            
            int numCategories = labels.numCols();

            // setup an appropriately scaled KtK, and compute KtT
            DenseMatrix KtK = basicKtK.copy();
            KtK.scale(numCategories);
            DenseMatrix Ktt = new DenseMatrix(KtK.numRows(), 1);

            CalculateFastWeights2.computeKtT(cache, organism.getId(), labels, networkIds.getNetworkIds(), Ktt, annoSet, NullProgressReporter.instance());
            KtT kttData = new KtT(Data.CORE, organism.getId(), Constants.goBranches[goBranchNum]);
            kttData.setData(Ktt);
            cache.putKtT(kttData);

            // build branch weights ... this is being superceded by NetworkPrecombiner
            //precomputeBranchWeights(organism, labels, KtK, Ktt, goBranchNum, networkIds, groupedIdList);
    }

    /*
     * setup data structures needed for annotation based combining
     */
    private CoAnnotationSet buildBranchCoannoSet(Organism organism, Matrix labels, DenseMatrix basicKtK, int goBranchNum,
            DatasetInfo info, Map goIndexMap) throws ApplicationException {
            int numCategories = labels.numCols();
            info.getNumCategories()[goBranchNum] = numCategories;

            GoAnnotations goAnnos = new GoAnnotations(organism.getId(), Constants.goBranches[goBranchNum]);
            goAnnos.setData(labels);
            cache.putGoAnnotations(goAnnos);

            GoIds goIds = new GoIds(organism.getId(), Constants.goBranches[goBranchNum]);
            goIds.setGoIds(TargetMatricesGenerator2.getGoIndicesArray(goIndexMap));
            cache.putGoIds(goIds);

            CoAnnotationSet annoSet;
            if (method.equalsIgnoreCase(METHOD_FAST)) {
//                logger.info("computing coannotation set using fast method");
//                annoSet = CalculateFastWeights2.FastCoAnnotation(labels[i]);
                throw new ApplicationException("METHOD_FAST not supported ... wasn't that fast either");
            }
            else if (method.equalsIgnoreCase(METHOD_SIMPLE)) {
                logger.info("computing coannotation set using simple method");
                annoSet = CalculateFastWeights2.simpleComputeCoAnnoationSet(organism.getId(), Constants.goBranches[goBranchNum], labels);
            }
            else {
                throw new ApplicationException("unknown method: " + method);
            }

            cache.putCoAnnotationSet(annoSet);
            return annoSet;
        
    }

    private void precomputeBranchWeights(Organism organism, Matrix labels, DenseMatrix KtK, DenseMatrix Ktt, int goBranchNum,
            NetworkIds networkIds, Collection<Collection<Long>> groupedIdList) throws ApplicationException {

        Map<Long, Double> weightMap = null;
        try {
            weightMap = CalculateFastWeights2.SolveForWeights(KtK, Ktt, makeIndexToNetworkIdMap(networkIds), NullProgressReporter.instance());
            logger.info("number of weighted networks for organism " + organism.getId() + " go branch " + Constants.goBranches[goBranchNum] + ": " + weightMap.size());
        }
        catch (Exception e) {
            logger.warn("All networks Eliminated for " + Constants.goBranches[goBranchNum] + " of " + organism.getName() + " using average", e);
            CalculateNetworkWeights calculator = new CalculateNetworkWeights(cache, groupedIdList, (int) organism.getId(), null, Constants.getCombiningMethod("average"), NullProgressReporter.instance());
            calculator.process();
            weightMap = calculator.getWeights();
        }
        SymMatrix combinedNetwork = org.genemania.engine.core.integration.CombineNetworksOnly.combine(weightMap, Data.CORE, organism.getId(), cache, NullProgressReporter.instance());

        double WtW = combinedNetwork.elementMultiplySum(combinedNetwork);
        logger.debug("WtW: " + WtW);

        CombinedNetwork combined = new CombinedNetwork(Data.CORE, organism.getId(), Constants.goBranches[goBranchNum]);
        combined.setWeightMap(weightMap);
        combined.setWtW(WtW);
        combined.setData(combinedNetwork);
        cache.putCombinedNetwork(combined);

    }
    
    /*
     * this hopefully is just a temporary compatability thing, solver still needs
     * this separate map. can maybe later update solver to use the networkIds object
     * directly (TODO)
     */
    private Map<Integer, Long> makeIndexToNetworkIdMap(NetworkIds networkIds) {
          Map<Integer, Long> IndexToNetworkIdMap = new HashMap<Integer, Long>();

          long [] idsTable = networkIds.getNetworkIds();
          for (int i=0; i<idsTable.length; i++) {
              IndexToNetworkIdMap.put(i, idsTable[i]);
          }

          return IndexToNetworkIdMap;
    }

    /*
     * generate a network id mapping for all core networks in the dataset
     */
    public NetworkIds makeNetworkIds(Organism organism, Collection<Collection<Long>> ids) {

        int numNetworks = count(ids);
        long [] idsTable = new long[numNetworks];
        int i = 0;

        for (Collection<Long> group: ids) {
            for (Long id: group) {
                idsTable[i] = id;
                i++;
            }
        }

        NetworkIds networkIds = new NetworkIds(Data.CORE, organism.getId());
        networkIds.setNetworkIds(idsTable);

        return networkIds;
    }

    /*
     * compute gram matrix including -/- interactions
     */
    public static DenseMatrix computeKtK(List<SymMatrix> unweightedNetworks, Map<Integer, Long> indexToNetworkIdMap, int numberOfLabels) {
        DenseMatrix KtK = MakeKtK2.SetGramBias(unweightedNetworks.size(), numberOfLabels);
        for (int i=0; i<unweightedNetworks.size(); i++) {
            for (int j=0; j<=i; j++) {
                MakeKtK2.PartialGram(KtK, unweightedNetworks.get(i), unweightedNetworks.get(j), i, j);
            }
        }
        return KtK;
    }

    public boolean getCommandLineArgs(String[] args) {
        CmdLineParser parser = new CmdLineParser(this);
        try {
            parser.parseArgument(args);
        }
        catch (CmdLineException e) {
            System.err.println(e.getMessage());
            System.err.println("java -jar myprogram.jar [options...] arguments...");
            parser.printUsage(System.err);
            return false;
        }

        return true;
    }

    @Override
    public void process() throws Exception {
        // default, do all organisms
        if (orgId == -1) {
            processAllOrganisms();
        }
        else {
            processOrganism(orgId, NullProgressReporter.instance());
        }
   	
    }
    
    public static void main(String[] args) throws Exception {

        FastWeightCacheBuilder cacheBuilder = new FastWeightCacheBuilder();
        cacheBuilder.getCommandLineArgs(args);

        try {
            cacheBuilder.init();
            cacheBuilder.process();
            cacheBuilder.cleanup();
        }
        catch (Exception e) {
            logger.error("Fatal exception", e);
            System.exit(1);
        }
    }
}
