# Create your views here.
from django.template.response import TemplateResponse
from django.contrib.auth.decorators import user_passes_test

from zmkm.common.user_pass_test_func import aged_required, expert_required
from zmkm.accounts.models import Aged, UserProfile, Expert, District
from zmkm.data.models import DataRecord
from django.shortcuts import render
from django.shortcuts import redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

#for pygooglechart
from pygooglechart import Chart
from pygooglechart import SimpleLineChart
from pygooglechart import Axis
from zmkm.settings import CHART_RAT

@user_passes_test(aged_required)
def aged_index(request):
    try:
        aged = Aged.objects.get(user=request.user)       
        datarecords = DataRecord.objects.filter(aged=request.user.userprofile.aged).order_by('-upload_time')[:5]
        ctx = {'aged': aged, 'datarecords': datarecords}
        return TemplateResponse(request, 'aged/index.html', ctx)
    except Exception,e:
        print e
        return redirect('/')

def aged_public_profile(request, id):
    aged = Aged.objects.get(id=id)
    return render(request, 'aged/aged_public_profile.html', {'aged': aged})

@user_passes_test(aged_required)
def aged_total_data(request):
    aged = Aged.objects.get(user=request.user)
    datarecord_list = DataRecord.objects.filter(aged=request.user.userprofile.aged).order_by('-upload_time')
   
    paginator = Paginator(datarecord_list, 10) # Show 10 contacts per page
    page = request.GET.get('page')    
    try:
        datarecords = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        datarecords = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        datarecords = paginator.page(paginator.num_pages)
    
    startPage = datarecords.number - 5
    endPage = datarecords.number + 5
    page_numbers = [n for n in range(startPage, endPage) if n > 0 and n <= paginator.num_pages]
    

    ctx = {
        'aged': aged,
        "datarecords": datarecords,
        'paginator': paginator,
        'page': datarecords.number,
        'pages': paginator.num_pages,
        'page_numbers': page_numbers,
        'next': datarecords.next_page_number(),
        'previous': datarecords.previous_page_number(),
        'has_next': datarecords.has_next(),
        'has_previous': datarecords.has_previous(),
        'show_first': 1 not in page_numbers,
        'show_last': paginator.num_pages not in page_numbers,
    }

    return TemplateResponse(request, 'aged/total_data.html', ctx)

@user_passes_test(expert_required)
def aged_history_data(request, id):
    aged = Aged.objects.get(id=id)
    datarecord_list = DataRecord.objects.filter(aged=aged).order_by('-upload_time')
   
    paginator = Paginator(datarecord_list, 10) # Show 10 contacts per page
    page = request.GET.get('page')    
    try:
        datarecords = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        datarecords = paginator.page(1)
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        datarecords = paginator.page(paginator.num_pages)
    
    startPage = datarecords.number - 5
    endPage = datarecords.number + 5
    page_numbers = [n for n in range(startPage, endPage) if n > 0 and n <= paginator.num_pages]
    

    ctx = {
        'aged': aged,
        "datarecords": datarecords,
        'paginator': paginator,
        'page': datarecords.number,
        'pages': paginator.num_pages,
        'page_numbers': page_numbers,
        'next': datarecords.next_page_number(),
        'previous': datarecords.previous_page_number(),
        'has_next': datarecords.has_next(),
        'has_previous': datarecords.has_previous(),
        'show_first': 1 not in page_numbers,
        'show_last': paginator.num_pages not in page_numbers,
    }

    return TemplateResponse(request, 'aged/history_data.html', ctx)