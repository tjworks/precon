"""
Export reference to RIS format
"""
from copy import copy
from models import BaseModel
from myutil import idtool, fileutil
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
"PT  ":"TY  ",
"AB  ":"AB  ",
"AD  ":"AD  ",
"PMID":"AN  ",
"AU  ":"AU  ",
"AU  ":"AU  ",
"PMC ":"C2  ",
"AID ":"DO  ",
"EDAT":"ET  ",
"JT  ":"J2  ",
"MH  ":"KW  ",
"LA  ":"LA  ",
"FAU ":"N1  ",
"IP  ":"IS  ",
"PT  ":"M3  ",
"FAU ":"N1  ",
"DP  ":"PY  ",
"IS  ":"SN  ",
"PG  ":"SP  ",
"TI  ":"ST  ",
"TA  ":"T2  ",
"TI  ":"TI  ",
"VI  ":"VL  "

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
    logger.debug(  "Writing raw data to tmp/raw-medline.ris")
    fileutil.writeFile("tmp/raw-medline.ris", content)
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
                    article[key][ len(article[key]) - 1] = "%s\r\n%s" %(article[key][ len(article[key]) - 1],line) 
                else:
                    article[key] = "%s\r\n%s" %(article[key], line) #continuation of last line 
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

    
