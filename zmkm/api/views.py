# -*- coding: utf-8 -*-
# Create your views here.
import urllib
import urllib2
import simplejson
from decimal import Decimal
import cookielib
import json
from datetime import timedelta

import logging
logger = logging.getLogger(__name__)
from random  import random
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db.transaction import commit_on_success
from django.contrib.auth import authenticate, logout
from django.db import IntegrityError
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404, redirect
from django.template.loader import render_to_string
from django.utils.timezone import now

     
from zmkm.common.user_pass_test_func import expert_required, aged_required
from zmkm.common.utils import easy_api, easy_serialize
from zmkm.common.validators import CellPhoneValidator
from zmkm.data.models import Gtalkaccount, DataRecord, RandomReply, VersionUpdate
from zmkm.settings import PHONE_TALK, SERVER_HOST, SP_PRODUCTION_ID, SP_SERVICE_ID 
from zmkm.accounts.models import Aged, Emergency_contacts
from zmkm.expert.models import Reply
from zmkm.data.views import choose_reply
from zmkm.apkinfo.models import APK
from zmkm.apkinfo.views import lt_version
SP_REQUEST_DICT = ['msgtype', 'usernumber', 'spnumber', 'mocontent',
                    'linkid', 'motime', 'serviceid', 'gateway',
                    'productid']
FORGET_PASSWORD_REQ_DICT = ['cellphone','test', 'IMSI']

def get_profile(request):
    aged = get_object_or_404(Aged, user=request.user.id)
    info = easy_serialize(aged)
    contacts = easy_serialize(Emergency_contacts.objects.filter(aged=aged))
    
    return easy_api({'baseInfo':info, 'contacts': contacts})


@csrf_exempt
@commit_on_success
def register(request):
    SERVER_ERROR_RESPONSE = {
                             "status": {"code": 500, 
                                        "description": "Internal Server Error"
                             },
                             "metadata": {
                                         "apiVersion": "1.0", 
                                         "request": {
                                                     "url": request.path
                                         }, 
                                         "messages": []
                             }, 
                             "errors": []
    }
    
    BAD_REQUEST_RESPONSE = {
                            "status": {
                                       "code": 400, 
                                       "description": "Bad Request"
                            },
                            "metadata": {
                                         "apiVersion": "1.0", 
                                         "request": {
                                                     "url": request.path
                                         }, 
                                         "messages": []
                            },
                            "errors": []
    }
    
    OK_RESPONSE = {
                   "status": {
                              "code": 200, 
                              "description": "OK"
                   },
                   "metadata": {
                                "apiVersion": "1.0", 
                                "request": {
                                            "url": request.path
                                }, 
                                "messages": []
                    }, 
                   "errors": []
    }

    if request.method == "POST":
        #json_data = simplejson.loads(request.raw_post_data)
        cellphone = request.POST.get('cellphone', '') 
        password = request.POST.get('password', '')
        name = request.POST.get('name', '')
        gender = request.POST.get('gender', '')
        birthday = request.POST.get('birthday', '')
        live_state = request.POST.get('live_state', '')
        #id_card = request.POST.get('id_card', '')
        #address = request.POST.get('address', '')
        contact_name1 = request.POST.get('contact_name1', '')
        contact_phone1 = request.POST.get('contact_phone1', '')
        contact_name2 = request.POST.get('contact_name2', '')
        contact_phone2 = request.POST.get('contact_phone2', '')
        imsi = request.POST.get('IMSI')
        if not cellphone or not password or not name or not gender or not birthday or not live_state or not contact_name1 or not contact_phone1:
            response = SERVER_ERROR_RESPONSE.copy()            
            response["errors"].append(u"信息不完整(一个或多个字段没有填写.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        #if not re.compile("\d{18}|\d{17}\w{1}|\d{15}").match(id_card):
            #response = SERVER_ERROR_RESPONSE.copy()           
            #response["errors"].append(u"数据值错误(不是一个有效的身份证号码.)")
            #return HttpResponse(simplejson.dumps(response), mimetype='application/json')        
        if User.objects.filter(username=cellphone):
            response = SERVER_ERROR_RESPONSE.copy()            
            response["errors"].append(u"重复(这是一个已经注册过的电话号码.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        try:
            user = User.objects.create_user(cellphone, None, password)
            user.save()
        
            aged = Aged.objects.create(user = user,
                            name = name,
                            user_type = 'Aged',
                            gender = gender,
                            birthday = birthday,
                            #id_card = id_card,
                            #address = address,
                            live_state = live_state,
                            cellphone = cellphone,
                            imsi= imsi
                            ) 
            Emergency_contacts.objects.create(contact_name=contact_name1, contact_phone=contact_phone1, aged=aged)
            if contact_name2 and contact_phone2:
                Emergency_contacts.objects.create(contact_name=contact_name2, contact_phone=contact_phone2, aged=aged)
            #auth_login(request, user)
        except IntegrityError:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({'errors':[u'该SIM卡已被注册']})
            User.objects.filter(id=user.id).delete()
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})
            print repr(e)
                           
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        response = OK_RESPONSE.copy()
        
        status = 200
        
        return HttpResponse(simplejson.dumps(response), mimetype='application/json', status=status)
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
        status = 400
    return HttpResponse(simplejson.dumps(response), mimetype='application/json', status=status)

