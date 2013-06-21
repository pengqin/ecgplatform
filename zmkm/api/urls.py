from django.conf.urls import patterns, url
from zmkm.apkinfo.views import update_with_signature
urlpatterns = patterns('zmkm.api.views',
    url(r'^register/$', 'register', name='register_ajax'),
    url(r'^update-profile/$', 'update_register', name='update_register_ajax'),
    url(r'^login/$', 'login', name='login_ajax'),
    #url(r'^apply-gtalk-account/$', 'apply_for_account', name='apply_for_account'),
    #url(r'^release-gtalk-account/$', 'release_account', name='release_account'),
    
    url(r'^change-password/$', 'change_password', name='change_password_ajax'),
    url(r'^update-main-profile/$', 'update_main_profile', name='update_main_profile_ajax'),
    url(r'^iptel-register/$', 'iptel_register', name='iptel_register_ajax'),
    
    url(r'^get_ageds/$', 'get_aged', name='get_aged'),
    
    url(r'^edi_data/(?P<id>\d+)/$', 'edi_data', name='get_edi_data'),
    
    url(r'^push_reply/$', 'push_reply', name='push_reply'),
    url(r'^random_reply/$', 'random_reply', name='random_reply'),
    url(r'^versionupdate/$', 'version_update', name='version_update'),
    url(r'^sp-interface/$', 'sp_interface', name='sp_interface'),
    url(r'^get-auth-status/$', 'get_auth_status', name="get_auth_status"),
    url(r'^get-profile/$', 'get_profile', name="get_profile"),
    url(r'^versionupdatewithsign/$', update_with_signature,
        name="versionupdatewithsign"), #f
)
