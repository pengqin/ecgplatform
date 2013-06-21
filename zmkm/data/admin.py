from django.contrib import admin
from zmkm.data.models import *
from django.contrib.flatpages.models import FlatPage
from django.contrib.flatpages.admin import FlatPageAdmin as FlatPageAdminOld

from zmkm.expert.forms import EditTemperatureRuleForm, EditHeartBeatRuleForm

class TemperatureDataAdmin(admin.StackedInline):
    model = TemperatureData
    extra = 0


class DataRecordAdmin(admin.ModelAdmin):
    list_display = ('aged', 'heartrate', 'heart_abnormal', 'upload_time',)
    exclude = ('ediogram_abnormal', 'temp_abnormal', 'handle', 'denoter', 'heartbeatdata', 'edi1', 'edi2', 'edi3')    
    search_fields = ['aged__name', 'heartrate']
    list_filter = ('heart_abnormal',)
    date_hierarchy = 'upload_time'
    model = DataRecord
    inlines = [TemperatureDataAdmin, ]
    ordering = ['-upload_time']    

class TemperatureRuleAdmin(admin.ModelAdmin):
    #list_display = ('rel', 'value_a', 'value_b', 'modified', 'isviprule')   
    model = TemperatureRule
    form = EditTemperatureRuleForm
    
class TemperatureVipRuleAdmin(admin.ModelAdmin):
    list_display = ('expert', 'aged', 'temperature_rule', 'reason',)
    search_fields = ['expert__name', 'aged__name', 'reason']
    list_filter = ('expert__name',)   
    model = TemperatureVipRule
    
class HeartBeatRuleAdmin(admin.ModelAdmin):
    #list_display = ('rel', 'value_a', 'value_b', 'modified', 'isviprule')   
    model = TemperatureRule
    form = EditHeartBeatRuleForm 
    
class HeartbeatVipRuleAdmin(admin.ModelAdmin):
    list_display = ('expert', 'aged', 'heartbeat_rule', 'reason',)
    search_fields = ['expert__name', 'aged__name', 'reason']
    list_filter = ('expert__name',)   
    model = TemperatureVipRule
    
class RandomReplyAdmin(admin.ModelAdmin):
    list_display = ('datarecord', 'reply_time', 'result', 'autoreply',)
    search_fields = ['datarecord__aged__name', 'result', 'autoreply']
    list_filter = ('result',)
    date_hierarchy = 'reply_time'   
    model = RandomReply

admin.site.register(DataRecord, DataRecordAdmin)
admin.site.register(TemperatureRule, TemperatureRuleAdmin)
admin.site.register(HeartBeatRule, HeartBeatRuleAdmin)
admin.site.register(TemperatureVipRule, TemperatureVipRuleAdmin)
admin.site.register(HeartbeatVipRule, HeartbeatVipRuleAdmin)
admin.site.register(RandomReply, RandomReplyAdmin)
admin.site.register(VersionUpdate, admin.ModelAdmin)
