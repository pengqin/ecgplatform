# -*- coding: utf-8 -*-s
#
# admin.py
# Langzi
# Project LangZi
# Copyright © 2012 AragonCS
# @author: Meng Zhuo
#
from django.contrib import admin

from zmkm.apkinfo.models import APK, SignedAPK


class APKAdmin(admin.ModelAdmin):

    list_display = ('version', 'package')
    search_fields = ('version', 'descritption')
    ordering = ('-version',)

admin.site.register(APK, APKAdmin)

class SignedAPKAdmin(admin.ModelAdmin):

    list_display = ('version', 'package')
    search_fields = ('version', 'descritption')
    ordering = ('-version',)

admin.site.register(SignedAPK, SignedAPKAdmin)
