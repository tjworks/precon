<h1>Help</h1>
                        
                <ul class="section_nav">
                <strong>Contents</strong>
                	<li><a href="#section/what_is_genemania">What is GeneMANIA?</a></li>
                	<li><a href="#section/questions">What biological questions can GeneMANIA answer?</a></li>
    				<li><a href="#section/results">Interpreting the results</a></li>
    				<li><a href="#section/tips">GeneMANIA search tips</a></li>
    				<li><a href="#section/identifiers">Recognized gene identifiers</a></li>
                    <li><a href="#section/network_categories">GeneMANIA network categories</a></li>
    				<li><a href="#section/upload">Uploading your own network</a></li>
    				<li><a href="#section/weighting">Choosing an appropriate network weighting option</a></li>
    				<li><a href="#section/sources">Network data sources</a></li>
    				<li><a href="#section/algorithm">GeneMANIA algorithm</a></li>
                    <li><a href="#section/sources">Network data sources</a></li>
                    <li><a href="#section/processing">How are networks computed?</a></li>                    
                    <li><a href="#section/data">Where can I download GeneMANIA data?</a></li>
    				<li><a href="#section/enrichment">Functional Enrichment Analysis</a></li>
    				<li><a href="#section/requirements">Computer requirements</a></li>
    				<li><a href="#section/cite">How do I cite GeneMANIA?</a></li>
    				<li><a href="#section/unique">What makes GeneMANIA unique?</a></li>
    				<li><a href="#section/link">How do I link to GeneMANIA</a></li>
                </ul>
                
				<h2 id="section/what_is_genemania">What is GeneMANIA?</h2>
                <p>GeneMANIA finds other genes that are related to a set of input genes, using a very large set of functional association data. Association data include protein and genetic interactions, pathways, co-expression, co-localization and protein domain similarity. You can use GeneMANIA to find new members of a pathway or complex, find additional genes you may have missed in your screen or find new genes with a specific function, such as protein kinases. Your question is defined by the set of genes you input.</p>
    			
                <h2 id="section/questions">What biological questions can GeneMANIA answer?</h2>
                <h3>Find more genes like these:</h3>
                <ul>
                	<li>If members of your gene list make up a protein complex, GeneMANIA will return more potential members of the protein complex.</li>
                	<li>If your gene list consists of kinases, GeneMANIA will return more kinase genes.</li>
                	<li>If members of your gene list are involved in a specific disease, GeneMANIA will return more genes putatively involved in the same disease.</li>
                	<li>You want to perform a genetic screen with a phenotypic readout, for example. Enter the genes that you already know are likely to come out of your screen, for instance, genes known to underlie a specific phenotype. GeneMANIA will predict other genes underlying the phenotype, which can then be screened.</li>
                </ul>
                <h3>Tell me about my gene(s):</h3>
                <ul>
                	<li>If you enter a single gene, GeneMANIA will find interactions in which your gene participates, within the selected datasets.</li>
                	<li>If you enter a gene list, GeneMANIA will return connections between your genes, within the selected datasets.</li>
                	<li>If you enter a gene list, GeneMANIA will show you in which datasets your gene list is highly connected.</li>
                	<li>If you enter genes from a protein interaction screen, like a pull down or yeast two-hybrid, and select only physical interaction networks, GeneMANIA will predict true positives (those more highly connected) and false positives (those less well connected).</li>
                </ul>
    
                <h2 id="section/results">Interpreting the results</h2>
                <p>GeneMANIA returns:</p>
                <ul>
                	<li>A list of genes with associated scores, including your input genes and predicted related genes.</li>
                	<li>A network that shows the relationships between genes in the list. This is a composite of all of the networks chosen from the database in a way that best connects related genes. Nodes represent genes and links represent networks. Genes can be linked by more than one type of network.</li>
                	<li>A list of networks weighted by their ability to connect related genes. This weighting is a measure of how 'informative' the network for the given set of input genes.</li>
                </ul>
                <p>Predicted related genes can be, for instance, in the same pathway or complex as your input genes, can be co-expressed or have similar enzymatic function. To determine how predicted genes are related to your input genes, you need to study the links in the network to find out how your input genes are connected to each other and how new genes are related to your input genes.</p>
                
                <h2 id="section/tips">GeneMANIA search tips</h2>
                <ul>
                	<li>GeneMANIA works best if most of the input genes are functionally related. If they are not, a disconnected network will result and the network weighting will not be optimal. It does not matter which function they are related by, as long as that function is captured somehow by some functional association networks in the GeneMANIA system.</li>
                	<li>If your query list consists of 6 or more genes, GeneMANIA will calculate gene list-specific weights.  If your query list has less than 6 genes, GeneMANIA will make gene function predictions based on GO annotations patterns.</li>
                	<li>GeneMANIA will be slower with an input gene list of more than 50 genes; if you have such large gene lists, we recommend using a gene list of no more than 100 genes.  The GeneMANIA <a href="${pageContext.request.contextPath}/page/plugin">Cytoscape plugin</a> is capable of handling larger gene lists.</li>
                </ul>
                
                <h2 id="section/identifiers">Recognized gene identifiers</h2>
                <p>GeneMANIA recognizes Entrez, Ensembl, Standard gene symbols, Uniprot/SwissProt and RefSeq identifiers and unique gene names.</p>
    			
                <h2 id="section/network_categories">GeneMANIA network categories</h2>
                <p>GeneMANIA searches many large, publicly available biological datasets to find related genes. These include protein-protein, protein-DNA and genetic interactions, pathways, reactions, gene and protein expression data, protein domains and phenotypic screening profiles. Data is regularly updated.</p>
				<p>Networks names describe the data source and are either generated from the PubMed entry associated with the data source (first author-last author-year), or simply the name of the data source (BioGRID, PathwayCommons-(original data source), Pfam)</p>
                <ul>
    				<li><b>Co-expression:</b> Gene expression data. Two genes are linked if their expression levels are similar across conditions in a gene expression study. Most of these data are collected from the Gene Expression Omnibus (GEO); we only collect data associated with a publication.</li>
    				<li><b>Physical Interaction:</b> Protein-protein interaction data. Two gene products are linked if they were found to interact in a protein-protein interaction study. These data are collected from primary studies found in protein interaction databases, including BioGRID and PathwayCommons.</li>
    				<li><b>Genetic interaction:</b> Genetic interaction data. Two genes are functionally associated if the effects of perturbing one gene were found to be modified by perturbations to a second gene. These data are collected from primary studies and BioGRID.</li>
    				<li><b>Shared protein domains:</b> Protein domain data. Two gene products are linked if they have the same protein domain. These data are collected from domain databases, such as InterPro, SMART and Pfam.</li>
    				<li><b>Co-localization:</b> Genes expressed in the same tissue, or proteins found in the same location. Two genes are linked if they are both expressed in the same tissue or if their gene products are both identified in the same cellular location.</li>
    				<li><b>Pathway:</b> Pathway data. Two gene products are linked if they participate in the same reaction within a pathway. These data are collected from various source databases, such as Reactome and BioCyc, via PathwayCommons.</li>
    				<li><b>Predicted:</b> Predicted functional relationships between genes, often protein interactions. A major source of predicted data is mapping known functional relationships from another organism via orthology. For instance, two proteins are predicted to interact if their orthologs are known to interact in another organism. In these cases, network names describe the original data source of experimentally measured interactions and which organism the interactions were mapped from. E.g. A mouse network predicted from a human network: Barrios-Rodiles-Wrana-2005-Human2Mouse.  Also, we include predicted functional associations from other groups that combine multiple data sources for a given organism, e.g., the entire YeastNet predicted network: Lee-Marcotte-2007 YeastNet; the genetic interaction data used to generate YeastNet: Lee-Marcotte-2007 Genetic interactions.  In these cases, the network name indicates the original publication detailing the predicted network, and (in some cases) lists the individual network that was used to generate the entire predicted network (for latter example above).  Some predicted networks include data from other organisms. In these cases, the original organism is mentioned in the network name, e.g., the yeast protein interaction data used to generate WormNet: Lee-Marcotte-2008 Protein interactions yeast2worm.</li>
    				<li><b>Other:</b> Networks that do not fit into any of the above categories. Examples include phenotype correlations from Ensembl, disease information from OMIM and chemical genomics data.</li>
                	<li><b>Uploaded:</b> Networks that have you have uploaded.</li>
                </ul>
				                
                <h2 id="section/upload">Uploading your own network</h2>
                <p>You can upload your network to GeneMANIA and analyze it in the context of all publicly available networks that GeneMANIA knows about.  Your network is deleted from the GeneMANIA server after your session ends, or within 24 hours.  Please see our <a href="${pageContext.request.contextPath}/page/privacy">privacy policy</a> for more information.</p>
                <p>The upload network button can be found in the advanced options panel. Your network must be for one of the GeneMANIA supported organisms, be tab delimited text, and in the format <tt>GeneID &lt;tab&gt; GeneID &lt;tab&gt; Score</tt>. The score will vary depending on the type of network, but in general is a number ranging from zero (no interaction) to 1 (strong interaction).  For an interaction network or a pathway where interactions either exist or don't exist, the score is 1 for all links. For a gene expression network, the score could be the Pearson correlation coefficient for the gene pair, representing the expression level simiarity across several experiments.</p>
                <p>For a co-expression network, the score could be the Pearson correlation coefficient between the expression profiles of the two genes.  Note that networks are normalized to reduce the effect of highly connected nodes, so scores may change slightly once uploaded.</p>
                
                <h2 id="section/weighting">Choosing an appropriate network weighting option</h2>
                <p>GeneMANIA can use a few different methods to weight networks when combining all networks to form the final composite network that results from a search. The default settings are usually appropriate, but you can choose a weighting method in the advanced option panel.</p>
                <h3>Query-dependent weighting</h3>
                <ul>
                	<li><b>Automatically selected weighting method (default):</b> the network weights are chosen based on the size of your input gene list. If your input gene list has less than 5 genes, the default network weighting method is 'Gene-Ontology (GO) based weighting, Biological Process based'.  This weighting method assumes the input gene list is related in terms of biological processes (as defined by GO). If your input gene list has 5 or more genes, GeneMANIA assigns weights based to maximize connectivity between all input genes using the 'assigned based on query gene' strategy.</li>
					<li><b>Assigned based on query gene:</b> the weights are chosen automatically using linear regression, to make genes on your list interact as much as possible with each other, and as little as possible with genes not on your list. This is the default method if your input gene list contains more than 5 genes.</li>
                </ul>
				<h3>Gene Ontology (GO)-based weighting</h3>
				<p>These weighting methods are based on GO terms that have between 3 and 300 genes associated with them.  Only the most reliable annotations were used (i.e. all annotations with an IEA evidence code were removed, as these are less reliable).  There is one weighting method per GO branch.</p>
                <ul>
					<li><b>Biological Process based:</b> assumes the input gene list is related through GO biological processes. This is the default method if your input gene list contains less than 5 genes.</li>
					<li><b>Molecular Function based:</b> assumes the input gene list is related through the GO molecular functions.</li>
					<li><b>Cellular Component based:</b> assumes the input gene list is related through the GO cellular components.</li>
                </ul>
                <h3>Equal weighting</h3>
                <ul>
                	<li><b>Equal by network:</b> all networks are assigned an equal weight. This is useful if you want to see all networks that connect your input genes.</li>
                	<li><b>Equal by data type:</b> all network categories are assigned an equal weight, with the weighting also evenly distributed among networks within each category.</li>
                </ul>
                
                <h2 id="section/sources">Network data sources</h2>
                <p>Each network data source is represented as a weighted interaction network where each pair of genes is assigned an association weight, which is either zero indicating no interaction, or a positive value that reflects the strength of interaction or the reliability the observation that they interact. For example, the association of a pair of genes in a gene expression dataset is the <strong>Pearson correlation</strong> coefficient of their expression levels across multiple conditions in an experiment. The more the genes are co-expressed, the higher the weight they are linked by, ranging up to 1.0, meaning perfectly correlated expression.</p> 
				<p><strong>Direct interactions</strong> are used for networks where binary information is available (like protein interactions). When two proteins interact, their network link has a weight of 1.</p>
				<p><strong>Shared neighbours</strong> were used for networks where the profile of one gene was compared to that of a second gene and the Pearson correlation coefficient was calculated (like protein domain data).</p>
                <p>The GeneMANIA database consists of genomics and proteomics data from a variety of sources, including data from gene and protein expression profiling studies and primary and curated molecular interaction networks and pathways.  GeneMANIA relies on the following data sources:</p>
    			<div class="logo">
	    			<a href="http://www.ncbi.nlm.nih.gov/geo" ><img src="../img/other/geo.gif" border="0"/></a>
	    			<a href="http://www.thebiogrid.org" ><img src="../img/other/biogrid.png" border="0"/></a>
	    			<a href="http://www.ebi.ac.uk/interpro" ><img src="../img/other/embl-ebi.png" border="0"/></a>
	    			<a href="http://pfam.sanger.ac.uk" ><img src="../img/other/pfam.png" border="0"/></a>
	    			<a href="http://www.ensembl.org" ><img src="../img/other/ensembl.png" border="0"/></a>
	    			<a href="http://www.ncbi.nlm.nih.gov" ><img src="../img/other/ncbi.gif" border="0"/></a>
	    			<a href="http://www.informatics.jax.org" ><img src="../img/other/mgi.gif" border="0"/></a>
	    			<a href="http://ophid.utoronto.ca/ophidv2.201" ><img src="../img/other/i2d.jpg" border="0"/></a>
	    			<a href="http://inparanoid.sbc.su.se" ><img src="../img/other/inp7.png" border="0"/></a>
	    			<a href="http://www.pathwaycommons.org" ><img src="../img/other/pathway-commons.png" border="0"/></a>
                </div>
                <p>We maintain a <a href="${pageContext.request.contextPath}/page/networks">complete list of networks currently in the GeneMANIA system</a>.</p>
                
                <h2 id="section/processing">How are networks computed?</h2>
                <p>The process used to create interaction networks from source data for GeneMANIA is described on the <a href="${pageContext.request.contextPath}/page/processing">Data Processing</a> page. This same process is used both to produce the core networks included with GeneMANIA, as well as for networks created from user-uploaded data at the GeneMANIA Website or using the Cytoscape Plugin.</p>
                                                 
                <h2 id="section/data">Where can I download GeneMANIA data?</h2>
                <p>The interaction networks used in the current GeneMANIA website, as well as archived datasets from previous releases are available for download in text format at <a href="http://genemania.org/data/">http://genemania.org/data/</a>. The <a href="${pageContext.request.contextPath}/page/data">Data Archive</a> page describes the file formats used.</p>
                        
                <h2 id="section/algorithm">GeneMANIA algorithm</h2>
                <p>GeneMANIA stands for Multiple Association Network Integration Algorithm.</p>
                <p>The GeneMANIA algorithm consists of two parts: </p>
                <ol>
                	<li>A linear regression-based algorithm that calculates a single composite functional association network from multiple data sources.</li>
                	<li>A label propagation algorithm for predicting gene function given the composite functional association network.</li>
                </ol>
                <p>GeneMANIA treats gene function prediction as a binary classification problem. As such, each functional association network derived from the data sources is assigned a positive weight, reflecting the data sources' usefulness in predicting the function. The weighted average of the association networks is constructed into a function-specific association network. GeneMANIA uses separate objective functions to fit the weights; this simplifies the optimization problem and decreases the run time.</p>
				<p>GeneMANIA predicts gene function from the composite network using a variation of the Gaussian field label propagation algorithm that is appropriate for gene function prediction in which there are typically relatively few positive examples. Label propagation algorithms assign a score (the discriminant value) to each node in the network. This score reflects the computed strength of association that the node has to the seed list defining the given function. This value can be thresholded to enable predictions of a given gene function.</p>
				<p>
					<b>GeneMANIA: a real-time multiple association network integration algorithm for predicting gene function</b><br />
					Mostafavi S, Ray D, Warde-Farley D, Grouios C, Morris Q (2008)<br />
					<a href="http://genomebiology.com/2008/9/S1/S4" class="external_link" >Genome Biology 9: S4. </a><br />
					<a href="http://www.ncbi.nlm.nih.gov/pubmed/18613948" class="external_link" >PubMed Abstract</a> (<a href="${pageContext.request.contextPath}/pdf/Mostafavi.pdf">PDF</a>)
				</p>

                <h2 id="section/enrichment">Functional Enrichment Analysis</h2>
                <p>The Functions tab of the GeneMANIA results page displays Gene Ontology (GO) terms enriched among the genes in the network displayed by GeneMANIA.</p>
                <p>We only consider annotations (direct or up-propagated) in GO terms with between 10 and 300 non-"IEA" and non-"RCA" annotations in the organism of interest. The GO categories and Q-values from a FDR corrected hypergeometric test for enrichment are reported, along with coverage ratios for the number of annotated genes in the displayed network vs the number of genes with that annotation in the genome. We estimate Q-values using the Benjamini-Hochberg procedure. Categories are displayed up to a Q-value cutoff of 0.1</p>
                <p>We test for enrichment using as the foreground set all the genes in either the query list or the related genes discovered by GeneMANIA that have at least one GO annotation and as the background set all genes with GO annotations and at least one interaction in our network database.</p>                       
                <p>Since the functional enrichment is computed on the displayed network, the value selected for number of related genes in the GeneMANIA advanced option's panel will influence the results. It may be informative to try other values for this parameter, particularly if the set of functional categories is empty or small for the default value. If you only want to test the query list for enrichment, select "0" for the number of returned genes.</p>		                
                
                <h2 id="section/requirements">Computer requirements</h2>
				<p><b>Web browser:</b> GeneMANIA supports the latest versions of Chrome, Firefox, Safari and Internet Explorer.  For a faster, smoother experience with GeneMANIA, we recommend you use a standards compliant browser, such as <a class="external_link" href="http://google.com/chrome">Chrome</a> or <a href="http://firefox.com" class="external_link">Firefox</a>.</p>
                
                <table class="browser_support">
                	<thead>
						<tr>
							<th></th>
							<th>Windows</th>
							<th>Mac OS</th>
							<th>Linux</th>
						</tr>
                	</thead>
                	<tbody>
                		<tr class="supported">
                			<td class="title">Very well supported</td>
                			<td>Chrome 8+, Firefox 3.6+</td>
                			<td>Chrome 8+, Firefox 3.6+, and Safari 5+</td>
                			<td></td>
                		</tr>
                		<tr class="reasonable">
                			<td class="title">Reasonably well supported</td>
                			<td>Internet Explorer 8+</td>
                			<td></td>
                			<td></td>
                		</tr>
                		<tr class="may_work">
                			<td class="title">May work</td>
                			<td></td>
                			<td></td>
                			<td>Chrome 8+ and Firefox 3.6+</td>
                		</tr>
                		<tr class="not_supported">
                			<td class="title">Not supported</td>
                			<td>older versions and others</td>
                			<td>older versions and others</td>
                			<td>older versions and others</td>
                		</tr>
                	</tbody>
                </table>
                
                <p><b>Internet Connection:</b> A fast internet connection such as DSL, Cable or T1.</p>
    			<p><b>Computer:</b> A modern computer with at least a 1GHz CPU, 1GB RAM and a modern video card.</p>
                
				<h2 id="section/cite">How do I cite GeneMANIA?</h2>
    			<p>We recommend citing the NAR webserver issue, as follows.</p>
    			<p>
    				<b>The GeneMANIA prediction server: biological network integration for gene prioritization and predicting gene function</b><br />
					Warde-Farley D, Donaldson SL, Comes O, Zuberi K, Badrawi R, Chao P, Franz M, Grouios C, Kazi F, Lopes CT, Maitland A, Mostafavi S, Montojo J, Shao Q, Wright G, Bader GD, Morris Q<br />
					<a class="external_link"  href="http://nar.oxfordjournals.org/cgi/content/abstract/38/suppl_2/W214">Nucleic Acids Res. 2010 Jul 1;38 Suppl:W214-20</a><br />
					<a class="external_link"  href="http://www.ncbi.nlm.nih.gov/pubmed/20576703">PubMed Abstract</a> (<a href="${pageContext.request.contextPath}/pdf/genemania_prediction_server.pdf">PDF</a>)
    			</p>
                
                <h2 id="section/unique">What makes GeneMANIA unique?</h2>
                <p>Other gene function prediction programs are available, including <a href="http://string.embl.de/" class="external_link" >STRING</a>, <a href="http://pixie.princeton.edu/pixie/" class="external_link" >bioPIXIE</a>, <a href="http://llama.med.harvard.edu/funcassociate/" class="external_link" >Funcassociate</a>, and <a href="http://funcoup.sbc.su.se/" class="external_link" >FunCoup</a>.</p>
                <p>GeneMANIA has the advantage of flexibility, accuracy, and often speed of response over these other systems. In particular, in a competition (on yeast (Mostafavi et al., 2008 <a href="${pageContext.request.contextPath}/pdf/Mostafavi.pdf" >PDF</a>, <a href="http://www.ncbi.nlm.nih.gov/pubmed/18613948" class="external_link" >PubMed</a>, <a href="http://genomebiology.com/2008/9/S1/S4" class="external_link" >journal</a>) and mouse (Pena-Castillo et al., 2008 <a href="${pageContext.request.contextPath}/pdf/Pena_Castillo.pdf" class="external_link" >PDF</a>, <a href="http://www.ncbi.nlm.nih.gov/pubmed/18613946" class="external_link" >PubMed</a>, <a href="http://genomebiology.com/2008/9/S1/S2" class="external_link" >journal</a>), GeneMANIA was shown to be more accurate than other gene function prediction methods, and is generally faster, producing predictions within seconds. Because of this speed, GeneMANIA can produce results while you wait. Users can select arbitrary subsets of networks that they want to query and GeneMANIA automatically selects network weights based on the input gene list, generating a network specific to the user's gene list. Unlike other systems, GeneMANIA provides users with the ability to upload their own network and also compensates for redundancies in the data, so users don't have to worry about double-counting interactions.</p>
                
                <h2 id="section/link">How to link to GeneMANIA</h2>
                
				<p>The linking URL in its simplest form is <code>http://genemania.org/link?o=&lt;tid&gt;&amp;g=&lt;genes&gt;</code>, or alternatively
				<code>http://genemania.org/search/&lt;organism&gt;/&lt;genes&gt;</code>, where:</p>
				
				<ul>
					<li><code>&lt;organism&gt;</code> : organism name or common name (e.g. <code>human</code> or <code>homo_sapiens</code>) without punctuation (e.g. <code>bakers_yeast</code> not <code>baker's_yeast</code>)</li>
					<li><code>&lt;tid&gt;</code> : NCBI taxonomy id for organism (A. thaliana=3702, C. elegans=6239, D. melanogaster=7227, H. sapiens=9606, M. musculus=10090, S. cerevisiae=4932)</li>
					<li><code>&lt;genes&gt;</code> : one or more gene symbols separated by pipes ("|")</li>
				</ul>
				
				<p><b>Examples of the simplest form:</b></p>
				
				<ul>
					<li>one gene : <code>http://genemania.org/link?o=3702&amp;g=rad50</code></li>
					<li>multiple genes : <code>http://genemania.org/link?o=3702&amp;g=PHYB|ELF3|COP1|SPA1|FUS9</code></li>
				</ul>
				
				<p><b>Optional Parameters:</b></p>
				
				<p>GeneMANIA linking supports some optional parameters (reference GeneMANIA help section on meaning of the various weighting methods):</p>
				
				<ul>
					<li><code>m</code> : network combining method; must be one of the following:</li>
						<ul>
							<li><code>automatic_relevance</code> : Assigned based on query genes</li>
							<li><code>automatic</code> : Automatically selected weighting method</li>
							<li><code>bp</code> :  biological process based</li>
							<li><code>mf</code> :  molecular function based</li>
							<li><code>cc</code> :  cellular component based</li>
							<li><code>average</code> : Equal by data type</li>
							<li><code>average_category</code> : Equal by network</li>
						</ul>
					<li><code>r</code> : the number of results generated by GeneMANIA; must be a number in the range 1..100.</li>
				</ul>
				
				<p>If no optional parameters are provided, GeneMANIA assumes the default values: <code>m=automatic</code>; <code>r=10</code>.</p>
				
				<p><b>Examples using optional parameters:</b></p>
				
				<p>The following query runs the GeneMANIA algorithm for A. thaliana using 6 genes as input, the "average" method and returns 50 more genes:
				<code>http://genemania.org/link?o=3702&amp;g=DET1|HY5|CIP1|CIP8|PHYA|HFR1&amp;m=average&amp;r=50</code></p>
				
				<p>The following query runs the GeneMANIA algorithm for A. thaliana's CIP1 gene using the "molecular process based" method and returns 101 genes:
				<code>http://genemania.org/link?o=3702&amp;g=CIP1&amp;m=bp&amp;r=100</code></p>
				
				<p><b>Invalid queries:</b></p>
				
				<ul>
					<li><code>http://genemania.org/link?o=3702</code> : at least one gene must be specified</li>
					<li><code>http://genemania.org/link?o=1000</code> : invalid taxonomy id</li>
					<li><code>http://genemania.org/link?o=3702&amp;g=PHYA&amp;m=super_smart&amp;R=50</code> : invalid method</li>
					<li><code>http://genemania.org/link?o=3702&amp;g=det1&amp;r=1000</code> : results must be less than 100</li>
				</ul>
				
				<p>Happy linking!</p>
                