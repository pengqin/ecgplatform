'''
Created on 2012-5-6

@author: liwenjian
'''
from django.conf.urls import patterns, url

urlpatterns = patterns('zmkm.aged.views',
    url(r'^index/$', 'aged_index', name='aged_index'),
    url(r'^aged-public-profile/(?P<id>\d+)/$', 'aged_public_profile', name='aged_public_profile'),
    url(r'^aged-total-data/$', 'aged_total_data', name='aged_total_data'),
    url(r'^aged-history-data/(?P<id>\d+)/$', 'aged_history_data', name='aged_history_data'),
)
