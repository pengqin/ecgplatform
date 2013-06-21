# -*- coding: utf-8 -*-s
#
# urls.py
# Langzi
# Project LangZi
# Copyright © 2012 AragonCS
# @author: Meng Zhuo
# 

from django.conf.urls import patterns, url
from zmkm.apkinfo.views import update, update_with_signature


urlpatterns = patterns('',
    
    url( r'^update/$', update, name='apk_update'),
    url( r'^update-with-signature', update_with_signature,
        name="apk_update_with_signature")
)
