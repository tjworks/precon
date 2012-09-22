# Create your views here.
from aifc import Error
from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from myutil import fileutil
from myutil.downloadutil import createFileDownloadResponse
from onechart import mongo
from onechart.models import Network, Connection
from onechart.webutils import SmartResponse
import json
import logging
import traceback
logger = logging.getLogger(__name__)

@require_http_methods(["GET", "POST", "HEAD"])
def handler(req, action=None, args=None):
    print("handling %s ,method %s" %(req.path_info, req.method))
    
    if(action == 'export'):
        ids = args.split(",")
        ids = [pmid[4:] for pmid in ids ]
        from inout import pubmed
        ret = pubmed.exportReference(ids)
        logger.debug("######## MEDLINE\n%s" %ret)
        return createFileDownloadResponse(contents=ret)
        
    return HttpResponse("OK!")

def persist(req):
    jsondata = req.REQUEST.get("data")
    initdata = json.loads(jsondata)
    logger.debug("Persisting")    
    logger.debug( "%s" % (initdata) )
    fileutil.writeFile("test1", jsondata)
        
    try:
        if(initdata['_id'][:4] == 'conn'):
            con = Connection(initdata)
            con.save()
            return SmartResponse(con._id, req)            
        else:    
            network = Network(initdata)
            network.save()
            index(network.name, network)
            return SmartResponse(network._id, req)    
    except Error as e:
        logger.error("Error saving data: %s" %traceback.format_exc())
        return SmartResponse(e, req)

def index(keywords, obj):
    if (isinstance (keywords, basestring)):
        keywords = keywords.split()
    for kwd in keywords:        
        if(not kwd): continue;
        kwd = kwd.lower()                               
        updates = {}
        updates['names.'+ obj._id]  =  obj.name
        col =mongo.getCollection('indices')                               
        col.update(
              {'_id': kwd},                                     
              {'$set': updates, '$addToSet':{'ids' :obj._id}},                     
              upsert=True
         );                               
