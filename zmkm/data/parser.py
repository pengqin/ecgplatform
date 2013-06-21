from zmkm.data.models import *
from zmkm.accounts.models import Aged
from django.utils.timezone import make_aware
from zmkm.settings import TIME_ZONE

class Parser(object):
    def __init__(self):
        self.meta_data = {}
        self.uploadedData = ''
        self.test_data = {}
        self.record = ''
        self.aged = ''
        self.status = ''
        self.reason = ''
        self.abnormal = []

    def parse(self, raw_data):#fileobj):
        try:
            self.uploadedData = raw_data#fileobj.read()
            #fileobj.close()
            # duplicate key on json will be eliminated here
            # e.g. a = {1: 2, 1: 3} will be a = {1: 3}
            rec_dict = self.uploadedData
        except Exception, e:
            self.status = False
            self.reason = repr(e)
            return

        try:            
            # remove specified key and return the corresponding value
            self.test_data = rec_dict['data']
            self.meta_data = rec_dict
            self.save_origin_logs()
            self.parse_data()
        except Exception, e:            
            self.status = False
            self.reason = repr(e)


    def parse_data(self):
        try:            
            self.record = DataRecord.objects.create(aged=self.aged, upload_time=self.meta_data.get('timestamp', ''))
            for data in self.test_data:
                if self.meta_data['name'] == 'heart_beat':
                    for value in data['value']:
                        h = HeartBeatData.objects.create(record=self.record, value=float(value), exam_time=self.meta_data.get('timestamp',''))                    
                elif self.meta_data['name'] == 'temperature':
                    for value in date['value']:
                        t = TemperatureData.objects.create(record=self.record, value=float(value), exam_time=self.meta_data.get('timestamp',''))
            
                #elif data['name'] == 'blood_pressure':
                    #BloodData.objects.create(record=self.record, blood_pressure_high=data['blood_pressure_high'],
                        #blood_pressure_low=data['blood_pressure_low'],
                        #exam_time=data['timestamp'])
            if self.record.heart_abnormal:
                self.abnormal.append("1")
            else:
                self.abnormal.append("0")
            if self.record.temp_abnormal:
                self.abnormal.append("1")
            else:
                self.abnormal.append("0")
            self.status = True
        except Exception, e:
            raise
            self.status = False
            self.reason = repr(e)

    def save_origin_logs(self):
        cellphone = self.meta_data.get('cellphone', '')
        timestamp = self.meta_data.get('timestamp', '')
        try:
            aged = Aged.objects.get(cellphone=cellphone)
            self.aged = aged
            TestOriginalData.objects.create(aged=aged, upload_time=timestamp, upload_data=self.uploadedData)
        except Exception, e:
            self.status = False
            self.reason = repr(e)