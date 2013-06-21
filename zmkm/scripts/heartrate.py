"""
XXX:Whoever wrote this, it must be re-contruct
THIS SCRIPT CONTENTS LOTS INSECURE AND INAPPROPRIATE LINES
"""
from datetime import datetime
from zmkm.data.models import *

REL_DICT = {
    'LT': '<',
    'GT': '>',
    'EQ': '==',
    }

def heartrate(data):
    results = []
    counter = 0
    pulseperiod = 0
    y500 = []
    maxium = 0
    beats = 0
    
    for y in range(1,len(data)):
        pulseperiod += 1 #Sampling counter
        ydiff = abs(data[y] - data[y-1])
        y500.append(ydiff) #Point Difference before current data.
        if len(y500) < 500:
            continue
        else:
            maxium = max(y500[y-500:y]) #find the maximum.   
        
        if ydiff > maxium * 0.7:
            counter = 0            
        else:
            counter += 1            
        
        if counter == 62:
            beats += 1
            if beats == 3:
                heartrate = 60 * 3 * 250 / pulseperiod # calculate heart rate
                results.append(heartrate)
                beats = 0
                pulseperiod = 0              
                
    try:        
        return max(results) #sum(results)/len(results)
    except:
        return 0

def checkheart(datarecord):
    rate = 0
    raw_data = datarecord.heartbeatdata
    beatdatas = [float(n) for n in raw_data.split(',')] 
    beatdatas_len = len(beatdatas)
    if beatdatas_len-1801 < 0:
        rate = heartrate(beatdatas[0:beatdatas_len])
    else:
        rate = heartrate(beatdatas[beatdatas_len-1801:beatdatas_len])
    datarecord.heartrate = rate
    datarecord.save()
               
    heart_vip_rules = []
    for h in HeartbeatVipRule.objects.filter(aged=datarecord.aged):
        heart_vip_rules.append(h.heartbeat_rule)
    if heart_vip_rules:
        heartbeat_rules = heart_vip_rules
    else:
        heartbeat_rules = HeartBeatRule.objects.filter(isviprule=False)
    for rule in heartbeat_rules:
        filter_list = []
        for f in rule.heartbeatfilter_set.all():
            if f.rel == 'BT' and f.value_b and f.name in ['height', 'body_weight', 'age']:
                fstr = f.value_a + "<=" + "datarecord.aged." + f.name + "<=" + f.value_b
            else:
                fstr = "datarecord.aged." + f.name + REL_DICT[f.rel]
                if f.name == 'gender':
                    fstr += "'" + f.value_a + "'"
                else:
                    fstr += f.value_a
            filter_list.append(fstr)
                  
        total_filter = ' and '.join(filter_list)
        if not total_filter:
            total_filter = 'True'           
  
        if (rule.rel == 'BT' and rule.value_b and rule.value_a <= rate <= rule.value_b or\
           rule.rel == 'LT' and rate < rule.value_a or\
           rule.rel == 'GT' and rate > rule.value_a or\
           rule.rel == 'EQ' and rate == rule.value_a) and\
           eval(total_filter):
                datarecord.heart_abnormal = True
                datarecord.save()
