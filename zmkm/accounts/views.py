from django.contrib.auth.models import User
from django.db.transaction import commit_on_success
from django.template.response import TemplateResponse
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.core.urlresolvers import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import user_passes_test

from zmkm.common.user_pass_test_func import expert_required, aged_required
from zmkm.accounts.forms import RegisterForm, LoginForm, LoginFormExpert, AgedProfileForm, ExpertProfileForm
from zmkm.accounts.models import Aged, Emergency_contacts, Expert
from zmkm.common.utils import easy_api

@commit_on_success
def aged_register(request):
    if request.user.is_authenticated():
        return redirect('/')
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['cellphone']
            password = form.cleaned_data['password']
            user = User.objects.create_user(username, None, password)
            user.save()
            
            # process Aged profile
            name = form.cleaned_data['name']
            gender = form.cleaned_data['gender']
            birthday = form.cleaned_data['birthday']
            id_card = form.cleaned_data['id_card']
            address = form.cleaned_data['address']
            cellphone = form.cleaned_data['cellphone']
            past_medical_history = form.cleaned_data.get('past_medical_history', '')
            height = form.cleaned_data.get('height', '')
            body_weight = form.cleaned_data.get('body_weight', '')
            bad_habits = form.cleaned_data.get('bad_habits', '')
            live_city = form.cleaned_data.get('live_city', '')
            aged = Aged.objects.create(user = user,
                                name = name,
                                user_type = 'Aged',
                                gender = gender,
                                birthday = birthday,
                                id_card = id_card,
                                address = address,
                                cellphone = cellphone,
                                past_medical_history = past_medical_history,
                                height = height,
                                body_weight = body_weight,
                                bad_habits = bad_habits,
                                live_city = live_city
                                )
            
            # process emergency contacts
            contact_name1 = form.cleaned_data['contact_name1']
            contact_phone1 = form.cleaned_data['contact_phone1']
            contact_name2 = form.cleaned_data.get('contact_name2', '')
            contact_phone2 = form.cleaned_data.get('contact_phone2', '')
            Emergency_contacts.objects.create(contact_name=contact_name1, contact_phone=contact_phone1, aged=aged)
            if contact_name2 and contact_phone2:
                Emergency_contacts.objects.create(contact_name=contact_name2, contact_phone=contact_phone2, aged=aged)
            
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('aged_index')
    else:
        form = RegisterForm()
    return TemplateResponse(request, 'accounts/register.html', {'form': form})

def aged_login(request):
    if request.user.is_authenticated():
        if not request.user.is_staff:
            try:
                if request.user.get_profile().expert.user_type == 'Expert':
                    return redirect('expert_index')
            except ObjectDoesNotExist:
                return redirect('aged_index')

    if request.method == 'POST':
        if request.POST['submit'] == 'User':
            eform = LoginFormExpert()
            form = LoginForm(request.POST)
            if form.is_valid():
                human = True
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                user = authenticate(username=username, password=password)
                if user:
                    login(request, user)
                    if request.GET.has_key('next'):
                        return redirect(request.GET['next'])
                    else:
                        try:
                            if user.get_profile().aged.user_type == 'Aged':
                                return redirect('aged_index')
                        except ObjectDoesNotExist:
                            return redirect('zmkm_logout')
                else:
                    auth_faild = True
            else:
                auth_faild = False
        
        if request.POST['submit'] == 'Doctor':
            form = LoginForm()
            eform = LoginFormExpert(request.POST)   
            if eform.is_valid():
                human = True
                username = eform.cleaned_data['eusername']
                password = eform.cleaned_data['epassword']
                user = authenticate(username=username, password=password)
                if user:
                    login(request, user)
                    if request.GET.has_key('next') and '/health/api/edi_data/' not in request.GET['next']:
                        return redirect(request.GET['next'])
                    else:
                        try:
                            if user.get_profile().expert.user_type == 'Expert':
                                return redirect('expert_index')
                        except ObjectDoesNotExist:
                            return redirect('zmkm_logout')
                else:
                    auth_faild = True
            else:
                auth_faild = False
    else:
        form = LoginForm()
        eform = LoginFormExpert()
        auth_faild = False

    return TemplateResponse(request, 'accounts/login.html', locals()) #{'form': form, 'auth_faild': auth_faild})

def aged_logout(request):
    logout(request)
    return redirect(reverse('zmkm.accounts.views.aged_login'))

@user_passes_test(aged_required)
def aged_profile(request):
    aged = get_object_or_404(Aged, userprofile_ptr=request.user.userprofile.id)
    if request.method == 'POST':
        form = AgedProfileForm(request.POST, instance=aged)
        if form.is_valid():
            form.save()
            saved = True
        else:
            saved = False
        return TemplateResponse(request, 'accounts/aged_profile.html', {'form': form, 'aged': aged, 'saved': saved})
    else:
        form = AgedProfileForm(instance=aged)
    return TemplateResponse(request, 'accounts/aged_profile.html', {'form': form, 'aged': aged})

@user_passes_test(expert_required)
def expert_profile(request):
    expert = get_object_or_404(Expert, userprofile_ptr=request.user.userprofile.id)
    if request.method == 'POST':
        form = ExpertProfileForm(request.POST, instance=expert)
        if form.is_valid():
            form.save()
            saved = True
        else:
            saved = False
        return TemplateResponse(request, 'accounts/expert_profile.html', {'form': form, 'expert': expert, 'saved': saved})
    else:
        form = ExpertProfileForm(instance=expert)
    return TemplateResponse(request, 'accounts/expert_profile.html', {'form': form, 'expert': expert})      
