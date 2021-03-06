from django.conf.urls import patterns, include, url
from django.contrib import admin
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'onechart.views.home', name='home'),

    url(r'^api/export/(?P<filename>.*)$', 'graph.converter.handler'),
        
    url(r'^api/reference/(?P<action>.*)/(?P<args>.*).ris$', 'inout.views.handler'),
    
    url(r'^api/graph/save.json', 'graph.graphview.handler'),
    
    # graph app
    url(r'^graph/(?P<precon_id>.*)$', 'graph.graphview.handler'),
    
    # search/proxy
    url(r'^search.json', 'onechart.search.handler'),

    #url(r'^assets/(?P<path>.*)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.(css|js|png|gif|swf|jpg|html|htm|pdf|csv|json))$', 'django.views.static.serve', {'document_root': 'static'}),

    # url(r'^onechart/', include('onechart.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),


    # Home page
    url(r'^$', 'onechart.views.home'),

    url(r'^howto$', 'onechart.views.home'),





    # Userena app
    url(r'^accounts/', include('userena.urls')),
)

"""
    url(r'^(?P<path>.*.js)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.png)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.gif)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.swf)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.jpg)$', 'django.views.static.serve', {'document_root': 'static'}),
    url(r'^(?P<path>.*.html)$', 'django.views.static.serve', {'document_root': 'static'}),
    """

