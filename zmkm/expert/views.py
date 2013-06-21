# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import urllib2
import re, urlparse

from datetime import datetime

#for pygooglechart
from pygooglechart import Chart
from pygooglechart import SimpleLineChart
from pygooglechart import Axis

from django.contrib.auth.decorators import user_passes_test
from django.template.response import TemplateResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

from zmkm.data.models import DataRecord
from zmkm.common.user_pass_test_func import expert_required
from zmkm.common.utils import easy_api, yield_attrs
from zmkm.common.locals_functions import tame_locals
from zmkm.accounts.models import Expert, Aged, STATUS_CHOICES    #, SubscribeVip
from zmkm.expert.models import Expert_case, Expert_fastreply, Reply
from zmkm.expert.forms import ExpertCaseForm, AddVIPRuleForm, EditTemperatureRuleForm, EditHeartBeatRuleForm, AddFastReplyForm, ExpertTeamMemeberForm
from zmkm.data.models import TemperatureRule, HeartBeatRule, TemperatureVipRule, HeartbeatVipRule
from zmkm.accounts.models import SubscribeVip

#XXX APP_KEY shouldn't be here!!
SECRET = u'6d07a37551fc2b7'
APP_KEY = u'c615964dee2c2a6'
PUSH_URL = u'http://www.android-push.com/api/send/?secret=%s&app_key=%s&alias=%s&msg=%s'


@user_passes_test(expert_required)
def expert_index(request):
    try:
        vip_users = []
        for v in SubscribeVip.objects.all():
            vip_users.append(v.aged.id)
        all_cases = Expert_case.objects.filter(expert=request.user.userprofile.expert, handle=False).order_by('-id')

        if request.GET.get('emergency'):
            all_cases.order_by('datarecord__heart_abnormal')

        cases = []
        vip_cases = []
        for c in all_cases:
            if c.datarecord.aged.id in vip_users:
                vip_cases.append(c)
            else:
                cases.append(c)
        
        cases_count = all_cases.count()
                
        reply_heart = Expert_fastreply.objects.filter(expert=request.user.userprofile.expert, item=u'心电图')
        reply_tempr = Expert_fastreply.objects.filter(expert=request.user.userprofile.expert, item=u'体温')
        expert = Expert.objects.get(user=request.user)
        
        paginator = Paginator(vip_cases+cases, 10) # Show 10 cases per page
        page = request.GET.get('page')
        try:
            cases = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            cases = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            cases = paginator.page(paginator.num_pages)
        
        startPage = cases.number - 5
        endPage = cases.number + 5
        page_numbers = [n for n in range(startPage, endPage) if n > 0 and n <= paginator.num_pages]        
        ctx = {'cases': cases,
               'vip_cases': vip_cases,
               'cases_count': cases_count,
               'reply_heart': reply_heart,
               'reply_tempr': reply_tempr,
               'expert': expert,
                'paginator': paginator,
                'page': cases.number,
                'pages': paginator.num_pages,
                'page_numbers': page_numbers,
                'next': cases.next_page_number(),
                'previous': cases.previous_page_number(),
                'has_next': cases.has_next(),
                'has_previous': cases.has_previous(),
                'show_first': 1 not in page_numbers,
                'show_last': paginator.num_pages not in page_numbers,
               }
        return TemplateResponse(request, 'expert/index.html', ctx)
    except Exception,e:
        print e
        return redirect('/')

def urlEncodeNonAscii(b):
    return re.sub('[\x80-\xFF]', lambda c: '%%%02x' % ord(c.group(0)), b)

def iriToUri(iri):
    parts= urlparse.urlparse(iri)
    return urlparse.urlunparse(part.encode('idna') if parti==1 else urlEncodeNonAscii(part.encode('utf-8')) for parti, part in enumerate(parts))

def push_result(alias, msg):
    url = PUSH_URL % (SECRET, APP_KEY, alias, msg)
    url = iriToUri(url)
    urlobj = urllib2.urlopen(url)
    result = urlobj.read()
    return result

