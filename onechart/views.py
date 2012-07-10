from django.views.decorators.http import require_http_methods
from django.http import HttpResponse

@require_http_methods(["GET", "POST", "HEAD"])
def home(req):
	return HttpResponse("Hello Girl Home page")
    