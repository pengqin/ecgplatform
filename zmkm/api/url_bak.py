from django.conf.urls import patterns, url

urlpatterns = patterns('zmkm.api.views',
    url(r'^register/$', 'register', name='register_ajax_b'),
    url(r'^update-profile/$', 'update_register', name='update_register_ajax_b'),
    url(r'^login/$', 'login', name='login_ajax_b'),
    #url(r'^apply-gtalk-account/$', 'apply_for_account', name='apply_for_account_b'),
    #url(r'^release-gtalk-account/$', 'release_account', name='release_account_b'),
    
    url(r'^change-password/$', 'change_password', name='change_password_ajax_b'),
    url(r'^update-main-profile/$', 'update_main_profile', name='update_main_profile_ajax_b'),
    url(r'^iptel-register/$', 'iptel_register', name='iptel_register_ajax_b'),
    
    url(r'^get_ageds/$', 'get_aged', name='get_aged_b'),
    
    url(r'^edi_data/(?P<id>\d+)/$', 'edi_data', name='get_edi_data_b'),
    
    url(r'^push_reply/$', 'push_reply', name='push_reply_b'),
    url(r'^sp-interface/$', 'sp_interface', name='sp_interface'),
    url(r'^forget-password/$', 'forget_password', name="forget_password"),
    url(r'^get-auth-status/$', 'get_auth_status', name="get_auth_status"), 
    url(r'^charge-with-card/$', 'charge', name="charge_with_card"),
)
