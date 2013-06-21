'''
Created on 2012-5-6

@author: liwenjian
'''
from django.conf.urls import patterns, url

urlpatterns = patterns('zmkm.accounts.views',
    url(r'^register/$', 'aged_register', name='zmkm_register'), # aged man register
    url(r'^login/$', 'aged_login', name='zmkm_login'),
    url(r'^logout/$', 'aged_logout', name='zmkm_logout'),
    url(r'^aged-profile/$', 'aged_profile', name='aged_profile'),
    url(r'^expert-profile/$', 'expert_profile', name='expert_profile'),
)
