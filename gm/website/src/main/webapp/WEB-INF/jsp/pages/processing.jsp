<h1>Network Data Processing</h1>

<h2>Introduction</h2>

<p>GeneMANIA builds and uses weighted interaction networks from various sources of data, and is able to process user
    data into such networks using the methods outlined here.</p>
<p>The system distinguishes between three different types of user-defined data in its import procedures: real- and binary-valued
    interaction networks, e.g. physical interaction networks; real-valued gene profile datasets, e.g. multi-sample microarray expression
    datasets; and binary-valued gene profile datasets, e.g. protein localization datasets.</p>

<h2>Quick note on genes and objects</h2>

<p>Although GeneMANIA was designed with genes in mind, the network nodes could include non-genic objects, like metabolites, that
    interact with genes. Or networks could be defined on nodes of any type of objects that you like, say actors and movies, and have
    interactions between movies that the actor has played in. However, to simplify our presentation, in the following we assume that the
    network nodes correspond to genes.</p>

<h2>Identifiers</h2>
<p>GenMANIA is able to recognize multiple different identifiers representing each unique gene, for example Ensembl gene ID's, Entrez
    gene ID's, and gene names. These identifiers are not case sensitive, and may include non-alpha numeric characters such as parenthesis
    and hyphens. Any input record that can not be mapped to a known identifier is ignored, with only the recognized subset of the data in a
    given input file being used to construct the interaction network.</p>

<p>The tables of valid identifiers used by GeneMANIA have been cleaned to enforce uniqueness. That is, if a particular gene
    name is associated with two different genes, that name would have been removed as ambiguous.</p>

<h2>Duplicate Interactions</h2>
<p>A given input file may contain multiple interactions for the same gene pair, either directly or due to having interactions using
    different identifiers which GeneMANIA considers as representing the same gene. In both cases the link weights of the duplicate
    interactions are averaged.</p>

<h2>Shared processing</h2>
<p>Networks derived from all data types are normalized by the GeneMANIA before being used. The effect of the normalization is to
    scale each weight to make the sum of the weights on all links to a particular node equal to approximately one. We perform this
    normalization to improve the accuracy of the GeneMANIA algorithm. Because of the normalization, the link weights will change from their
    user-specified values. Also, gene profile datasets are transformed into network representations before being used by GeneMANIA through a
    procedure described below.</p>

<h2>Real- and binary-valued interaction networks</h2>
<p>Interaction networks with real-valued scores are imported directly. GeneMANIA expects this data to be formatted as three-column file
    in which each row describes one, undirected interaction as follows:</p>

<code>OBJECT1 \t OBJECT2 \t SCORE</code>

<p>where OBJECT1 and OBJECT2 are gene identifiers and SCORE is the positive real-valued link weight and "\t" indicates a TAB. GeneMANIA
    assumes there is no link (i.e. a link weight of zero) between pairs of genes that are not listed. Also, GeneMANIA ignores any SCORE
    values below zero, assigning the corresponding gene pair a zero link weight.</p>

<p>We provide two ways to import binary networks, that is, networks that indicate whether two objects interact without assigning a
    score. To import the network as-is, you'll need to construct a list of all your interactions in this format:</p>

<code>OBJECT1 \t OBJECT2 \t 1</code>

<p>or you can also leave out the last column and format your interaction file as:</p>

<code>OBJECT1 \t OBJECT2</code>

<p>In this case, GeneMANIA will assume that all interactions have an initial weight of 1 (before normalization).</p>

<h2>Real-valued gene profile datasets:</h2>
<p>You can also construct networks from profile data. For example, you can create a co-expression network from gene expression profiles.
    We recognize profile data in Gene Expression Omnibus (GEO) SOFT format or you can organize your data in this simple tab-delimited
    format:</p>

<code>OBJECT \t SAMPLE1 ( \t SAMPLE2 ... )</code>

<p>where OBJECT is a gene identifier and SAMPLE1 (and SAMPLE2, etc.) is a real-valued gene expression level.</p>

<p>To generate a network, we first compute the Pearson correlation as a measure of interaction strength between each pair of genes for
    which profiles are available. We then sparsify (i.e. filter) these interactions in two ways. First, we remove (i.e. set to zero weight)
    any interactions between gene A and gene B that are not among the 50 strongest positively correlated interactions for at least one of
    that pair of genes. Note, in some rare cases there are ties, so the correlations between the 50th and 51st ranked genes are the same. In
    those cases, we include all genes with the same correlation as the 50th gene, up to a maximum of two percent of all recognized genes in
    the data set or 600 genes. If we must add more than this to capture the tied group, then the entire tied group is removed, resulting in
    less than 50 interactions. If the size of the genome is less than 2500, then the effective threshold is actually less than 50. Second,
    we set to zero any Pearson correlation coefficients less than zero. Finally, we use any remaining non-zero Pearson correlation as link
    weights and process the network as per the real-valued interaction networks above.</p>

<p>A profile record may contain missing values. These are indicated simply by an empty field in the record. In practice any value not
    parsed as a valid floating point will be treated as missing (so e.g. "N/A", or "missing" will also work). In such cases the missing
    field is excluded when computing correlations with other profile records; so the correlation between a gene pair is calculated using
    only those gene expression levels that are not missing in either profile.</p>

<h2>Binary-valued gene profile datasets</h2>
We process binary-valued gene profile datasets in a similar way to how we handle real-valued profiles with two differences. First, we first
apply a log-frequency transformation to transform the "0" and "1" values in the gene profile into real-values. Specifically, "1"s are
replaced with -log p and "0"s with log(1-p), where p is the frequency of ones in the column. We then compute the inner product between the
two profiles and use this as a link weight. Second, we set to zero any link weights equal to or below a threshold equal to the inner product
between two profiles that are all "0"s. We then sparsify the inner product matrix as described above.

<h2>Citation</h2>
<p>
    For more information about network processing and analysis in GeneMANIA, please see the original paper describing the method.
</p>
<p>
<b>GeneMANIA: a real-time multiple association network integration algorithm for predicting gene function</b><br />
Mostafavi S, Ray D, Warde-Farley D, Grouios C, Morris Q (2008)<br />
<a href="http://genomebiology.com/2008/9/S1/S4" class="external_link" >Genome Biology 9: S4. </a><br />
<a href="http://www.ncbi.nlm.nih.gov/pubmed/18613948" class="external_link" >PubMed Abstract</a> (<a href="${pageContext.request.contextPath}/pdf/Mostafavi.pdf">PDF</a>)
</p>
