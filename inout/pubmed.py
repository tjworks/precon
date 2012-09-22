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

ENDNOTE=1
ZOTERO=2

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

    #url = "http://togows.dbcls.jp/entry/pubmed/" 
    #url = 'http://www.ncbi.nlm.nih.gov/pubmed'
    #pubmed_ids = '19465464,18945920'.split(",")
    url="http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=medline&retmode=text&id="    
    ids = ",".join(pubmed_ids)
    url += ids
    logger.debug(  "Loading %s" %url)
    r = requests.get(url)
    if r.status_code == 200:
        from django.utils.encoding import smart_str
        content = smart_str(r.text)
    else:
        raise Exception("Failed to open %s" %url)
    #print content 
    #from myutil import fileutil
    #fileutil.writeFile("out.html", content)
    
    return medline2ris(content)
    # content retrieved from togows is in RIS format
    # i.e., 4 char identifier, 1 dash, 1 space
    # if line does not start with this pattern, it is treated as a continuation of previous line
    # A blank line indicates the end of one article
def medline2ris( content, style=ENDNOTE):    
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
    #if len(articles) != len(pubmed_ids):
    #    msg = "Expecting %d articles, but harvested %d" %(len(pubmed_ids), len(articles)) 
    #    raise Exception(msg)
    ret = ''
    for article in articles:
        ret+="TY  - JOUR\r\n"
        tmp = {}
        for key in article.keys():
            if (key not in MEDLINE_ENDNOTE_MAPPING):
                tmp[key] = article[key]  
            else:
                tmp[MEDLINE_ENDNOTE_MAPPING[key]] = article[key]
        
        for key in sorted(tmp.keys()):
            vals=  tmp[key]  if(type(tmp[key]) == list) else [ tmp[key] ]
            for val in vals:                
                ret ="%s%s- %s\r\n" %(ret, key, val)
        # end article
        ret+="ER  - \r\n\r\n\r\n"
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