@user_passes_test(expert_required)
def handle(request, id):
    case = Expert_case.objects.get(id=id)
    expert = Expert.objects.get(user=request.user)
    aged = case.datarecord.aged
    if request.method == 'POST':
        form = ExpertCaseForm(request.POST)
        if form.is_valid():            
            if form.data.get('heart_result', '') or form.data.get('temp_result', ''):
                case.handle = True 
                DataRecord.objects.filter(pk=case.datarecord.pk).update(handle=True)
                case.handletime = datetime.now()
                case.save()                              
                reply = Reply.objects.create(expert=expert, aged=aged, datarecord=case.datarecord, result=form.data.get('result', ''), content=form.data.get('heart_result', '') + form.data.get('temp_result', ''))

                return redirect('expert_index')            
    else:
        form = ExpertCaseForm()
    ctx = {'form':form, 'case': case, 'aged': aged, 'expert': expert}
    return TemplateResponse(request, 'expert/handle_case.html', ctx)

@user_passes_test(expert_required)
def fast_handle(request, case_id):
    case = Expert_case.objects.get(id=case_id)
    expert = Expert.objects.get(user=request.user)
    aged = case.datarecord.aged
    fast_replies = Expert_fastreply.objects.filter(expert=expert)
    if request.method == 'POST':
        fast_reply_id = request.POST.get('fr_id', "")
        if fast_reply_id:
            expert_fastreply = get_object_or_404(Expert_fastreply, id=fast_reply_id)
            result = expert_fastreply.get_item_display()
            content = expert_fastreply.reply
            case.handle = True
            case.heart_result = content
            case.save()
            Reply.objects.create(expert=expert, aged=aged, datarecord=case.datarecord, result=result, content=content)
            return redirect('expert_index') 
    ctx = {'case': case, 'aged': aged, 'expert': expert, 'fast_replies': fast_replies}
    return TemplateResponse(request, 'expert/fast_reply.html', ctx)

@user_passes_test(expert_required)
def ignore(request, id):
    case = Expert_case.objects.get(id=id)
    case.handle = True
    case.handletime = datetime.now()
    case.save()
    alias = case.datarecord.aged.cellphone
    msg = u"{'denoter':" + str(case.datarecord.denoter) + u", 'msg':" + u"经专家确认，您的检测结果正常。}"    
    push_result(alias, msg)
    return redirect('expert_index')

@user_passes_test(expert_required)
def add_fast_reply(request):
    expert = Expert.objects.get(user=request.user)
    if request.method == 'POST':        
        form = AddFastReplyForm(request.POST)
        postdata = request.POST.copy()
        if form.is_valid():
            hrange = postdata['hrange']
            item = postdata['item']           
            reply = postdata['reply']            
            Expert_fastreply.objects.create(expert = expert, hrange=hrange, item = item, reply = reply)
            return redirect('list_fast_reply')
    else:
        form = AddFastReplyForm()       
    ctx = {'form': form, 'expert': expert}
    return TemplateResponse(request, 'expert/add_fast_reply.html', ctx)

@user_passes_test(expert_required)
def list_fast_reply(request):
    expert = Expert.objects.get(user=request.user)
    fast_replies = Expert_fastreply.objects.filter(expert=expert)
    ctx = {'expert': expert, 'fast_replies': fast_replies}
    return TemplateResponse(request, 'expert/list_fast_reply.html', ctx)

@user_passes_test(expert_required)
def list_all_other_fast_reply(request):
    expert = Expert.objects.get(user=request.user)
    fast_replies = Expert_fastreply.objects.filter(~Q(expert=request.user))
    return render(request, 'expert/list_fast_reply.html', tame_locals())


@user_passes_test(expert_required)
def delete_fast_reply(request):
    if request.method == 'POST':
        postdata = request.POST.copy()
        fr_id = postdata.get('fr_id', None)        
        if fr_id:
            Expert_fastreply.objects.get(pk=fr_id).delete()       
        return redirect('list_fast_reply')
    else:
        return redirect('expert_index') 

def expert_public_profile(request, id):
    expert = Expert.objects.get(id=id)
    return render(request, 'expert/expert_public_profile.html', {'expert': expert})

@user_passes_test(expert_required)
def emergency_count(request):
    expert = Expert.objects.get(user=request.user)
    emergency_count = Expert_case.objects.filter(expert=expert, datarecord__handle=False, datarecord__heart_abnormal=True).count()
    
    return easy_api({'emergency_count': emergency_count,
                    'expert': expert.name
                    })

