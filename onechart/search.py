"""
proxy for client side JS due to the xsite security limitation
"""
from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from onechart import mongo, models
from onechart.webutils import SmartResponse
import json
import re
@require_http_methods(["GET", "POST", "HEAD"])
def handler(req):
	q = req.REQUEST.get("term")
	if not q: return SmartResponse(Exception("Missing parameter: term"), req)
	q = {'_id':{'$regex': '^%s' %q } }
	ret = []
	tmp = []
	for r in mongo.getCollection('indices').find(q):
		if not 'names' in r: continue
		for id, name in r['names'].items():
			if id in tmp: continue;
			tmp.append(id)
			name = name[0:20]
			if id[0:4] in models.prefix_mapping:
				col = models.prefix_mapping[id[0:4]]
				name = "%s: %s" %(col, name)
			ret.append( {'label':name, 'value':id} )
		if(len(ret)>20): break  # max 20 results
				
	return SmartResponse(ret, req)	

