from aifc import Error
from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from myutil import fileutil
from onechart import mongo
from onechart.models import Network
from onechart.webutils import SmartResponse
import json
import logging
import traceback
logger = logging.getLogger(__name__)

@require_http_methods(["GET", "POST", "HEAD"])
def handler(req, precon_id=None):
    print("handling %s ,method %s" %(req.path_info, req.method))
    if(req.method == 'POST'):
        return persist(req)
            
    template = loader.get_template('ext.html')
    #ctx = gf_template.get_context(req, {})
    
    ctx = RequestContext(req, {})
    ctx.mvc = True if req.META['HTTP_HOST'].find('mvc')>=0 else False
    
    return HttpResponse(template.render(ctx))

def persist(req):
    jsondata = req.REQUEST.get("data")
    initdata = json.loads(jsondata)
    logger.debug("Persisting")    
    logger.debug( "%s" % (initdata) )
    fileutil.writeFile("test1", jsondata)
    
    try:
        network = Network(initdata)
        network.save()
        index(network.name, network)
        return SmartResponse(network._id, req)    
    except Error as e:
        logger.error("Error saving network: %s" %traceback.format_exc())
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
