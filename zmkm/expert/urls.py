'''
Created on 2012-5-6

@author: liwenjian
'''
from django.conf.urls import patterns, url

urlpatterns = patterns('zmkm.expert.views',
    url(r'^index/$', 'expert_index', name='expert_index'),
    url(r'^add-rule/$', 'add_rule', name='add_rule'),
    url(r'^list-rule/$', 'list_rule', name='list_rule'),
    url(r'^edit-rule/(?P<type>\w+)/(?P<id>\d+)/$', 'edit_rule', name='edit_rule'),
    url(r'^delete-rule/$', 'delete_rule', name='delete_rule'),
    url(r'^handle/(?P<id>\d+)/$', 'handle', name='case_handle'),
    url(r'^ignore/(?P<id>\d+)/$', 'ignore', name='case_ignore'),
    url(r'^expert-public-profile/(?P<id>\d+)/$', 'expert_public_profile', name='expert_public_profile'),
    url(r'^expert-total-cases/$', 'expert_total_cases', name='expert_total_cases'),
    url(r'^fast-handle/(?P<case_id>\d+)/$', 'fast_handle', name='fast_handle'),
    url(r'^expert-profile/add-fast-reply/$', 'add_fast_reply', name='add_fast_reply'),
    url(r'^expert-profile/list-fast-reply/$', 'list_fast_reply', name='list_fast_reply'),
    url(r'^expert-profile/delete-fast-reply/$', 'delete_fast_reply', name='delete_fast_reply'),
    url(r'^emergency-count/$', 'emergency_count', name="expert_emergency_api"),
    url(r'^status-toggle/$', 'status_toggle', name="expert_status_toggle"),
    url(r'^list-all-other-fast-reply/$', 'list_all_other_fast_reply',
        name='list_all_other_fast_reply'),

    url(r'^team-memeber/(?P<action>\w+)$', 'team_memeber', name='team_memeber'),
    url(r'^team-memeber-admin/$', 'team_memeber_admin',
    name='team_memeber_admin'),
    url(r'^check-team-memeber/(?P<crew_id>\d+)/$', 'check_team_memeber',
        name="check_team_memeber"),
    )
