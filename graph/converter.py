"""
proxy for client side JS due to the xsite security limitation
"""
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from myutil.downloadutil import createFileDownloadResponse
from onechart import mongo, models, settings
from onechart.webutils import SmartResponse
import json
import logging
import os
import re
import tempfile

CSSFILE = "/static/ext/resources/css/cssfile.css"


logger = logging.getLogger(__name__)
@require_http_methods(["GET", "POST", "HEAD"])
def handler(req, filename=""):
    svgContent = req.REQUEST.get("svg")
    fmt = req.REQUEST.get("format") or 'image/png'
    if not svgContent: return SmartResponse(Exception("Missing parameter: svg"), req)
    logger.debug("converting svg to %s" %fmt)
    header = """<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <?xml-stylesheet type="text/css" href="%s/%s" ?>
    """ % (settings.PROJECT_PATH, CSSFILE)
    svgContent =   header + svgContent

    # write svg to temporary file
    logger.debug("writing to tmp file")
    tmpfile = tempfile.NamedTemporaryFile(delete=False, suffix=".svg")
    with tmpfile:
        tmpfile.write(svgContent)

    tmpdir = "%s/static/tmp" %settings.PROJECT_PATH
    if(not os.path.exists(tmpdir)): os.mkdir(tmpdir)
    outfile = tempfile.mkstemp(dir=tmpdir, suffix=".%s" %fmt[-3:])
    import subprocess
    cmd = ["rasterizer", "-m",  fmt, "-d", outfile[1], tmpfile.name]
    try:
        logger.debug("Invoking rasterizer : %s" % cmd)
        result = subprocess.check_output(cmd)
        logger.debug("rasterizer result: %s" %result)
        if( 'success' in result):
            return createFileDownloadResponse(outfile[1])
            """
            from myutil import fileutil
            raw = fileutil.contentsOfFile( outfile[1])
            hr = HttpResponse(raw, content_type="application/raw")
            hr.set_cookie("fileDownload", "true", path="/")
            return hr
            """
        return SmartResponse(Exception(result), req)
    except Exception as ex:
        return SmartResponse(ex, req)

