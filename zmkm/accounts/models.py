# -*- coding: utf-8 -*-
from datetime import datetime
import urllib
import urllib2
import cookielib
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import m2m_changed

from zmkm.settings import PHONE_TALK
from zmkm.common.validators import CellPhoneValidator, IDcardValidator
# 基本信息（必填）：姓名，密码，性别，出生日期（年龄），身份证号码，现住址，紧急联系人（可填两人），紧急联系人电话

# 完整信息（选填）：手机号码，既往病史，身高，体重，有无不良嗜好，常住城市，籍贯 （提示老人填写此信息对医生的诊断有帮助）
USER_TYPE_CHOICES = (
    ('Expert', u'专家'),
    ('Aged', u'客户'),
)


GENDER_CHOICES = (
    ('M', u'男'),
    ('F', u'女'),
)

TITLE_CHOICES = (    
    ('JUNIOR', '初级'),
    ('INTERMED', '中级'),
    ('ADVANCED', '高级'),
)

LIVE_STATE = (
    ('BJ', '北京'),('TJ', '天津'),('HB', '河北'),('SX', '山西'),('NM', '内蒙'),('LN', '辽宁'),
    ('JL', '吉林'),('HLJ', '黑龙江'),('SH', '上海'),('JS', '江苏'),('ZJ', '浙江'),('AH', '安徽'),
    ('FJ', '福建'),('JX', '江西'),('SD', '山东'),('HA', '河南'),('HB', '湖北'),('HN', '湖南'),
    ('GD', '广东'),('GX', '广西'),('HN', '海南'),('CQ', '重庆'),('SC', '四川'),('GZ', '贵州'),
    ('YN', '云南'),('XZ', '西藏'),('SHX', '陕西'),('GS', '甘肃'),('QH', '青海'),('NX', '宁夏'),
    ('XJ', '新疆'),('HK', '香港'),('MC', '澳门'),('TW', '台湾'),    
)

HEALTH_RESULT = (
    ('0', '异常心律'),
    ('1', '心动过缓'),
    ('2', '无明显心律失常'),
    ('3', '心律不齐'),
    ('4', '心率正常，偏快'),
    ('5', '心动过速'),
)

REPLY_METHOD = (
    ('0', '自动回复'),
    ('1', '手工回复'),
    ('2', '半自动回复'),
)

STATUS_CHOICES = ((0,'正常'),
                    (1,'暂离'),
                    )


