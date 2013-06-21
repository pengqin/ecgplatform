# -*- coding: utf-8 -*-
'''
Created on 2012-5-6

@author: liwenjian
'''
from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.forms import TextInput, RadioSelect, PasswordInput, Select
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.conf import settings
from captcha.fields import CaptchaField

from zmkm.accounts.models import District, Aged, Expert
from zmkm.common.validators import CellPhoneValidator, IDcardValidator
import re

GENDER_CHOICES = (
    ('M', u'男'),
    ('F', u'女'),
)

MAX_TEAM_MEMBER = getattr(settings, 'MAX_TEAM_MEMBER', 5)

class RegisterForm(forms.Form):
    # username and password 
    cellphone = forms.CharField(label='手机号码', max_length=11, help_text='手机号码将作为您登录时的用户名', widget=TextInput(attrs={'class':'input_small'}))
    password = forms.CharField(label='密码',  help_text='登录时的服务密码', widget=PasswordInput(attrs={'class':'input_mini'}))
    password2 = forms.CharField(label='再次输入密码', help_text='请再次输入密码', widget=PasswordInput(attrs={'class':'input_mini'}))
    
    # the next fields for profile
    name = forms.CharField(label='姓名', max_length=16, widget=TextInput(attrs={'class':'input_small'}))
    gender = forms.ChoiceField(label='性别', choices=GENDER_CHOICES, widget=RadioSelect(attrs={'class': 'va_m'}))
    birthday = forms.DateField(label='出生日期', help_text='格式样例：1956-03-31', widget=TextInput(attrs={'class':'input_small datepicker'}))
    id_card = forms.CharField(label='身份证号', max_length=18, validators=[RegexValidator(regex=re.compile('^\w{18}|\d{15}$'), code='invalid')], widget=TextInput(attrs={'class': 'input_xlarge'}))
    address = forms.CharField(label='住址', max_length=256, help_text='请尽量详细地填写地址，这可能将对分配为您服务的专家产生影响', widget=TextInput(attrs={'class': 'input_xxlarge'}))
    
    past_medical_history = forms.CharField(label='既往病史', max_length=256, required=False, widget=TextInput(attrs={'class': 'input_small'}))
    height = forms.IntegerField(label='身高', required=False, widget=TextInput(attrs={'class': 'input_mini'}))    # Unit: cm
    body_weight = forms.IntegerField(label='体重', required=False, widget=TextInput(attrs={'class': 'input_mini'})) # Unit: kg
    bad_habits = forms.CharField(label='有无不良嗜好', max_length=32, required=False, widget=TextInput(attrs={'class': 'input_small'}))
    live_city = forms.CharField(label='居住城市', max_length=32, required=False, widget=TextInput(attrs={'class': 'input_mini'}))
    #district = forms.CharField() 
    # the next field for emergency contact
    contact_name1 = forms.CharField(label='紧急联系人', max_length=16, widget=TextInput(attrs={'class': 'input_mini'}))
    contact_phone1 = forms.CharField(label='电话号码', max_length=13, widget=TextInput(attrs={'class': 'input_small'}))
    contact_name2 = forms.CharField(label='紧急联系人', max_length=16, required=False, widget=TextInput(attrs={'class': 'input_mini'}))
    contact_phone2 = forms.CharField(label='电话号码', max_length=13, required=False, widget=TextInput(attrs={'class': 'input_small'}))


    def clean_username(self):
        username_count = User.objects.filter(username=self.cleaned_data['username']).count()
        if username_count > 0:
            raise forms.ValidationError(u'用户名已存在')

        return self.cleaned_data['username']
    
    def clean(self):
        password = self.cleaned_data.get('password')
        password2 = self.cleaned_data.get('password2')
        if password and password2:
            if password != password2:
                self._errors['password'] = self.error_class([u'密码和确认密码不匹配'])
                del self.cleaned_data['password']
                del self.cleaned_data['password2']

        return self.cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField(widget=TextInput(attrs={'class':'input'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input'}))
    captcha = CaptchaField()

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            user = authenticate(username=username, password=password)
            if not user or not user.is_active:
                self._errors['username'] = self.error_class([u'用户名或密码不正确'])

        return self.cleaned_data
    
class LoginFormExpert(forms.Form):
    eusername = forms.CharField(widget=TextInput(attrs={'class':'input'}))
    epassword = forms.CharField(widget=forms.PasswordInput(attrs={'class':'input'}))
    ecaptcha = CaptchaField()

    def clean(self):
        eusername = self.cleaned_data.get('eusername')
        epassword = self.cleaned_data.get('epassword')
        if eusername and epassword:
            user = authenticate(username=eusername, password=epassword)
            if not user or not user.is_active:
                self._errors['eusername'] = self.error_class([u'用户名或密码不正确'])

        return self.cleaned_data

class AgedProfileForm(forms.ModelForm):
    class Meta:
        model = Aged
        exclude = ('user', 'user_type', 'token_count', 'imsi')
        widgets = {
                   'name': TextInput(attrs={'class': 'input_small'}),
                   'gender': RadioSelect(attrs={'class': 'va_m'}),
                   'birthday': TextInput(attrs={'class': 'input_small datepicker'}),
                   'id_card': TextInput(attrs={'class': 'input_xlarge'}),
                   'address': TextInput(attrs={'class': 'input_xxlarge'}),
                   'cellphone': TextInput(attrs={'class': 'input_small', 'readonly': "readonly"}),
                   'past_medical_history': TextInput(attrs={'class': 'input_small'}),
                   'height': TextInput(attrs={'class': 'input_mini'}),
                   'body_weight': TextInput(attrs={'class': 'input_mini'}),
                   'bad_habits': TextInput(attrs={'class': 'input_small'}),
                   'live_city': TextInput(attrs={'class': 'input_mini'}),   
                   #'live_state': Select(attrs={'class': 'input_xlarge'}),                
            }

class ExpertProfileForm(forms.ModelForm):
    cellphone = forms.CharField(max_length=11, required=True, widget=TextInput(attrs={'class': 'input_small'}), validators=[CellPhoneValidator])
    id_card = forms.CharField(max_length=18, required=True, widget=TextInput(attrs={'class': 'input_xlarge'}), validators=[IDcardValidator])

    class Meta:
        model = Expert
        exclude = ('user', 'user_type', 'subscribe', 'status')
        widgets = {
                   'name': TextInput(attrs={'class': 'input_small'}),
                   'gender': RadioSelect(attrs={'class': 'va_m'}),
                   'birthday': TextInput(attrs={'class': 'input_small datepicker'}),
                   'title': RadioSelect(attrs={'class': 'va_m'}),
                   'hospital': TextInput(attrs={'class': 'input_xlarge'}),
            }

class ExpertAdminForm(forms.ModelForm):

    class Meta:
        model=Expert

    def clean(self):
        """Check All crew is lower than self title
            and the numbers of crew
        """
        title = self.cleaned_data.get('title')
        team = self.cleaned_data.get('team')
        
        #check title and group
        for crew in team:
            """ the level JUNIOR < INTERMED
                but the string compare is reversed
                so, we are lucky :)
            """
            if crew.title and crew.title <= title:
                
                raise ValidationError(u'%s［%s］职称高于或等于%s［%s］' %
                        (crew.name, crew.title, 
                         self.instance.name, self.instance.title))

            try:
                leader = Expert.objects.get(title__lt="JUNIOR",
                                            team__in=[crew])
                if leader.id != self.instance.id:
                    raise ValidationError(u'%s已属于%s的团队' % (crew.name,
                                          leader.name))
            except (Expert.DoesNotExist, Expert.MultipleObjectsReturned):
                pass

        if team.__len__() > MAX_TEAM_MEMBER:
            raise ValidationError(u'团队成员人数大于%d' % MAX_TEAM_MEMBER)
        
        return self.cleaned_data
