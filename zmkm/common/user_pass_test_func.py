'''
Created on 2012-5-6

@author: liwenjian
'''
from django.shortcuts import redirect, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from zmkm.accounts.models import Expert, Aged


def aged_required(user):
    try:
        if user.is_authenticated() and get_object_or_404(Aged, user=user):
            return True
        else:
            return False
    except ObjectDoesNotExist:
        return redirect('/')


def expert_required(user):
    try:
        if user.is_authenticated() and get_object_or_404(Expert, user=user):
            return True
        else:
            return False
    except ObjectDoesNotExist:
        return redirect('/')
