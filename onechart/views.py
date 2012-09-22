from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
from onechart import settings
import json

@require_http_methods(["GET", "POST", "HEAD"])
def home(req):
    template = loader.get_template('home.html')
    #ctx = gf_template.get_context(req, {})
    ctx = RequestContext(req, {})
    ctx.node_server= settings.NODE_SERVER or 'ONE-CHART.COM'
    print "node server is %s" %ctx.node_server
    return HttpResponse(template.render(ctx))


def schema(req):
    """
    Show database schema
    """
