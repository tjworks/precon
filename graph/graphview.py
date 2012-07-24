from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods

from onechart.models import *
from onechart.managers import *


@require_http_methods(["GET", "POST", "HEAD"])
def handler(req, precon_id=None):
    template = loader.get_template('graph.html')
    #ctx = gf_template.get_context(req, {})
    ctx = RequestContext(req, {})
    
    
    
    
    return HttpResponse(template.render(ctx))
