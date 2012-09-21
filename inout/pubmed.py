"""
Export reference to RIS format
"""
from copy import copy
from models import BaseModel
from myutil import idtool
from myutil.objdict import ObjDict
from onechart import mongo
from onechart.models import Connection, Entity, Network, Node
from xml.dom.minidom import parse, parseString
import logging
import os
import requests
import time
logger = logging.getLogger(__name__)

MEDLINE_ENDNOTE_MAPPING = {         
'PT  ':'TY  ',
'PMID':'AN  ',
'DO  ':'AID ',
'ET  ':'EDAT',
'J2  ':'JA  ',
'KW  ':'MH  ',
'LI  ':'LA  ',
'N1  ':'FAU ',
'PY  ':'DP  ',
'SN  ':'IS  ',
'SP  ':'PG  ',
'ST  ':'TI  ',
'VL  ':'VI  '
}
     
def exportReference(pubmed_ids):  

    url = "http://togows.dbcls.jp/entry/pubmed/" 
    
    pubs = []
    peoples = []
    ids = ",".join(pubmed_ids)
    uri = "%s%s" %(url,ids) 
    logger.debug(  "Loading %s" %uri)
    r = requests.get(uri)
    if r.status_code == 200:
        from django.utils.encoding import smart_str, smart_unicode
        content = smart_str(r.text)
    else:
        raise Exception("Failed to open %s" %uri)
    
    # content retrieved from togows is in RIS format
    # i.e., 4 char identifier, 1 dash, 1 space
    # if line does not start with this pattern, it is treated as a continuation of previous line
    # A blank line indicates the end of one article
    
    articles = []
    lines = content.splitlines()
    import re
    marker = re.compile("([A-Z ]{4})- (.*)$")
    key = None 
    for indx, line in enumerate(lines):
        if(not line.strip()): continue
        m = marker.match(line)
        if(m):
            key = m.group(1)
            if(key == 'PMID'):
                article = ObjDict()
                articles.append(article)
            if (key in article ): # more than one entry
                if( type(article[key]) == list):
                    article[key].append(m.group(2))
                else:
                    article[key] = [ article[key] ]
            else:
                article[key] =  m.group(2)
        else:
            if(key):
                if(type(article[key]) == list):
                    article[key][ len(article[key]) - 1] = "%s%s" %(article[key][ len(article[key]) - 1],line) 
                else:
                    article[key] = "%s%s" %(article[key], line) #continuation of last line 
            else:
                raise Exception("Invalid data at line %d: %s" %(indx,line))
    # now handles the article
    if len(articles) != len(pubmed_ids):
        msg = "Expecting %d articles, but harvested %d" %(len(pubmed_ids), len(articles)) 
        raise Exception(msg)
    ret = ''
    for article in articles:
        for key in sorted(article.keys()):
            vals=  article[key]  if(type(article[key]) == list) else [ article[key] ]
            k = MEDLINE_ENDNOTE_MAPPING[key] if key in MEDLINE_ENDNOTE_MAPPING else key
            for val in vals:
                if(key =='PT  '): val = 'JOUR'  # EndNote
                ret ="%s%s- %s\n" %(ret, k, val)
        # end article
        ret+="ER  - \n\n\n"
    return ret

    
sample="""
PMID-        
TY  - JOUR
ID  - 4
T1  - Role of AMP-activated protein kinase in mechanism of metformin action
JF  - The Journal of clinical investigation
JA  - J. Clin. Invest.
M3  - 10.1172/JCI13505
A1  - Zhou,G
A1  - Myers,R
A1  - Li,Y
A1  - Chen,Y
A1  - Shen,X
A1  - Fenyk-Melody,J
A1  - Wu,M
A1  - Ventre,J
A1  - Doebber,T
A1  - Fujii,N
A1  - Musi,N
A1  - Hirshman,M F
A1  - Goodyear,L J
A1  - Moller,D E
VL  - 108
IS  - 8
PY  - 2001/10//
N2  - Metformin is a widely used drug for treatment of type 2 diabetes with no defined cellular mechanism of action. Its glucose-lowering effect results from decreased hepatic glucose production and increased glucose utilization. Metformin's beneficial effects on circulating lipids have been linked to reduced fatty liver. AMP-activated protein kinase (AMPK) is a major cellular regulator of lipid and glucose metabolism. Here we report that metformin activates AMPK in hepatocytes; as a result, acetyl-CoA carboxylase (ACC) activity is reduced, fatty acid oxidation is induced, and expression of lipogenic enzymes is suppressed. Activation of AMPK by metformin or an adenosine analogue suppresses expression of SREBP-1, a key lipogenic transcription factor. In metformin-treated rats, hepatic expression of SREBP-1 (and other lipogenic) mRNAs and protein is reduced; activity of the AMPK target, ACC, is also reduced. Using a novel AMPK inhibitor, we find that AMPK activation is required for metformin's inhibitory effect on glucose production by hepatocytes. In isolated rat skeletal muscles, metformin stimulates glucose uptake coincident with AMPK activation. Activation of AMPK provides a unified explanation for the pleiotropic beneficial effects of this drug; these results also suggest that alternative means of modulating AMPK should be useful for the treatment of metabolic disorders.
KW  - Aminoimidazole Carboxamide
KW  - AMP-Activated Protein Kinases
KW  - Animals
KW  - CCAAT-Enhancer-Binding Proteins
KW  - Diabetes Mellitus, Type 2
KW  - DNA-Binding Proteins
KW  - Enzyme Activation
KW  - Fatty Acids
KW  - Gene Expression
KW  - Glucose
KW  - Hepatocytes
KW  - Humans
KW  - Hypoglycemic Agents
KW  - Male
KW  - Metformin
KW  - Multienzyme Complexes
KW  - Muscle, Skeletal
KW  - Protein Kinase Inhibitors
KW  - Protein Kinases
KW  - Protein-Serine-Threonine Kinases
KW  - Pyrazoles
KW  - Pyrimidines
KW  - Rats
KW  - Rats, Sprague-Dawley
KW  - Ribonucleotides
KW  - RNA, Messenger
KW  - Sterol Regulatory Element Binding Protein 1
KW  - Transcription Factors
SP  - 1167
EP  - 1174
SN  - 0021-9738
UR  - http://www.ncbi.nlm.nih.gov/pubmed/11602624
ER  - 
"""

