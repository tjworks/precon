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
	q = {'_id':{'$regex': '^%s' %q.lower() } }
	# filter by entity/network/people etc
	filter = req.REQUEST.get("filter") or None 
	ret = []
	tmp = []
	for r in mongo.getCollection('indices').find(q):
		if not 'names' in r: continue
		for id, name in r['names'].items():
			if id in tmp: continue;
			tmp.append(id)	
			if(not name): continue	
			name = ("%s"%name)[0:80]
			md = ''
			if id[0:4] in models.prefix_mapping:				
				md = models.prefix_mapping[id[0:4]]
				pre = models.model_label_mapping[md]
				label = "%s: %s" %(pre, name)
			
			if(filter and filter!=md): continue
			ret.append( {'label':label, 'value':name, '_id':id} )
		if(len(ret)>50): break  # max 20 results
				
	return SmartResponse(ret, req)	

