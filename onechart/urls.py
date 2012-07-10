from django.conf.urls import patterns, include, url
from django.contrib import admin
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'onechart.views.home', name='home'),
    url(r'^$', 'django.views.static.serve', {'document_root': 'web', 'path':'index.html'}),
    url(r'^chart/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'web'}),
    
    # url(r'^onechart/', include('onechart.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
