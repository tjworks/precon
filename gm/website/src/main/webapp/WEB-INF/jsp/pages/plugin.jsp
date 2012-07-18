<h1>Cytoscape plug-in</h1>

<img style="float: right" src="../img/other/plugin.png"/>

<p>
The GeneMANIA Cytoscape plugin brings fast gene function prediction capabilities to the desktop. GeneMANIA identifies the most related genes to a query gene set using a guilt-by-association approach. The plugin uses a large database of functional interaction networks from multiple organisms and each related gene is traceable to the source network used to make the prediction. Users may add their own interaction networks and expression profile data to complement or override the default data. The plugin follows the look and feel of the GeneMANIA website, but provides more features for power-users:
</p>

<ul>
<li>Number of query genes is limited only by the amount of memory available</li>
<li>Powerful <a href="${pageContext.request.contextPath}/page/tools">command line tools</a> to automate basic and advanced analysis not available via the website</li>
<li>Users can add their own organisms</li>
<li>Integration with the popular Cytoscape network visualization and analysis platform so Cytoscape networks can be imported into GeneMANIA and GeneMANIA results can be used in other Cytoscape analysis. Also, results can be saved in Cytoscape session files for later work, backup or sharing with colleagues.</li>
</ul>

<p>
<b>GeneMANIA Cytoscape plugin: fast gene function predictions on the desktop.</b><br /> 
					Montojo J, Zuberi K, Rodriguez H, Kazi F, Wright G, Donaldson SL, Morris Q, Bader GD (2010)<br /> 
					<a href="http://dx.crossref.org/10.1093%2Fbioinformatics%2Fbtq562" class="external_link">Bioinformatics 26: 22. </a><br /> 
					<a href="http://www.ncbi.nlm.nih.gov/pubmed/20926419" class="external_link">Full Article</a> (<a href="http://bioinformatics.oxfordjournals.org/content/26/22/2927.full.pdf+html">PDF</a>)
</p>

<h2>Minimum System Requirements</h2>
<ul>
    <li>Java 1.5+ JVM (1.6 is required for Cytoscape 2.8+)<br/>
        <strong>Note</strong>: Queries that use more than 1.5 GB of RAM require Cytoscape to be launched with a 64-bit JVM
    </li>
    <li><a href="http://www.cytoscape.org/" class="external_link" >Cytoscape</a> 2.6.3+, 2.7+, or 2.8+ (does not work with 3.0 yet)</li>
    <li>2 GB RAM</li>
</ul>
<h2>Installation Instructions</h2>
<ol>
    <li><a class="external_link" href="http://cytoscape.wodaklab.org/wiki/How_to_increase_memory_for_Cytoscape">Adjust the amount of memory allocated to Cytoscape</a> to at least 1.5GB</li>
    <li>In Cytoscape, go to <em>Plugins » Manage Plugins</em>.</li>
    <li>Under <em>Available for Install » Network Inference</em>, select <em>GeneMANIA</em>.</li>
    <li><em>Click Install</em>.</li>
</ol>

