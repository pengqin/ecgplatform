from django import template
from django.shortcuts import get_object_or_404

from zmkm.accounts.models import Aged

register = template.Library()

@register.filter
def for_name(value):
    if value:
        aged = get_object_or_404(Aged, pk = int(value))
        return aged.name + " " + aged.cellphone
    else:
        return ''
