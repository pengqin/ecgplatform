# -*- coding: utf-8 -*-s


from random import choice
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'zmkm.settings'

from django.db.models import Count

from zmkm.expert.models import Expert_case
from zmkm.accounts.models import Subscribeship, SubscribeVip, Expert, REPLY_METHOD, Choosereply, Autoreply
from zmkm.data.models import DataRecord


def dispatch():
    #unhandleds = DataRecord.objects.filter(Q(heart_abnormal=True)|Q(ediogram_abnormal=True)|Q(temp_abnormal=True), Q(handle=False))
    unhandleds = DataRecord.objects.filter(handle=False) # all the record, abnormal or not will be dispatch to doctor.
    subdiships = Subscribeship.objects.all()   #get the district subscribed by an expert directly.
    subsvips = SubscribeVip.objects.all()
    all_experts = Expert.objects.filter(status=0)
    for unhandled in unhandleds:
        aged = unhandled.aged
        address = aged.address
        expert = None
        # take out the corresponding expert with the VIP subscribe table
        expert_for_vips = []
        for subsvip in subsvips:
            if aged == subsvip.aged:
                expert_for_vips.append(subsvip.expert)
                #expert = subsvip.expert.user
                #break                
        # take out the corresponding expert with the common subscribe ship table
        if not expert_for_vips:  #expert:            
            lastdistrict = ''
            for subdiship in subdiships:
                if subdiship.district.name in address:
                    if lastdistrict:
                        if lastdistrict in subdiship.district.get_ancestors():
                            expert = subdiship.expert
                    else:
                        expert = subdiship.expert
                    lastdistrict = subdiship.district
        # if expert is still None, then the aged man's address must be a wrong one, but we must set an expert anyway.
        # this must be set a right one, on the product server.
        if not expert and not expert_for_vips:
            busy_experts = Expert.objects.filter(expert_case__handle=False).annotate(num_cases=Count('expert_case')).order_by('num_cases')
            try:
                expert = busy_experts[0]
            except:
                pass
            for e in all_experts:
                if e not in busy_experts:
                    expert = e
                    break
        #XXX: some stupid functions that makes autoreply and semi-autoreply,
        #well, if these functions made any kind tragdy, 
        #I, the programmer, will not response for it.
        try:
            choose = int(Choosereply.objects.latest('id').reply_method)
        except Choosereply.DoesNotExist:
            choose = int(REPLY_METHOD[0][0])
        
        create_kwargs = {'handle':False}
        if choose == 0 or (choose == 2 and not (30 <= unhandled.heartrate <= 90)):

            #XXX: auto reply
            try:
                reply = choice(Autoreply.objects.filter(begin_value__gte=unhandled.heartrate,
                                                        end_value__lte=unhandled.heartrate).all())
                create_kwargs.update({'handle':True,'ediogram_result':reply.suggest})
            except:
                #we can't find any result
                pass


            
        # create the expert case leave the handle time blank
        for expert_for_vip in expert_for_vips:
            Expert_case.objects.create(expert=expert_for_vip, datarecord=unhandled, **create_kwargs)
        #XXX: I don't understand why any expert_for_vips is needed
        if expert:
            Expert_case.objects.create(expert=expert, datarecord=unhandled, **create_kwargs)
        unhandled.handle = True
        unhandled.save()

if __name__ == '__main__':
    dispatch()  
                
        
