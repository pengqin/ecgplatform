'''
Created on 2012-5-6

@author: liwenjian
'''
from django.contrib import admin
from ajax_select import make_ajax_form
from ajax_select.admin import AjaxSelectAdmin

from zmkm.accounts.models import *
from zmkm.accounts.forms import ExpertAdminForm


class AgedAdmin(admin.ModelAdmin):
    list_display = ('name', 
                    'gender',
                    'birthday', 
                    'id_card', 
                    'cellphone', 
                    'past_medical_history',
                    'bad_habits',
                    'height',
                    'body_weight',
                    'live_city',
                    )
    exclude = ('user_type', )
    search_fields = ['name', 'live_state','cellphone']
    list_filter = ('live_state','gender')
    readonly_fields = ("credit_expired_time",)
    ordering = ['-name']
admin.site.register(Aged, AgedAdmin)
 
class ExpertAdmin(admin.ModelAdmin):
    list_display = ('name',
                    'gender',
                    'birthday',
                    'title',
                    'cellphone',
                    'id_card',
                    'hospital',
                    )
    exclude = ('user_type', )
    date_hierarchy = 'birthday'
    list_editable = ('gender',
                     'birthday',
                     'title',
                     'cellphone',
                     'id_card',
                     'hospital',
                     )
    list_filter = ('hospital',
                   'gender',
                   'title',
                   )
    list_per_page = 12
    search_fields = ['name', 'hospital','cellphone']
    actions_on_top = False
    actions_on_bottom = True

    form = ExpertAdminForm
    
class AutoReplyAdmin(admin.ModelAdmin):
    list_display = ('begin_value', 'end_value', 'result', 'suggest')
    
class Emergency_contacts_admin(AjaxSelectAdmin):
    list_display = ('contact_name', 'contact_phone', 'aged')
    form = make_ajax_form(Emergency_contacts, {'aged':'aged'})
admin.site.register(Emergency_contacts, Emergency_contacts_admin)
    
class SubscribeVipAdmin(AjaxSelectAdmin):
    list_display = ('expert', 'aged')
    form = make_ajax_form(SubscribeVip, {'expert':'expert', 'aged':'aged'})

class SubscribeshipAdmin(admin.ModelAdmin):
    list_display = ('expert', 'district', 'priority')


admin.site.register(Expert, ExpertAdmin)
admin.site.register(Autoreply, AutoReplyAdmin)

#admin.site.register(District, MPTTModelAdmin)
admin.site.register(SubscribeVip, SubscribeVipAdmin)
#admin.site.register(Subscribeship, SubscribeshipAdmin)
class ChoosereplyAdmin(admin.ModelAdmin):
    list_display = ('reply_method', 'setat')

admin.site.register(Choosereply, ChoosereplyAdmin)
