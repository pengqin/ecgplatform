from django.core.management import setup_environ
import sys
sys.path.append('/home/zmkm/zmkm')
from zmkm import settings
setup_environ(settings)

from pygooglechart import SimpleLineChart
import pygooglechart
import random
import string
from zmkm.settings import MEDIA_ROOT, MEDIA_URL
from zmkm.expert.models import Expert_case
from zmkm.accounts.models import District, Subscribeship, SubscribeVip, Expert
from zmkm.data.models import DataRecord

def update():
    records = DataRecord.objects.filter(edi1='').exclude(heartbeatdata='')
    for record in records:        
        rawdata = record.heartbeatdata
        if not rawdata:
            continue
        beatdatas = [float(n) for n in rawdata.split(',')]
        if len(beatdatas) > 1000:                 
            heart_beats = beatdatas[1000:min(len(beatdatas),3700)]
            if heart_beats:                        
                max_number = 80 #max(data)
                min_number = -80 #min(data)
                
                l = len(heart_beats)/900
                tem_data = []
                image_path = []
                for step in range(l):                               
                        tem_data = heart_beats[step*900:(step+1)*900]                    
                        chart = SimpleLineChart(361, 121, y_range=[min_number, max_number]) 
                        # Add the chart data      
                        chart.add_data(tem_data)     
                        # Set the line colour to blue
                        chart.set_colours(['0000FF'])
                        chart.fill_solid(pygooglechart.Chart.BACKGROUND, 'FFFFFF00')
                        #chart.set_grid(2, 10, 1, 1)
                        ediname = 'edi/' + "".join(random.sample(string.letters+string.digits, 50)) + '.jpg'
                        edipath = MEDIA_ROOT + '/' + ediname
                        chart.download(edipath)
                        image_path.append(ediname)
            if len(image_path) > 0:
                record.edi1 = image_path[0]
            if len(image_path) > 1:
                record.edi2 = image_path[1]
            if len(image_path) > 2:
                record.edi3 = image_path[2]            
            record.save()
if __name__ == '__main__':
    update() 