"""
proxy for client side JS due to the xsite security limitation
"""
from django.http import HttpResponse
import json

class SmartResponse(HttpResponse):
	'''Like an HttpResponse, but encodes the data as JSON.
	The file-like operations probably won't do what you want.'''
	def __init__(self, obj, request, **kw):		
		mimetype="text/html"
		if(request and request.path_info.find('.json')>0):
			#json format
			if (isinstance(obj, Exception)):
				obj = {'error': "%s" %obj}
			obj = json.dumps(obj)
			mimetype = 'application/json'
		super(SmartResponse, self).__init__(obj, mimetype=mimetype, **kw)
		