sample_ris= """
PMID- 19465464
OWN - NLM
STAT- MEDLINE
DA  - 20090525
DCOM- 20090707
LR  - 20120306
IS  - 1756-1833 (Electronic)
IS  - 0959-535X (Linking)
VI  - 338
DP  - 2009
TI  - Newer agents for blood glucose control in type 2 diabetes: summary of NICE
      guidance.
PG  - b1668
LID - 10.1136/bmj.b1668 [doi]
LID - bmj.b1668 [pii]
AD  - Cambridge University Hospitals NHS Foundation Trust, Cambridge CB2 0QQ.
      aia31@medschl.cam.ac.uk
FAU - Adler, Amanda I
AU  - Adler AI
FAU - Shaw, Elizabeth J
AU  - Shaw EJ
FAU - Stokes, Tim
AU  - Stokes T
FAU - Ruiz, Francis
AU  - Ruiz F
CN  - Guideline Development Group
LA  - eng
PT  - Journal Article
DEP - 20090522
PL  - England
TA  - BMJ
JT  - BMJ (Clinical research ed.)
JID - 8900488
RN  - 0 (Blood Glucose)
RN  - 0 (Dipeptidyl-Peptidase IV Inhibitors)
RN  - 0 (Hypoglycemic Agents)
RN  - 0 (Insulin)
RN  - 0 (Peptides)
RN  - 0 (Thiazolidinediones)
RN  - 0 (Venoms)
RN  - 141732-76-5 (exenatide)
SB  - AIM
SB  - IM
MH  - *Blood Glucose
MH  - Decision Making
MH  - Diabetes Mellitus, Type 2/*drug therapy
MH  - Dipeptidyl-Peptidase IV Inhibitors/therapeutic use
MH  - Humans
MH  - Hypoglycemic Agents/*therapeutic use
MH  - Insulin/therapeutic use
MH  - Peptides/therapeutic use
MH  - *Practice Guidelines as Topic
MH  - Thiazolidinediones/therapeutic use
MH  - Venoms/therapeutic use
IR  - Adler A
FIR - Adler, Amanda
IR  - Allerdyce C
FIR - Allerdyce, Claudette
IR  - Doherty T
FIR - Doherty, Tony
IR  - Farmer A
FIR - Farmer, Andrew
IR  - Goenka N
FIR - Goenka, Niru
IR  - Hadley-Brown M
FIR - Hadley-Brown, Martin
IR  - Home P
FIR - Home, Philip
IR  - Ivory P
FIR - Ivory, Philip
IR  - Johns Y
FIR - Johns, Yvonne
IR  - Lewin I
FIR - Lewin, Ian
IR  - McGuire A
FIR - McGuire, Alistair
IR  - Wood J
FIR - Wood, Julie
IR  - Ayiku L
FIR - Ayiku, Lynda
IR  - Banks E
FIR - Banks, Emma
IR  - Elliott N
FIR - Elliott, Nicole
IR  - Heath M
FIR - Heath, Michael
IR  - Ruiz F
FIR - Ruiz, Francis
IR  - Shaw E
FIR - Shaw, Elizabeth
IR  - Stokes T
FIR - Stokes, Tim
EDAT- 2009/05/26 09:00
MHDA- 2009/07/08 09:00
CRDT- 2009/05/26 09:00
PST - epublish
SO  - BMJ. 2009 May 22;338:b1668. doi: 10.1136/bmj.b1668.

PMID- 18945920
OWN - NLM
STAT- In-Process
DA  - 20081230
IS  - 1935-5548 (Electronic)
IS  - 0149-5992 (Linking)
VI  - 32
IP  - 1
DP  - 2009 Jan
TI  - Medical management of hyperglycemia in type 2 diabetes: a consensus algorithm for
      the initiation and adjustment of therapy: a consensus statement of the American
      Diabetes Association and the European Association for the Study of Diabetes.
PG  - 193-203
AB  - The consensus algorithm for the medical management of type 2 diabetes was
      published in August 2006 with the expectation that it would be updated, based on 
      the availability of new interventions and new evidence to establish their
      clinical role. The authors continue to endorse the principles used to develop the
      algorithm and its major features. We are sensitive to the risks of changing the
      algorithm cavalierly or too frequently, without compelling new information. An
      update to the consensus algorithm published in January 2008 specifically
      addressed safety issues surrounding the thiazolidinediones. In this revision, we 
      focus on the new classes of medications that now have more clinical data and
      experience.
AD  - Diabetes Center, Massachusetts General Hospital, Boston, Massachusetts, USA.
      dnathan@partners.org
FAU - Nathan, David M
AU  - Nathan DM
FAU - Buse, John B
AU  - Buse JB
FAU - Davidson, Mayer B
AU  - Davidson MB
FAU - Ferrannini, Ele
AU  - Ferrannini E
FAU - Holman, Rury R
AU  - Holman RR
FAU - Sherwin, Robert
AU  - Sherwin R
FAU - Zinman, Bernard
AU  - Zinman B
CN  - American Diabetes Association
CN  - European Association for Study of Diabetes
LA  - eng
PT  - Journal Article
DEP - 20081022
PL  - United States
TA  - Diabetes Care
JT  - Diabetes care
JID - 7805975
SB  - IM
CIN - Diabetes Care. 2009 May;32(5):e58; author rely e59. PMID: 19407068
CIN - Diabetes Care. 2009 Mar;32(3):e34; author reply e37-8. PMID: 19246585
CIN - Diabetes Care. 2009 Mar;32(3):e35-6; author reply e37-8. PMID: 19246586
PMC - PMC2606813
OID - NLM: PMC2606813
EDAT- 2008/10/24 09:00
MHDA- 2008/10/24 09:00
CRDT- 2008/10/24 09:00
PHST- 2008/10/22 [aheadofprint]
PHST- 2008/12/17 [aheadofprint]
AID - dc08-9025 [pii]
AID - 10.2337/dc08-9025 [doi]
PST - ppublish
SO  - Diabetes Care. 2009 Jan;32(1):193-203. Epub 2008 Oct 22.
"""