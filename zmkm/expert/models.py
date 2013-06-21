# -*- coding: utf-8 -*-
from django.db import models
from zmkm.accounts.models import Expert, Aged
from zmkm.data.models import DataRecord
ITEMS = (
    (u'体温', u'体温'),
    (u'心电图', u'心电图'),
)

ITEMSX = (
    ('0', '异常心律'),
    ('1', '心动过缓'),
    ('2', '无明显心律失常'),
    ('3', '心律不齐'),
    ('4', '心率正常，偏快'),
    ('5', '心动过速'),
)

RANGE = (
    ('0 - 30', '0 - 30'),
    ('31 - 45', '31 - 45'),
    ('46 - 59', '46 - 59'),
    ('60 - 90', '60 - 90'),
    ('91 - 100', '91 - 100'),
    ('101 - 200', '101 - 200'),
)

class Expert_case(models.Model):
    expert = models.ForeignKey(Expert, verbose_name=u'专家')
    datarecord = models.ForeignKey(DataRecord, verbose_name='检测数据')
    handletime = models.DateTimeField('诊断时间', blank=True, null=True)
    handle = models.BooleanField('是否已诊断')
    heart_result = models.TextField('心电图诊断结果', max_length=512, blank=True, null=True)
    ediogram_result = models.TextField('心率诊断结果', max_length=512, blank=True, null=True)
    temp_result = models.TextField('体温诊断结果', max_length=512, blank=True, null=True)
    
    class Meta:
        verbose_name = '诊断任务'
        verbose_name_plural = '诊断任务'   
    
    def __unicode__(self):
        return self.expert.name
    
    def get_absolute_url(self):
        return "/expert/expert-case/%i/" % self.id
    
class Expert_fastreply(models.Model):
    expert = models.ForeignKey(Expert, verbose_name=u'专家')
    hrange = models.CharField('取值范围', max_length=16, choices=RANGE)
    item = models.CharField('检测结果', max_length=16, choices=ITEMSX)
    reply = models.TextField('快速回复内容', max_length=140)
    class Meta:
        verbose_name = '快速回复'
        verbose_name_plural = '快速回复'
    
    def __unicode__(self):
        return self.expert.name
    
class Reply(models.Model):
    expert = models.ForeignKey(Expert, verbose_name=u'专家')
    aged = models.ForeignKey(Aged, verbose_name=u'客户')
    datarecord = models.ForeignKey(DataRecord, verbose_name=u'检测数据')
    reply_time = models.DateTimeField(u'回复时间', auto_now_add = True)
    readed = models.BooleanField(u'是否已读')
    result = models.CharField('检测结果', max_length=40)
    content = models.TextField('专家建议', max_length=140)
    
    class Meta:
        verbose_name = '手工回复内容'
        verbose_name_plural = '手工回复内容'
    def __unicode__(self):
        return self.expert.name
    
    
        