# -*- coding: utf-8 -*-
from zmkm.data.models import *
from zmkm.accounts.models import Aged, Autoreply, Choosereply
import simplejson
from django.http import HttpResponse
from zmkm.scripts.heartrate import checkheart
from zmkm.settings import MEDIA_ROOT, MEDIA_URL
import StringIO
import gzip
from django.utils import timezone
from zmkm.data.buildecg import BuildECG
from django.db import transaction
# from zmkm.data.parser import Parser
from django.views.decorators.csrf import csrf_exempt
from random import choice

from zmkm.common.utils import easy_api
import logging
logger = logging.getLogger(__name__)


def choose_reply(heartrate):
    if not heartrate:
        heartrate = 30
    try:
        current_reply_method = Choosereply.objects.all()[0].reply_method
    except Exception:
       current_reply_method = 0 

    if current_reply_method == '0' or ((current_reply_method == '2' and (30 <= heartrate <= 90))):
        reply = Autoreply.objects.filter(
            begin_value__lte=heartrate, end_value__gte=heartrate)
        if reply:
            r = choice(reply)
            return (r.get_result_display(), r.suggest)
    else:
        return (1, 1)


@csrf_exempt
@transaction.commit_on_success
def upload(request):
    # response templates
    SERVER_ERROR_RESPONSE = {"status": {"code": 500, "description": "Internal Server Error"}, "metadata": {
        "apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    BAD_REQUEST_RESPONSE = {"status": {"code": 400, "description": "Bad Request"}, "metadata": {
        "apiVersion": "1.0", "request": {"url": request.path}, "messages": []}, "errors": []}
    OK_RESPONSE = {
        "status": {"code": 200, "description": "OK"}, "metadata": {"apiVersion": "1.0",
        "request": {"url": request.path}, "messages": []}, "errors": []}
    try:
        current_reply_method = Choosereply.objects.all()[0].reply_method
    except Exception as err:
        logger.debug(err)
        current_reply_method = 0   # if did not confige any reply method, then the default method is automatic
    OK_RESPONSE.update({'current_reply_method': str(current_reply_method)})

    if request.method == 'GET':
        response = BAD_REQUEST_RESPONSE.copy()
        response.update({"errors": ["GET method not supported"]})
        status = 400

    if request.method == 'POST':
        """
        #FIXME
        guess = choice([1,0])
        logger.error(guess)
        if guess > 0:
            response = {'auth': False}
            return easy_api(response)
        """
        try:
            raw_data = request.raw_post_data
            after_unzip = gzip.GzipFile(
                mode='rb', fileobj=StringIO.StringIO(raw_data)).read()
            fileobj = StringIO.StringIO(after_unzip)
            uploadedData = fileobj.read()
            fileobj.close()
            rec_dict = eval(uploadedData)

            cellphone = rec_dict['cellphone']

            name = rec_dict['name']
            denoter = rec_dict['denoter']
            raw_data = rec_dict['data']

            if denoter:
                searchRecords = DataRecord.objects.filter(denoter=denoter)  
                # check the duplicated upload data
            else:
                searchRecords = None

            if searchRecords:

                searchRecord = searchRecords[0]
                response = OK_RESPONSE.copy()
                response.update({'auth': True})
                if name == 'temperature':
                    if searchRecord.temp_abnormal:
                        if searchRecord.temperaturedata_set.all()[0].value > 37.4:
                            response.update({"type": '1', 'value':
                                            searchRecord.temperaturedata_set.all()[0].value, 'result': u'体温过高'})
                        else:
                            response.update({"type": '1', 'value':
                                            searchRecord.temperaturedata_set.all()[0].value, 'result': u'体温过低'})
                    else:
                        response.update({"type": '1', 'value':
                                        searchRecord.temperaturedata_set.all()[0].value, 'result': u'体温正常'})
                if name == 'heart_beat':
                    heartrate = searchRecord.heartrate
                    if not heartrate:
                        beatdatas = [float(n) for n in raw_data.split(',')]
                        if len(beatdatas) > 1000:
                            searchRecord.heartbeatdata = raw_data
                            checkheart(searchRecord)
                            BuildECG(searchRecord).start()
                        else:
                            response = SERVER_ERROR_RESPONSE.copy()
                            response.update({'auth': True})
                            response.update({"errors": "上传成功，但数据可能不完整"})
                            return HttpResponse(simplejson.dumps(response), mimetype='application/json')
                    result, autoreply = choose_reply(heartrate)
                    response.update({"type": '0', 'value':
                                    heartrate, 'result': result, 'autoreply': autoreply})
                return HttpResponse(simplejson.dumps(response), mimetype='application/json')

            if name == 'heart_beat':
                beatdatas = [float(n) for n in raw_data.split(',')]
                if len(beatdatas) > 1000:
                    aged = Aged.objects.get(cellphone=cellphone)
                    record = DataRecord.objects.create(
                        aged=aged, denoter=denoter)
                    record.heartbeatdata = raw_data
                    record.save()
                    checkheart(record)
                    BuildECG(record).start()
                else:
                    response = SERVER_ERROR_RESPONSE.copy()
                    response.update({"errors": "上传成功，但数据可能不完整"})
                    response.update({'auth': True})
                    return HttpResponse(simplejson.dumps(response), mimetype='application/json')
                heartrate = record.heartrate
                if not heartrate:
                    response = SERVER_ERROR_RESPONSE.copy()
                    response.update({'auth': True})
                    response.update({"errors": "上传成功,但数据可能不完整"})
                    return HttpResponse(simplejson.dumps(response), mimetype='application/json')
                result, autoreply = choose_reply(heartrate)
                response.update({"type": '0', 'value': heartrate,
                                'result': result, 'autoreply': autoreply})

            if name == 'temperature':
                aged = Aged.objects.get(cellphone=cellphone)
                record = DataRecord.objects.create(aged=aged, denoter=denoter)
                data = float(raw_data)
                TemperatureData.objects.create(record=record, value=data)

            response = OK_RESPONSE.copy()

            response.update({'auth': True})

            if name == 'temperature':
                if record.temp_abnormal:
                    if record.temperaturedata_set.all()[0].value > 37.4:
                        response.update({"type": '1', 'value': record.temperaturedata_set.all(
                        )[0].value, 'result': u'体温过高'})
                    else:
                        response.update({"type": '1', 'value': record.temperaturedata_set.all(
                        )[0].value, 'result': u'体温过低'})
                else:
                    response.update({"type": '1', 'value': record.temperaturedata_set.all(
                    )[0].value, 'result': u'体温正常'})
        except Exception, e:
            response = SERVER_ERROR_RESPONSE.copy()
            response.update({'auth': True})
            response.update({"errors": [repr(e)]})
    return HttpResponse(simplejson.dumps(response), mimetype='application/json')