@user_passes_test(expert_required)
def expert_total_cases(request):
    expert = Expert.objects.get(user=request.user)
    
    # TODO this might triger a slow-down in the furture, optimization needed
    vip_users = []
    for v in SubscribeVip.objects.all():
        vip_users.append(v.aged.id)

    all_cases = Expert_case.objects.filter(expert=expert)
    if request.GET.get('emergency'):
        all_cases = all_cases.order_by('datarecord__heart_abnormal')
    else:
        all_cases = all_cases.order_by('-id')
    cases = []
    vip_cases = []
    for c in all_cases:
        if c.datarecord.aged.id in vip_users:
            vip_cases.append(c)
        else:
            cases.append(c)
   
    paginator = Paginator(vip_cases+cases, 10) # Show 10 cases per page
    page = request.GET.get('page')
    try:
        cases = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        cases = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        cases = paginator.page(paginator.num_pages)
    
    startPage = cases.number - 5
    endPage = cases.number + 5
    page_numbers = [n for n in range(startPage, endPage) if n > 0 and n <= paginator.num_pages]
    
    reply_heart = Expert_fastreply.objects.filter(expert=request.user.userprofile.expert, item=u'心电图')
    reply_tempr = Expert_fastreply.objects.filter(expert=request.user.userprofile.expert, item=u'体温')
    
    ctx = {
        'expert': expert,
        "cases": cases,
        'vip_cases': vip_cases,
        'paginator': paginator,
        'page': cases.number,
        'pages': paginator.num_pages,
        'page_numbers': page_numbers,
        'next': cases.next_page_number(),
        'previous': cases.previous_page_number(),
        'has_next': cases.has_next(),
        'has_previous': cases.has_previous(),
        'show_first': 1 not in page_numbers,
        'show_last': paginator.num_pages not in page_numbers,
        'reply_heart': reply_heart,
        'reply_tempr': reply_tempr,
    }

    return TemplateResponse(request, 'expert/total_cases.html', ctx)            

@user_passes_test(expert_required)
def add_rule(request):
    expert = Expert.objects.get(user=request.user)
    if request.method == 'POST':        
        form = AddVIPRuleForm(request.POST)
        postdata = request.POST.copy()
        if postdata['item'] == 'temperature' and form.is_valid():
            aged = Aged.objects.get(pk=int(postdata['aged']))
            rel = postdata['rel']
            try:
                value_a = float(postdata['value_a'])
                value_b = float(postdata['value_b'])
            except ValueError:
                value_b = None
            reason = postdata['reason']
            temperature_rule = TemperatureRule.objects.create(
                                        rel = rel,
                                        value_a = value_a,
                                        value_b = value_b,
                                        isviprule = True)
            TemperatureVipRule.objects.create(
                                        expert = expert,
                                        aged = aged,
                                        temperature_rule = temperature_rule,
                                        reason = reason)
            return redirect('list_rule')
        if postdata['item'] == 'heartbeat' and form.is_valid():
            aged = Aged.objects.get(pk=int(postdata['aged']))
            rel = postdata['rel']
            try:
                value_a = float(postdata['value_a'])
                value_b = float(postdata['value_b'])
            except ValueError:
                value_b = None
            reason = postdata['reason']
            heartbeat_rule = HeartBeatRule.objects.create(
                                        rel = rel,
                                        value_a = value_a,
                                        value_b = value_b,
                                        isviprule = True)
            HeartbeatVipRule.objects.create(
                                        expert = expert,
                                        aged = aged,
                                        heartbeat_rule = heartbeat_rule,
                                        reason = reason)
            return redirect('list_rule')
    else:
        form = AddVIPRuleForm()       
    ctx = {'form': form, 'expert': expert}
    return TemplateResponse(request, 'expert/add_rule.html', ctx)

@user_passes_test(expert_required)
def list_rule(request):
    expert = Expert.objects.get(user=request.user)
    t_rules = TemperatureVipRule.objects.filter(expert=request.user.userprofile.expert).order_by('-id')
    h_rules = HeartbeatVipRule.objects.filter(expert=request.user.userprofile.expert).order_by('-id')
    gt_rules = TemperatureRule.objects.filter(isviprule=False)
    gh_rules = HeartBeatRule.objects.filter(isviprule=False)
    ctx = {
        'expert': expert,
        "t_rules": t_rules,
        "h_rules": h_rules,
        "gt_rules": gt_rules,
        "gh_rules": gh_rules,       
    }
    return TemplateResponse(request, 'expert/list_rule.html', ctx) 