@csrf_exempt
@commit_on_success
def update_register(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        try:
        #json_data = simplejson.loads(request.raw_post_data)
            cellphone = request.POST.get('cellphone', '')
            past_medical_history = request.POST.get('past_medical_history', '') 
            height = request.POST.get('height', '')
            body_weight = request.POST.get('body_weight', '')
            bad_habits = request.POST.get('bad_habits', '')
            live_city = request.POST.get('live_city', '')
            id_card = request.POST.get('id_card', '')
            address = request.POST.get('address', '')                
        
            aged = Aged.objects.get(cellphone=cellphone)                                             
            aged.past_medical_history = past_medical_history                           
            if height:
                aged.height = int(height)
            if body_weight:
                aged.body_weight = int(body_weight)
            aged.bad_habits = bad_habits
            aged.live_city = live_city
            aged.id_card = id_card                           
            aged.address = address 
            aged.save()                            
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})
              
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        response = OK_RESPONSE.copy()
      
        return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

@csrf_exempt
def login(request):             
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":        
        #json_data = simplejson.loads(request.raw_post_data)                            
        try:
            cellphone = request.POST.get('cellphone', '')
            password = request.POST.get('password', '')
            user = authenticate(username=cellphone, password=password)                        
            if user:
                auth_login(request, user)
            else:
                response = SERVER_ERROR_RESPONSE.copy()
                response["errors"].append("AuthError('Authentication failed.')")
                #TODO status code -1 if IMSI and USER not the same 
                return HttpResponse(simplejson.dumps(response), mimetype='application/json')#, status=status)                            
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})
            #status = 500                           
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')#, status=status)        
        response = OK_RESPONSE.copy()
        
        #get Lastest APK
        data = {'isNeedUpdate':0 }
        if request.GET.get('version'):
        
            if lt_version(request.GET.get('version'), APK.objects.all()):
                try:
                    latest = APK.objects.latest('version')
                    data.update({'isNeedUpdate':1,
                                'address': latest.package.url,
                                'desc': latest.descritption
                                })
                except Exception as e:
                    logger.error(e)
                    data = {'error':e}

        response.update({'apk':data})
        #FIXME: This is a temp fix for API testing
        
        try:
            imsi = request.POST.get('IMSI')
            aged = user.get_profile().aged
            if ((aged.credit_expired_time > now() or aged.token_count > 0) and
                imsi == aged.imsi):
                auth = True
                response.update({'credit_expired_time':
                                aged.credit_expired_time.strftime('%s'),
                                'token_count': aged.token_count,
                                "IMSI":True})
            else:
                if imsi != aged.imsi:
                    response.update({'IMSI':False})
                else:
                    response.update({'IMSI':True})

                auth = False
                logout(user)
        except Exception as e:
            logger.error(e)
        response.update({'auth':auth})
        
        response.update({'spListTimes':
                    [{'number': 18910619864, 'command': 'CMCC TIME', 'provider':'cmcc'},
                    {'number': 18910619864, 'command': 'UNICOM TIME', "provider": 'unicom'},
                    {'number':18910619864 , 'command': 'cnnet TIME', 'provider': 'cnnet'}
                    ]})

        response.update({'spListMonthly':
                                [{'number': 18910619864 , 'command': 'cmcc monthly', 'provider':'cmcc'},
                                {'number': 18910619864 , 'command': 'unico monthly', "provider": 'unicom'},
                                {'number': 18910619864 , 'command': 'cnnet monthly', 'provider': 'cnnet'}]}
                                )
        # end of FIXME
        #status = 200  
        return easy_api(response)
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
        status = 400
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')#, status=status)

