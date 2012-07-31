from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET", "POST", "HEAD"])
def handler(req, precon_id=None):
    if req.REQUEST.get('old'):
        template = loader.get_template('graph.html')
    else:
        template = loader.get_template('ext.html')
    #ctx = gf_template.get_context(req, {})
    ctx = RequestContext(req, {})
    
    
    return HttpResponse(template.render(ctx))
