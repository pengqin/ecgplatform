# -*- coding: utf-8 -*-s
"""
Common Validators

@author: MengZhuo
"""
from django.core.validators import RegexValidator


__all__ = ('VersionValidator', 'IDcardValidator')
VersionValidator = RegexValidator(r'^(\d\.?)*\d$', 
                                    message=u'请输入版本号')

IDcardValidator = RegexValidator(r'^\d{17}[\dA-Za-z]$',
                                    message=u'请输入身份证号')

CellPhoneValidator = RegexValidator(r'^\+?\d[\d\-]+\d$',
                                    message=u'请输入有效电话号码')