@csrf_exempt
@user_passes_test(expert_required)
def get_aged(request):
    if request.is_ajax():
        q = request.GET.get('term', '')
        ageds = Aged.objects.filter(name__icontains = q )
        results = []
        for aged in ageds:
            aged_json = {}
            aged_json['id'] = aged.id
            aged_json['label'] = aged.name + " " + aged.cellphone
            aged_json['value'] = aged.name + " " + aged.cellphone
            results.append(aged_json)
        data = json.dumps(results)
    else:
        data = 'fail'
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)

@csrf_exempt
@user_passes_test(expert_required)
def apply_for_account(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    if request.is_ajax():
        if request.method == "POST":
            account = Gtalkaccount.objects.filter(available=True)
            if account:
                gtalk = account[0]
                gtalk.available = False
                gtalk.save()
                response = OK_RESPONSE.copy()
                response['metadata'].update({"messages": [gtalk.account]}) 
                return HttpResponse(simplejson.dumps(response), mimetype='application/json')
            else:
                response = SERVER_ERROR_RESPONSE.copy()
                response["errors"].append("DataError: There is no available account")                     
                return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json') 

@csrf_exempt    
@user_passes_test(expert_required)
def release_account(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    if request.is_ajax():
        json_data = simplejson.loads(request.raw_post_data)
        account = json_data.get('account', '')
        try:
            gtalk = Gtalkaccount.objects.get(account=account)
            gtalk.available = True
            gtalk.save()
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})                     
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        response = OK_RESPONSE.copy()
        return HttpResponse(simplejson.dumps(response), mimetype='application/json') 
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')

@csrf_exempt
@commit_on_success
def change_password(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        #json_data = simplejson.loads(request.raw_post_data)                        
        try:
            cellphone = request.POST.get('cellphone', '')
            newpassword = request.POST.get('newpassword', '')  
            user = User.objects.get(username=cellphone)                                             
            user.set_password(newpassword)                         
            user.save()                           
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})
              
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        response = OK_RESPONSE.copy()
      
        return HttpResponse(simplejson.dumps(response), mimetype='application/json')
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
        status = 400
    return HttpResponse(simplejson.dumps(response), mimetype='application/json', status=status)

