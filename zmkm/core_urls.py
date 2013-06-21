from django.conf.urls import patterns, include, url
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from ajax_select import urls as ajax_select_urls
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'zmkm.views.home', name='home'),
    # url(r'^zmkm/', include('zmkm.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/lookups/', include(ajax_select_urls)),
    #url(r'^$', 'zmkm.views.home', name='home'),
    url(r'^accounts/', include('zmkm.accounts.urls')),
    url(r'^aged/', include('zmkm.aged.urls')),
    url(r'^expert/', include('zmkm.expert.urls')),
    url(r'^data/', include('zmkm.data.urls')),
    url(r'^api/', include('zmkm.api.urls')),
    url(r'^apk/', include('zmkm.apkinfo.urls')),    
    url(r'^captcha/', include('captcha.urls')),
)
