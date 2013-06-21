# -*- coding: utf-8 -*-
from django.forms import ModelForm, TextInput, RadioSelect, Select, Textarea
from django import forms
from zmkm.expert.models import Expert_case, Expert_fastreply
from zmkm.accounts.models import Aged
from zmkm.data.models import TemperatureRule, HeartBeatRule

from zmkm.accounts.forms import ExpertAdminForm 

ITEM = (
    ('', '---------'),
    ('temperature', u'体温'),
    ('heartbeat', u'心率'),
    )
REL = (
    ('', '---------'),
    ('LT', u'小于'),
    ('GT', u'大于'),
    ('EQ', u'等于'),
    ('BT', u'范围'),
    )

class AddVIPRuleForm(forms.Form):
    aged = forms.CharField(label='老年人', widget=TextInput(attrs={'class':'input_medium'}))
    #aged = forms.ModelChoiceField(label='老年人', queryset=Aged.objects.all(), widget=Select(attrs={'class':'select'}))
    #aged  = AutoCompleteSelectField('aged', required=True, help_text=None)
    item = forms.ChoiceField(label='属性',choices=ITEM, widget=Select(attrs={'class':'select'}))
    rel = forms.ChoiceField(label='关系', choices=REL, widget=Select(attrs={'class':'select'}))
    value_a = forms.FloatField(label='数值一', widget=TextInput(attrs={'class':'input_mini'}))
    value_b = forms.FloatField(label='数值二', widget=TextInput(attrs={'class':'input_mini'}), help_text='仅当表示范围时设置该值', required=False)
    reason = forms.CharField(label='设置原因',widget=Textarea(attrs={'class':'input_xxxlarge', 'rows': "3"}), required=False, max_length=64)

    def clean(self):
        value_a = self.cleaned_data.get('value_a')
        value_b = self.cleaned_data.get('value_b')
        rel = self.cleaned_data.get('rel')
        if rel == 'BT':
            if not value_b:
                msg = u'当选择范围时， 数值2为必填'
                self._errors["value_b"] = self.error_class([msg])
            else:
                if value_a > value_b:
                    msg = u'数值1应小于等于数值2'
                    self._errors["value_b"] = self.error_class([msg])
        return self.cleaned_data 

class EditTemperatureRuleForm(ModelForm):
    def clean(self):
        value_a = self.cleaned_data.get('value_a')
        value_b = self.cleaned_data.get('value_b')
        rel = self.cleaned_data.get('rel')
        if rel == 'BT':
            if not value_b:
                msg = u'当选择范围时， 数值2为必填'
                self._errors["value_b"] = self.error_class([msg])
            else:
                if value_a > value_b:
                    msg = u'数值1应小于等于数值2'
                    self._errors["value_b"] = self.error_class([msg])
        return self.cleaned_data 

    class Meta:
        model = TemperatureRule
        fields = ('rel', 'value_a', 'value_b')
        widgets = {
                   'rel': Select(attrs={'class':'select'}),
                   'value_a': TextInput(attrs={'class':'input_mini'}),
                   'value_b': TextInput(attrs={'class':'input_mini'}),
                   }

class EditHeartBeatRuleForm(ModelForm):
    def clean(self):
        value_a = self.cleaned_data.get('value_a')
        value_b = self.cleaned_data.get('value_b')
        rel = self.cleaned_data.get('rel')
        if rel == 'BT':
            if not value_b:
                msg = u'当选择范围时， 数值2为必填'
                self._errors["value_b"] = self.error_class([msg])
            else:
                if value_a > value_b:
                    msg = u'数值1应小于等于数值2'
                    self._errors["value_b"] = self.error_class([msg])
        return self.cleaned_data 

    class Meta:
        model = HeartBeatRule
        fields = ('rel', 'value_a', 'value_b')
        widgets = {
                   'rel': Select(attrs={'class':'select'}),
                   'value_a': TextInput(attrs={'class':'input_mini'}),
                   'value_b': TextInput(attrs={'class':'input_mini'}),
                   }

class ExpertCaseForm(forms.Form):
    result = forms.CharField(label='结果', widget=forms.TextInput(attrs={'class':'input_medium', 'maxlength':'40', "required":"required"}))
    temp_result = forms.CharField(label='专家建议', widget=forms.Textarea(attrs={'class': 'input_xxxlarge', 'rows': "3", 'maxlength':'140', "required":"required"}), required=False)
    heart_result = forms.CharField(label='专家建议', widget=forms.Textarea(attrs={'class': 'input_xxxlarge', 'rows': "3", 'maxlength':'140', "required":"required"}), required=False)

            
    
class AddFastReplyForm(ModelForm):
    class Meta:
        model = Expert_fastreply
        exclude = ('expert',)
        widgets = {
                   'hrange': Select(attrs={'class':'select'}),
                   'item': Select(attrs={'class':'select'}),
                   'reply': Textarea(attrs={'class': 'input_xxxlarge', 'rows': "3", 'maxlength':'140'}),           
            }


class ExpertTeamMemeberForm(ExpertAdminForm):

    class Meta(ExpertAdminForm.Meta):
        fields = ('team',)
        
