# -*- coding: utf-8 -*-
from django.db import models
from zmkm.accounts.models import Aged, Expert
from django.db.models.signals import pre_save, post_save
from zmkm.expert.models import *
from django.contrib.auth.models import User


REL = (
    ('LT', u'小于'),
    ('GT', u'大于'),
    ('EQ', u'等于'),
    ('BT', u'范围'),
    )


FILTER_NAME_CHOICES = (
    ('height', u'身高'),
    ('body_weight', u'体重'),
    ('past_medical_history', u'既往病史'),
    ('age', u'年龄'),
    ('gender', u'性别'),
    )

REL_DICT = {
    'LT': '<',
    'GT': '>',
    'EQ': '==',
    }
                
def checktemp(sender, **kwargs):
    temp_vip_rules = []
    for t in TemperatureVipRule.objects.filter(aged=kwargs['instance'].record.aged):
        temp_vip_rules.append(t.temperature_rule)
    if temp_vip_rules:
        temperature_rules = temp_vip_rules
    else:
        temperature_rules = TemperatureRule.objects.filter(isviprule=False)
    for rule in temperature_rules:
        filter_list = []
        for f in rule.temperaturefilter_set.all():
            if f.rel == 'BT' and f.value_b and f.name in ['height', 'body_weight', 'age']:
                fstr = f.value_a + "<=" + "kwargs['instance'].record.aged." + f.name + "<=" + f.value_b
            else:
                fstr = "kwargs['instance'].record.aged." + f.name + REL_DICT[f.rel]
                if f.name == 'gender':
                    fstr += "'" + f.value_a + "'"
                else:
                    fstr += f.value_a
            filter_list.append(fstr)
                  
        total_filter = ' and '.join(filter_list)
        if not total_filter:
            total_filter = 'True'
  
        if (rule.rel == 'BT' and rule.value_b and rule.value_a <= kwargs['instance'].value <= rule.value_b or\
           rule.rel == 'LT' and kwargs['instance'].value < rule.value_a or\
           rule.rel == 'GT' and kwargs['instance'].value > rule.value_a or\
           rule.rel == 'EQ' and kwargs['instance'].value == rule.value_a) and\
           eval(total_filter):
                kwargs['instance'].record.temp_abnormal = True
                kwargs['instance'].record.save()

class TestOriginalData(models.Model):
    aged = models.ForeignKey(Aged, verbose_name='老年人')
    upload_data = models.TextField('数据')
    upload_time = models.DateTimeField('上传时间')

    class Meta:
        verbose_name = '老年人检测数据json'
        verbose_name_plural = '老年人检测数据json'
    def __unicode__(self):
        return self.aged.user.username


class DataRecord(models.Model):
    aged = models.ForeignKey(Aged, verbose_name='老年人')
    heartrate = models.IntegerField('心率', blank=True, null=True)
    upload_time = models.DateTimeField('上传时间', auto_now_add=True)
    heart_abnormal = models.BooleanField('心率异常', default=False)
    ediogram_abnormal = models.BooleanField('心律异常', default=False)
    temp_abnormal = models.BooleanField('体温异常', default=False)
    handle = models.BooleanField('是否已处理', default=False)
    denoter = models.CharField('标志位', max_length=100, blank=True, null=True)
    heartbeatdata = models.TextField('心电数据', blank=True, null=True)
    edi1 = models.ImageField('心电图1', upload_to='edi', blank=True, null=True)
    edi2 = models.ImageField('心电图2', upload_to='edi', blank=True, null=True)
    edi3 = models.ImageField('心电图3', upload_to='edi', blank=True, null=True)

    class Meta:
        verbose_name = '检测记录'
        verbose_name_plural = '检测记录'
    def __unicode__(self):
        return self.aged.name
    

class TemperatureData(models.Model):
    record = models.ForeignKey(DataRecord, verbose_name='老年人检测记录')
    value = models.FloatField('体温值')
    exam_time = models.DateTimeField('检测时间', auto_now_add=True)

    class Meta:
        verbose_name = '体温检测数据'
        verbose_name_plural = '体温检测数据'

    def __unicode__(self):
        return  u'体温： %s' % (self.value, )
post_save.connect(checktemp, sender=TemperatureData)

class TemperatureRule(models.Model):
    rel = models.CharField('关系', max_length=3, choices=REL)
    value_a = models.FloatField('数值1')
    value_b = models.FloatField('数值2', blank=True, null=True, help_text="仅当表示范围时，设置该值。")
    modified = models.DateTimeField(auto_now=True)
    isviprule = models.BooleanField('是否特殊规则')

    class Meta:
        verbose_name = '体温规则'
        verbose_name_plural = '体温规则'

    def __unicode__(self):
        if self.value_b:
            return u'体温：' + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a) + ' ' +\
                str(self.value_b)
        else:
            return u'体温：' + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a)

class  HeartBeatRule(models.Model):
    rel = models.CharField('关系', max_length=3, choices=REL)
    value_a = models.FloatField('数值1')
    value_b = models.FloatField('数值2', blank=True, null=True, help_text="仅当表示范围时，设置该值。")
    modified = models.DateTimeField(auto_now=True)
    isviprule = models.BooleanField('是否特殊规则')
    class Meta:
        verbose_name = '心率规则'
        verbose_name_plural = '心率规则'
    def __unicode__(self):
        if self.value_b:
            return u'心率：' + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a) + ' ' +\
                str(self.value_b)
        else:
            return u'心率：' + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a)

