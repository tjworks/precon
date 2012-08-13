from django.http import HttpResponse
from django.template import loader
from django.template.context import RequestContext
from django.views.decorators.http import require_http_methods
import json

@require_http_methods(["GET", "POST", "HEAD"])
def home(req):
	template = loader.get_template('home.html')
	#ctx = gf_template.get_context(req, {})
	ctx = RequestContext(req, {})
	return HttpResponse(template.render(ctx))


def schema(req):
	"""
	Show database schema
	"""
