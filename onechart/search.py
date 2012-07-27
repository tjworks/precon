"""
proxy for client side JS due to the xsite security limitation
"""
from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from onechart.webutils import SmartResponse
import json
import re

@require_http_methods(["GET", "POST", "HEAD"])
def handler(req):
	q = req.REQUEST.get("q")
	if not q: return SmartResponse(Exception("Missing parameter: q"), req)
	
	
	
	return SmartResponse("OK", req)

