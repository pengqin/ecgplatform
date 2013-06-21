'''
Created on 2012-5-6

@author: liwenjian
'''
from django.conf.urls import patterns, url

urlpatterns = patterns('zmkm.data.views',
    url(r'^upload/$', 'upload', name='upload_data'),
)
