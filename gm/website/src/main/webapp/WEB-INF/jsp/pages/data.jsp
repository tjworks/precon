<h1>GeneMANIA Data Archive</h1>

<p>
    GeneMANIA interaction networks are available for downloaded in plain text format at <a href="http://genemania.org/data/">http://genemania.org/data/</a>.
    The data is organized into separate folders by release date under the "archive" folder, each named by the year, month, and day of release in the format "YYYY-MM-DD". 
    The most recent release is also available under the folder "current".
</p>
<p> 
    Each individual release contains
    subfolders for every organism with the name "Genus_species". Within the organism folders are files containing all the individual
    interaction networks, as well as additional files containing network metadata and identifier mapping tables.
</p>
<p>All files are plain US-ASCII tab-delimited text files with a single header row containing field names. The formats of the individual
    data files are described in detail below. The data is available as compressed zip archives at the organism level.</p>

<h2>Interaction Networks</h2>

<p>The interaction network files are named "network_group.network_name.txt". Network names and group names correspond to those used in
    the GeneMANIA website, with spaces being substituted with underscore characters. The files contain a row for each interaction in the
    network, with the three columns: Gene_B, Gene_A, and Weight. Ensembl Gene ID's are preferred to identify genes in the first two columns of
    the interaction file, but other identifier types may also appear. The weight column contain a floating decimal value.</p>

<p>Each interacting pair of genes will be present exactly once in the file (symmetric interactions are not included) . Non-interacting
    genes are not present. No assumptions are made regarding the order of the records in the file or the order of genes in a record. 
    The following example includes genes identified by Entrez Gene ID's:</p>

<pre>
Gene_A 	Gene_B  Weight
814707  814741  0.26
814691  814846  0.14
...
</pre>


<h2>Network Metadata</h2>

<p>Network metadata is contained in the file "networks.txt". The file contains a row for each network belonging to the organism, with five
    columns: File_Name, Network_Group_Game, Network_Name, Source (such as GEO or PathwayCommons), and Pubmed_ID.</p>

<p>Example, columns 1 and 2:</p>
<pre>
File_Name                                         Network_Group_Name       
Shared_protein_domains.INTERPRO.txt               Shared protein domains   
Pysical_interactions.Van_Leene-De_Jaeger-2007.txt Physical interactions   
...
</pre>
<p>Example, columns 3, 4, and 5:</p>
<pre>
Network_Name               Source          Pubmed_ID
INTERPRO                   INTERPRO         
Van Leene-De Jaeger-2007   PATHWAYCOMMONS  17426018
...
</pre>

<h2>Identifier Mappings</h2>

<p>A table of recognized identifiers is contained in "identifier_mappings.txt". This file contains multiple rows for each gene
    recognized by GeneMANIA, with each row containing 3 columns: Preferred_Name, Name, and Source. The preferred name of a gene is the identifier
    that will appear in the interaction network files for this gene. The preferred name also groups all records in the identifier mappings file that represent the same
    same gene. The second column is an alternate identifier that GeneMANIA recognizes for the same gene, 
    for example the source data from which the network was constructed may have used one of these alternative names to identify the gene in question.
    The third column describes the type of the identifier in the second column, as for example Entrez ID or Uniprot ID. The preferred name 
    will also appear in a row with itself in the second column so that its own source may be specified.</p>

<p>The file will contain all the identifier mappings recognized by GeneMANIA, not
    just those that appear in the interaction files. No assumptions are made on the order of the records in the file. 
    The following example contains the records describing a pair of human genes: TSPAN-6 and TNMD.</p>
    
<pre>
Preferred_Name         Name             Source
ENSG00000000003        7105             Entrez Gene ID
ENSG00000000003        ENSG00000000003 	Ensembl Gene ID
ENSG00000000003        ENSP00000362111 	Ensembl Protein ID
ENSG00000000003        ENSP00000409517 	Ensembl Protein ID
ENSG00000000003        NM_003270       	RefSeq mRNA ID
ENSG00000000003        NP_003261       	RefSeq Protein ID
ENSG00000000003        O43657  	        Uniprot ID
ENSG00000000003        T245    	        Synonym
ENSG00000000003        TM4SF6           Synonym
ENSG00000000003        TSN6_HUMAN       Uniprot ID
ENSG00000000003        TSPAN-6          Synonym
ENSG00000000003        TSPAN6  	        Gene Name
ENSG00000000005        64102   	        Entrez Gene ID
ENSG00000000005        BRICD4  	        Synonym
ENSG00000000005        CHM1-LIKE       	Synonym
ENSG00000000005        CHM1L   	        Synonym
ENSG00000000005        ENSG00000000005 	Ensembl Gene ID
ENSG00000000005        ENSP00000362122 	Ensembl Protein ID
ENSG00000000005        NM_022144       	RefSeq mRNA ID
ENSG00000000005        NP_071427       	RefSeq Protein ID
ENSG00000000005        Q9H2S6  	        Uniprot ID
ENSG00000000005        TNMD    	        Name
ENSG00000000005        TNMD_HUMAN      	Uniprot ID
ENSG00000000005        myodulin        	Synonym
ENSG00000000005        tendin  	        Synonym
...
</pre>
    