class TemperatureVipRule(models.Model):
    expert = models.ForeignKey(Expert, related_name='expert_temp_vip_rule', verbose_name=u'专家')
    aged = models.ForeignKey(Aged, related_name='aged_temp_vip_rule', verbose_name=u'老年人')
    temperature_rule = models.ForeignKey(TemperatureRule, verbose_name='体温规则')
    reason = models.CharField('设置原因', max_length=64, blank=True, null=True)
    class Meta:
        verbose_name = '体温特殊规则'
        verbose_name_plural = '体温特殊规则'
    def __unicode__(self):
        return self.expert.name + u" 于 " + self.aged.name + u" 的特殊规则 " + self.temperature_rule.__unicode__()

class HeartbeatVipRule(models.Model):
    expert = models.ForeignKey(Expert, related_name='expert_heartbeat_vip_rule', verbose_name='专家')
    aged = models.ForeignKey(Aged, related_name='aged_vip_rule', verbose_name='老年人')
    heartbeat_rule = models.ForeignKey(HeartBeatRule,verbose_name='心率规则')
    reason = models.CharField('设置原因', max_length=64, blank=True, null=True)
    class Meta:
        verbose_name = '心率特殊规则'
        verbose_name_plural = '心率特殊规则'
    def __unicode__(self):
        return self.expert.name + u" 于 " + self.aged.name + u" 的特殊规则 " + self.heartbeat_rule.__unicode__()
    
class TemperatureFilter(models.Model):
    temperature_rule = models.ForeignKey(TemperatureRule, verbose_name='体温规则')
    name = models.CharField('属性', max_length=30, choices=FILTER_NAME_CHOICES)
    rel = models.CharField('关系', max_length=3, choices=REL, help_text='性别不能以“范围”做为过滤条件。既往病史只能以“等于”做为过滤条件。')
    value_a = models.CharField('数值1', max_length=128, help_text="以性别作为过滤条件时，<em> M </em>表示男，<em> F </em>表示女。")
    value_b = models.CharField('数值2', max_length=128, blank=True, null=True, help_text="仅当表示范围时，设置该值。")
    class Meta:
        verbose_name = '体温规则过滤器'
        verbose_name_plural = '体温规则过滤器'
    def __unicode__(self):
        if self.value_b:
            return dict(FILTER_NAME_CHOICES)[self.name] + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a) + ' ' +\
                str(self.value_b) + ' ' + u'>>>>>>>>之于规则>>>>>>>>' +' '+\
                self.temperature_rule.__unicode__()
        else:
            return dict(FILTER_NAME_CHOICES)[self.name] + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a)+ ' ' + u'>>>>>>>>之于规则>>>>>>>>' + ' ' +\
                self.temperature_rule.__unicode__()

class HeartbeatFilter(models.Model):
    heartbeat_rule = models.ForeignKey(HeartBeatRule,verbose_name='心率规则')
    name = models.CharField('属性', max_length=30, choices=FILTER_NAME_CHOICES)
    rel = models.CharField('关系', max_length=3, choices=REL, help_text='性别不能以“范围”做为过滤条件。既往病史只能以“等于”做为过滤条件。')
    value_a = models.CharField('数值1', max_length=128, help_text="以性别作为过滤条件时，<em> M </em>表示男，<em> F </em>表示女。")
    value_b = models.CharField('数值2', max_length=128, blank=True, null=True, help_text="仅当表示范围时，设置该值。")
    class Meta:
        verbose_name = '心率规则过滤器'
        verbose_name_plural = '心率规则过滤器'
    def __unicode__(self):
        if self.value_b:
            return dict(FILTER_NAME_CHOICES)[self.name] + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a) + ' ' +\
                str(self.value_b) + ' ' + u'>>>>>>>>之于规则>>>>>>>>' +' '+\
                self.heartbeat_rule.__unicode__()
        else:
            return dict(FILTER_NAME_CHOICES)[self.name] + ' ' +\
                dict(REL)[self.rel] + ' ' +\
                str(self.value_a)+ ' ' + u'>>>>>>>>之于规则>>>>>>>>' + ' ' +\
                self.heartbeat_rule.__unicode__()

class Gtalkaccount(models.Model):
    account = models.CharField('账号', max_length=64)
    password = models.CharField('密码', max_length=64)
    available = models.BooleanField('是否可用')
    class Meta:
        verbose_name = 'Gtalk账号'
        verbose_name_plural = 'Gtalk账号'
    def __unicode__(self):
        return self.account
    
class RandomReply(models.Model):
    datarecord = models.ForeignKey(DataRecord, verbose_name=u'用户')
    result = models.CharField('自动回复结果', max_length=40)
    reply_time = models.DateTimeField(u'自动回复时间', auto_now_add = True)
    autoreply = models.CharField('自动回复内容', max_length=240)
    
    class Meta:
        verbose_name = u'自动回复内容'
        verbose_name_plural = u'自动回复内容'
    
    def __unicode__(self):
        return self.result
    
class VersionUpdate(models.Model):
    version = models.CharField('版本号', max_length=10, unique=True)
    apk = models.FileField('APK文件', upload_to='apk')
    
    class Meta:
        verbose_name = u'软件升级'
        verbose_name_plural = u'软件升级'
        
    def __unicode__(self):
        return unicode(self.version)
    