@csrf_exempt
@commit_on_success
def update_main_profile(request):
    SERVER_ERROR_RESPONSE = {
                             "status": {"code": 500, 
                                        "description": "Internal Server Error"
                             },
                             "metadata": {
                                         "apiVersion": "1.0", 
                                         "request": {
                                                     "url": request.path
                                         }, 
                                         "messages": []
                             }, 
                             "errors": []
    }
    
    BAD_REQUEST_RESPONSE = {
                            "status": {
                                       "code": 400, 
                                       "description": "Bad Request"
                            },
                            "metadata": {
                                         "apiVersion": "1.0", 
                                         "request": {
                                                     "url": request.path
                                         }, 
                                         "messages": []
                            },
                            "errors": []
    }
    
    OK_RESPONSE = {
                   "status": {
                              "code": 200, 
                              "description": "OK"
                   },
                   "metadata": {
                                "apiVersion": "1.0", 
                                "request": {
                                            "url": request.path
                                }, 
                                "messages": []
                    }, 
                   "errors": []
    }

    if request.method == "POST":
        #json_data = simplejson.loads(request.raw_post_data)
        cellphone = request.POST.get('cellphone', '')            
        name = request.POST.get('name', '')
        gender = request.POST.get('gender', '')
        birthday = request.POST.get('birthday', '')
        live_state = request.POST.get('live_state', '')
        #id_card = request.POST.get('id_card', '')
        #address = request.POST.get('address', '')
        contact_name1 = request.POST.get('contact_name1', '')
        contact_phone1 = request.POST.get('contact_phone1', '')
        contact_name2 = request.POST.get('contact_name2', '')
        contact_phone2 = request.POST.get('contact_phone2', '')
        
        if not cellphone:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("IntegrityError(Please send a correct phone number.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        try:
            aged = Aged.objects.get(cellphone=cellphone)
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("IntegrityError(Please send a correct phone number.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        #if id_card and not re.compile("\d{18}|\d{17}\w{1}|\d{15}").match(id_card):
            #response = SERVER_ERROR_RESPONSE.copy()
            #response["errors"].append("DataValueError(Identity card number is not a valid number.)")
            #return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        try:                
            if name:
                aged.name = name
            if gender:
                aged.gender = gender
            if birthday:
                aged.birthday = birthday
            if live_state:
                aged.live_state = live_state
            #if id_card:
                #aged.id_card = id_card
            #if address:
                #aged.address = address
            aged.save()
            if contact_name1 and contact_phone1:
                emergency = Emergency_contacts.objects.filter(aged=aged)[0]
                emergency.contact_name = contact_name1
                emergency.contact_phone = contact_phone1
                emergency.save()
            if contact_name2 and contact_phone2:
                try:
                    emergency = Emergency_contacts.objects.filter(aged=aged)[1]
                    emergency.contact_name = contact_name2
                    emergency.contact_phone = contact_phone2
                    emergency.save()
                except:
                    emergency = Emergency_contacts.objects.create(aged=aged, contact_name=contact_name2, contact_phone=contact_phone2)
                
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({"errors": [repr(e)]})
                           
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        response = OK_RESPONSE.copy()
        status = 200
        
        return HttpResponse(simplejson.dumps(response), mimetype='application/json', status=status)
    if request.method == 'GET':
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
        status = 400
    return HttpResponse(simplejson.dumps(response), mimetype='application/json', status=status)

@csrf_exempt
@commit_on_success
def iptel_register(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        cellphone = request.POST.get('cellphone', '')
        if not cellphone:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("IntegrityError(Please send a correct phone number.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        try:
            aged = Aged.objects.get(cellphone=cellphone)
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
            data['uname'] = 'zmkm' + aged.cellphone
            data['passwd'] = PHONE_TALK['password']
            data['passwd_r'] = PHONE_TALK['password']
            cj = cookielib.CookieJar()
            opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))
            opener.addheaders = [('User-agent','Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)')]
            urllib2.install_opener(opener)
            req = urllib2.Request(url, urllib.urlencode(data))
            urllib2.urlopen(req)
            aged.iptel_number = data['uname']
            aged.save()
            response = OK_RESPONSE.copy()
            response['metadata']['messages'].append({'domain':PHONE_TALK['domain'], 'iptel_number': aged.iptel_number, 'password':PHONE_TALK['password'], 'expert':PHONE_TALK['expert']})
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("IntegrityError(Please send a correct phone number.)")            
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')           

@csrf_exempt        
@login_required
def edi_data(request, id):
    datarecord = get_object_or_404(DataRecord, id=id)
    result = render_to_string('edi_data.txt', {'heartbeatdata': datarecord.heartbeatdata})
    response = HttpResponse(result, mimetype='text/plain')
    response['Content-Disposition'] = 'attachment; filename=edi_data.txt'
    return response

@csrf_exempt
@commit_on_success
def push_reply(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        cellphone = request.POST.get('cellphone', '')
    
        if not cellphone:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("IntegrityError(Please send a correct phone number.)")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        try:
            response = OK_RESPONSE.copy()
            aged = Aged.objects.get(cellphone=cellphone)
            replys = Reply.objects.filter(aged=aged, readed=False)                                        
            for r in replys:
                tempers = r.datarecord.temperaturedata_set.all()
                if tempers:
                    temper = tempers[0].value
                    if temper:
                        if temper > 37.4:
                            result = temper
                            autoreply = "体温过高"
                            response['metadata']['messages'].append(u"{'denoter':'" + r.datarecord.denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                        elif temper < 36.5:
                            result = temper
                            autoreply = "体温过低"
                            response['metadata']['messages'].append(u"{'denoter':'" + r.datarecord.denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                        else:
                            result = temper
                            autoreply = "体温正常"
                            response['metadata']['messages'].append(u"{'denoter':'" + r.datarecord.denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                else:
                    response['metadata']['messages'].append(u"{'denoter':'" + r.datarecord.denoter + u"', 'heartrate':'" + str(r.datarecord.heartrate) + u"', 'msg1':'" + r.result + u"', 'msg':'" + "".join(r.content.split()) + "'}")
                r.readed = True
                r.save()
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append(e)            
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')


@csrf_exempt
@commit_on_success
def random_reply(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        denoter = request.POST.get('denoter', '')
        try:
            record = DataRecord.objects.get(denoter=denoter)
            heartrate = record.heartrate
        except DataRecord.DoesNotExist:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append("记录没有找到, 请检查网络连接状况")
            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
        
        try:
            replys = RandomReply.objects.filter(datarecord=record)
            response = OK_RESPONSE.copy()
            if not replys:
                tempers = record.temperaturedata_set.all()
                if tempers:
                    temper = tempers[0].value
                    if temper > 37.4:
                        result = temper
                        autoreply = "体温过高"
                        response['metadata']['messages'].append(u"{'denoter':'" + denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                        RandomReply.objects.create(datarecord=record, result=result, autoreply=autoreply)
                    elif temper < 36.5:
                        result = temper
                        autoreply = "体温过低"
                        response['metadata']['messages'].append(u"{'denoter':'" + denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                        RandomReply.objects.create(datarecord=record, result=result, autoreply=autoreply)
                    else:
                        result = temper
                        autoreply = "体温正常"
                        response['metadata']['messages'].append(u"{'denoter':'" + denoter + u"', 'temper':'" + str(temper) + u"', 'msg1':'" + str(temper) + u"', 'msg':'" + autoreply + "'}")
                        RandomReply.objects.create(datarecord=record, result=result, autoreply=autoreply)
                else:                   
                    result, autoreply = choose_reply(heartrate)
                    response['metadata']['messages'].append(u"{'denoter':'" + denoter + u"', 'heartrate':'" + str(heartrate) + u"', 'msg1':'" + result + u"', 'msg':'" + "".join(autoreply.split()) + "'}")
                    RandomReply.objects.create(datarecord=record, result=result, autoreply=autoreply)

        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response["errors"].append(e)            
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')


@csrf_exempt
@commit_on_success
def version_update(request):
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {"status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    
    if request.method == "POST":
        currentVersion = Decimal(request.POST.get('version', '1000'))
        try:
            response = OK_RESPONSE.copy()
            lastAPK = VersionUpdate.objects.all().order_by('-version')[0]
            lastVersion = Decimal(lastAPK.version)
            if currentVersion < lastVersion:
                response.update({
                                 "versionupdate":{
                                                  'code': '101',
                                                  'version': unicode(lastVersion),
                                                  'url': SERVER_HOST + lastAPK.apk.url,
                                                  }
                })
            else:
                response.update({
                                 "versionupdate":{
                                                  'code': '100',
                                                  'version': unicode(lastVersion),
                                                  'url': SERVER_HOST + lastAPK.apk.url,
                                                  }
                })
        except Exception:
            response = OK_RESPONSE.copy()
            response.update({
                                 "versionupdate":{
                                                  'code': '100',
                                                  'version': '1.0',
                                                  'url': SERVER_HOST,
                                                  }
                             })
                        
    else:
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')                       

@csrf_exempt
def forget_password(request):
    """Deal with forget_password"""
    getdict = {x:y for x, y in request.POST.items() if x in FORGET_PASSWORD_REQ_DICT}
    cellphone = getdict.get("cellphone")
    response = {'status': False, "msg":"TEST"}
    if cellphone and CellPhoneValidator.regex.match(cellphone):
        #TODO: Add SP reset function
        response.update({'status': True })
    
    return easy_api(response)


def sp_interface(request):
    """
    SP will call the interface, 
    which add credit or tokens for aged
    """
    status = 1
    getdict = {x:y for x,y in request.GET.items() if x in  SP_REQUEST_DICT}
    if getdict.get('serviceid') ==  SP_SERVICE_ID and getdict.get('productid') == SP_PRODUCTION_ID:
        try:
            (tokens, increasetime) = getdict.get('mocontent')
        except Exception, e:
            logger.error(e)
        
        try:
            aged = Aged.objects.get(user__username=getdict.get('usernumber'))
            
            if tokens:
                aged.token_count += tokens
            
            if increasetime:
                if aged.credit_expired_time < now():
                    aged.credit_expired_time = now()
                aged.credit_expired_time += timedelta(days=increasetime)
            
            aged.save()
            status = 0
        except Aged.DoesNotExist:
            logger.error('Aged %s DoesNotExist' % getdict.get('usernumber'))
        
    return HttpResponse('result=%d' % status )

#@user_passes_test(aged_required)
def get_auth_status(request):
    
    cellphone = request.GET.get('cellphone','')
    response = {}
    if CellPhoneValidator.regex.match(cellphone):
        
        response.update({'auth':False})
        try:
            aged = Aged.objects.get(user__username=cellphone)
            #FIXME: This is a temp fix for API testing
            response.update({'credit_expired_time': now(),
                            'token_count': int(random()*10),
                            'auth':True})
        except Exception as e:
            logger.error(e)
    return easy_api(response)

@csrf_exempt
def charge(request):
    """Charge the token"""
    sid = request.POST.get('sid')
    token = request.POST.get('token')
    cellphone = request.POST.get('cellphone')
    imsi = request.POST.get('IMSI')

    result = {'status':False, 'msg': "TEST"}
    if sid:
        result.update({'status':True})
    return easy_api(result)

def versionupdatewithsign(request):
    return redirect('apk_update_with_signature')
