import logging
logger = logging.getLogger(__name__)
import re


from zmkm.common.utils import easy_api
from zmkm.apkinfo.models import APK, SignedAPK

def mycmp(version1, version2):
        def normalize(v):
            return [int(x) for x in re.sub(r'(\.0+)*$','',
                        v).split(".")]
        return cmp(normalize(version1), normalize(version2))


def lt_version(version, sets):
    for item in sets:
        if mycmp(version, item.version) == -1:
            return True
    
    return False

def update(request):
    """
    return current APK version
    """
    
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

    return easy_api(data)                   

def update_with_signature(request):
    """
    return current APK version
    """
    
    data = {'isNeedUpdate':0 }

    if request.GET.get('version'):
            
        if lt_version(request.GET.get('version'), SignedAPK.objects.all()):
            try:
                latest = SignedAPK.objects.latest('version')
                data.update({'isNeedUpdate':1,
                            'address': latest.package.url,
                            'desc': latest.descritption
                            })
            except Exception as e:
                logger.error(e)
                data = {'error':e}

    return easy_api(data)                   


