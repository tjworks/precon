"""
proxy for client side JS due to the xsite security limitation
"""
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from onechart import mongo, models, settings
from onechart.webutils import SmartResponse
import json
import os
import re
import tempfile
import logging

CSSFILE = "/static/ext/resources/css/cssfile.css"


logger = logging.getLogger(__name__)
@require_http_methods(["GET", "POST", "HEAD"])
def handler(req):
	svgContent = req.REQUEST.get("svg")
	fmt = req.REQUEST.get("format") or 'image/png'
	if not svgContent: return SmartResponse(Exception("Missing parameter: svg"), req)
	logger.debug("converting svg to %s" %fmt)
	header = """
	<?xml version="1.0" standalone="no"?>
	<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
	"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
	<?xml-stylesheet type="text/css" href="%s/%s" ?> 
	""" % (settings.PROJECT_PATH, CSSFILE)
	svgContent =   header + svgContent  

	# write svg to temporary file
	logger.debug("writing to tmp file")
	tmpfile = tempfile.NamedTemporaryFile(delete=False)
	with tmpfile:
		tmpfile.write(svgContent)
	with open(tmpfile.name) as f:
		logger.debug("Read back %s " % f.read())
	tmpdir = "%s/static/tmp" %settings.PROJECT_PATH
	if(not os.path.exists(tmpdir)): os.mkdir(tmpdir)
	outfile = tempfile.mkstemp(dir=tmpdir)
	import subprocess
	cmd = ["rasterizer", "-m",  fmt, "-o", outfile[1], tmpfile.name]
	try:	 
		logger.debug("Invoking rasterizer : %s" % cmd)
		result = subprocess.check_output(cmd)
		logger.debug("rasterizer result: %s" %result)
		if( 'success' in result):
			hr = HttpResponseRedirect("/tmp/%s" %outfile)
			hr.set_cookie("fileDownload", "true", path="/")
			return hr
		return SmartResponse(Exception(result), req)		
	except Exception as ex:
		return SmartResponse(ex, req)
		 