@user_passes_test(expert_required)
def edit_rule(request, type, id):
    expert = Expert.objects.get(user=request.user)
    if request.method == 'POST':
        postdata = request.POST.copy()
        if type == 'temperature':
            t = TemperatureVipRule.objects.get(pk=id)
            form = EditTemperatureRuleForm(postdata, instance=t.temperature_rule)
            if form.is_valid():
                form.save()
                return redirect('list_rule')
        elif type == 'heartbeat':
            h = HeartbeatVipRule.objects.get(pk=id)
            form = EditHeartBeatRuleForm(postdata, instance=h.heartbeat_rule)
            if form.is_valid():
                form.save()
                return redirect('list_rule')
    else:
        if type == 'temperature':
            t = TemperatureVipRule.objects.get(pk=id)
            form = EditTemperatureRuleForm(instance=t.temperature_rule)
        elif type == 'heartbeat':
            h = HeartbeatVipRule.objects.get(pk=id)
            form = EditHeartBeatRuleForm(instance=h.heartbeat_rule)
    ctx = {
        'expert': expert,
        'form': form,      
    }
    if type == 'temperature':
        ctx['t'] = t
    elif type == 'heartbeat':
        ctx['h'] = h
    return TemplateResponse(request, 'expert/edit_rule.html', ctx) 

@user_passes_test(expert_required)
def delete_rule(request):
    if request.method == 'POST':
        postdata = request.POST.copy()
        t_rule_id = postdata.get('t_rule_id', None)
        h_rule_id = postdata.get('h_rule_id', None)
        if t_rule_id:
            TemperatureVipRule.objects.get(pk=t_rule_id).delete()
        elif h_rule_id:
            HeartbeatVipRule.objects.get(pk=h_rule_id).delete()
        return redirect('list_rule')
    else:
        return redirect('expert_index')          


@user_passes_test(expert_required)
def status_toggle(request):
    """Will toggle expert status into next"""
    expert = get_object_or_404(Expert, user=request.user)
    length = STATUS_CHOICES.__len__()
    previous_index = int(expert.status)
    try:
        current_index = previous_index + 1 if previous_index < length-1 else 0
        expert.status = STATUS_CHOICES[current_index][0]
        expert.save()
    except:
        current_index = 0
        expert.status = current_index
    return easy_api({'previousIndex':previous_index,
                    "previousData":STATUS_CHOICES[previous_index],
                    "currentIndex":current_index,
                    "currentData":STATUS_CHOICES[current_index]})

    
@user_passes_test(expert_required)
def team_memeber(request, action):
    
    expert = get_object_or_404(Expert,
                               userprofile_ptr=request.user.userprofile.id)
    result = {'action':action}
    result.update({'team':[yield_attrs(crew,
                                       ['name','status','title',
                                        'id']) for crew in expert.team.all()]})
    
    return easy_api(result)

@user_passes_test(expert_required)
def team_memeber_admin(request):

    expert = get_object_or_404(Expert,
                               userprofile_ptr=request.user.userprofile.id)

    if request.method == 'POST':
        form = ExpertTeamMemeberForm(request.POST, instance=expert)
        if form.is_valid():
            form.save()
    else:
        form = ExpertTeamMemeberForm(instance=expert)

    return render(request, 'expert/team_memeber_admin.html', tame_locals())

@user_passes_test(expert_required)
def check_team_memeber(request, crew_id):
    
    expert = get_object_or_404(Expert,
                               userprofile_ptr=request.user.userprofile.id)
    if int(crew_id) in [team.id for team in expert.team.all()]:

        crew = get_object_or_404(Expert,
                                userprofile_ptr=crew_id)
        cases = Expert_case.objects.filter(expert=expert,
                                           handle=False).order_by('-id')
    else:
        return easy_api(
                    {'Error':"Expert:%s doesn't belong to your team" % crew_id},
                    status=403)
    return render(request, "expert/check_team_memeber.html", tame_locals()) 
