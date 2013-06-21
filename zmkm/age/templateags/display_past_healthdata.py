from zmkm.aged.models import Healthdata
from datetime import date, timedelta
from django import template

register = template.Library()

@register.inclusion_tag('tmplatetags/display_past_healthdata.html')
def pasthealthdata(daysago):
    delta = date.today() - timedelta(daysago)
    healthdatas = Healthdata.objects.filter(user=request.user, examtime__=delta).order_by('-examtime')
    