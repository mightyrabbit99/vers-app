"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import re_path, path, include

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'plant', views.PlantView, 'plant')
router.register(r'sec', views.SectorView, 'sector')
router.register(r'subsec', views.SubsectorView, 'subsector')
router.register(r'skill', views.SkillView, 'skill')
router.register(r'emp', views.EmployeeView, 'employee')
router.register(r'job', views.JobView, 'job')
router.register(r'forecast', views.ForecastView, 'forecast')
router.register(r'cal_event', views.CalEventView, 'events')
router.register(r'user', views.UserView, 'user')
router.register(r'emp_files', views.EmployeeFileView, 'employee_files')

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('api/', include(router.urls)),

    path('log/', views.LogList.as_view(), name='logs'),
    path('user_modify/', views.UserDetail.as_view()),

    path('user_register/', views.new_user_register, name='register'),
    path('reset_user/', views.IndexView.as_view(), name='reset_user'),
    #re_path(r'^(?P<path>.*)/$', views.IndexView.as_view(), name='base'),
]
