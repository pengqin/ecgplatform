# -*- coding: utf-8 -*-
from django.db import models

from zmkm.common.validators import VersionValidator


class APK(models.Model):
    """
    This model for APK management
    """
    version = models.CharField(max_length=100,
                                unique=True,
                                validators=[VersionValidator],
                                verbose_name=u"版本")

    package = models.FileField(upload_to='apk', max_length=255,
                                verbose_name=u'APK文件')

    descritption = models.TextField(max_length=255, verbose_name=u'描述信息')

    modify_time = models.DateTimeField(auto_now_add=True,
                                        verbose_name=u'修改时间')

    class Meta:
        verbose_name = verbose_name_plural = u'APK管理'

    def __unicode__(self):
        return "%s:%s" % (self.version, self.descritption[:30])

class SignedAPK(models.Model):
    """
    This model for APK management
    """
    version = models.CharField(max_length=100,
                                unique=True,
                                validators=[VersionValidator],
                                verbose_name=u"版本")

    package = models.FileField(upload_to='apk', max_length=255,
                                verbose_name=u'APK文件')

    descritption = models.TextField(max_length=255, verbose_name=u'描述信息')

    modify_time = models.DateTimeField(auto_now_add=True,
                                        verbose_name=u'修改时间')

    class Meta:
        verbose_name = verbose_name_plural = u'未签名APK管理'

    def __unicode__(self):
        return "%s:%s" % (self.version, self.descritption[:30])