def reg_iptel(sender, **kwargs):
    if not kwargs['instance'].iptel_number:       #only register once per aged user
        url = PHONE_TALK['url']
        data = {'first_name':'minmin', 
            'last_name':'lee',
            'email':'zmkmi@zmkm.com',
            #'phone':'13419099010',
            'timezone':'Asia/Harbin',
            #'uname':'zmkm000003',
            #'passwd':'zmkm666888',
            #'passwd_r':'zmkm666888',
            'accept':'1', 
            'apu_name':"apu_registration1", 
            '_hidden_first_name':"", 
            "_hidden_last_name":"", 
            '_hidden_email':"", 
            "_hidden_phone":"",
            '_hidden_timezone':"Europe/Berlin",
            'form_cancels':"cancel", 
            'phplib_Session':"c441b2c822716be62ca2302b3c16fd3e"}
        data['uname'] = 'zmkm' + kwargs['instance'].cellphone
        data['passwd'] = PHONE_TALK['password']
        data['passwd_r'] = PHONE_TALK['password']
        cj = cookielib.CookieJar()
        opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
        opener.addheaders = [('User-agent','Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)')]
        urllib2.install_opener(opener)
        req = urllib2.Request(url, urllib.urlencode(data))
        urllib2.urlopen(req)
        kwargs['instance'].iptel_number = data['uname']
        kwargs['instance'].save()

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    
class District(MPTTModel):
    name = models.CharField('地区名', max_length=128, unique=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', verbose_name='上级地区')
    class MPTTMeta:
        order_insertion_by = ['name']
        #verbose_name = '地区列表'
        #verbose_name_plural = '地区列表'
    def __unicode__(self):
        return self.name
    
    class Meta:
        verbose_name = '地区列表'
        verbose_name_plural = '地区列表'

class Expert(UserProfile):
    name = models.CharField(u'姓名', max_length=16)   # the actual name of the Aged
    user_type = models.CharField(max_length=8, choices=USER_TYPE_CHOICES, default='Expert')
    gender = models.CharField('性别', max_length=1, choices=GENDER_CHOICES)
    birthday = models.DateField('生日')
    title = models.CharField('职称', max_length=8, choices=TITLE_CHOICES)
    cellphone = models.CharField('电话', max_length=11, blank=True, null=True, default='', validators=[CellPhoneValidator])
    hospital = models.CharField('所在医院', max_length=64)
    id_card = models.CharField('身份证', max_length=18, validators=[IDcardValidator])
    subscribe = models.ManyToManyField(District, through='Subscribeship')
    status = models.IntegerField('状态', max_length=1, choices=STATUS_CHOICES) 
    team = models.ManyToManyField('self', related_name='crew', blank=True,
                                  null=True, verbose_name=u'团队')
    class Meta:
        verbose_name = '专家'
        verbose_name_plural = '专家'
    
    def __unicode__(self):
        return self.name

    @property
    def age(self):
        return datetime.now().year - self.birthday.year
    
    def get_absolute_url(self):
        return '/health/expert/expert-public-profile/%i/' % self.id


def check_expert_crew(sender, instance, action, reverse, **kwargs):
    """
        check_Expert_crew
        the crew must be lower title than himself, the number
        that settings set also the can't be add to another expert
    """
    pass 

m2m_changed.connect(check_expert_crew, sender=Expert.team.through)

class Aged(UserProfile):
    name = models.CharField(u'姓名', max_length=16)   # the actual name of the Aged
    user_type = models.CharField(max_length=8, choices=USER_TYPE_CHOICES, default='Aged')
    gender = models.CharField('性别', max_length=1, choices=GENDER_CHOICES)
    birthday = models.DateField('出生日期')
    id_card = models.CharField('身份证', max_length=18, blank=True, null=True, validators=[IDcardValidator])    
    address = models.CharField('地址', max_length=256, blank=True, null=True)
    cellphone = models.CharField('电话', max_length=11, validators=[CellPhoneValidator], unique=True)
    live_state = models.CharField('省份', max_length=30, choices=LIVE_STATE)
    past_medical_history = models.CharField('既往病史', max_length=256, blank=True, null=True)
    height = models.IntegerField('身高', blank=True, null=True)    # Unit: cm
    body_weight = models.IntegerField('体重', blank=True, null=True) # Unit: kg
    bad_habits = models.CharField('不良嗜好', max_length=32, blank=True, null=True)
    live_city = models.CharField('居住城市', max_length=32, blank=True, null=True)
    iptel_number = models.CharField('视频通话账号', max_length=32, blank=True, null=True)
    credit_expired_time = models.DateTimeField('过期时间',auto_now_add=True)
    token_count = models.IntegerField('有效次数', max_length=5, default=0)
    imsi = models.CharField('IMSI', max_length=100,unique=True)

    class Meta:
        verbose_name = '客户'
        verbose_name_plural = '客户'  

    def __unicode__(self):
        return self.name
    
    @property
    def age(self):
        return datetime.now().year - self.birthday.year
    
    def get_absolute_url(self):
        return '/health/aged/aged-public-profile/%i/' % self.id
#post_save.connect(reg_iptel, sender=Aged)    
      

class Emergency_contacts(models.Model):
    contact_name = models.CharField(u'姓名', max_length=16)
    contact_phone = models.CharField(u'电话', max_length=13)
    aged = models.ForeignKey(Aged, verbose_name=u'老年人')
    class Meta:
        verbose_name = u'紧急联系人'
        verbose_name_plural = u'紧急联系人'
    
    def __unicode__(self):
        return self.contact_name

# The relationship between expert and district with a priority.
class Subscribeship(models.Model):
    expert = models.ForeignKey(Expert, verbose_name='专家')
    district = models.ForeignKey(District, verbose_name='地区')
    priority = models.IntegerField('优先级', default=1, help_text='预留字段，默认值为1')
    class Meta:
        verbose_name = u'订阅关系'
        verbose_name_plural = u'订阅关系'

    
class SubscribeVip(models.Model):
    expert = models.ForeignKey(Expert, verbose_name=u'专家')
    aged = models.ForeignKey(Aged, verbose_name=u'老年人')
    class Meta:
        verbose_name = u'VIP订阅'
        verbose_name_plural = u'VIP订阅'
    
    def __unicode__(self):
        return self.expert.user.username + '<=vip=>' + self.aged.user.username


class Autoreply(models.Model):
    begin_value = models.IntegerField('开始值')
    end_value = models.IntegerField('终到值')
    result = models.CharField('检测结果', choices=HEALTH_RESULT, max_length=40)
    suggest = models.TextField('专家建议', max_length = 240)
    
    class Meta:
        verbose_name = u'自动回复'
        verbose_name_plural = u'自动回复'
    
    def __unicode__(self):
        return self.result

class Choosereply(models.Model):
    reply_method = models.CharField('回复方式', choices=REPLY_METHOD, max_length=40)
    setat = models.DateTimeField('最后选定时间', auto_now=True)
    
    class Meta:
        verbose_name = u'回复方式'
        verbose_name_plural = u'回复方式'
    
    def __unicode__(self):
        return self.reply_method
