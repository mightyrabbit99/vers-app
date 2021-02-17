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
from django.conf.urls import url
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'plant', views.PlantView, 'plant')
router.register(r'sec', views.SectorView, 'sector')
router.register(r'subsec', views.SubsectorView, 'subsector')
router.register(r'dept', views.DepartmentView, 'department')
router.register(r'skill', views.SkillView, 'skill')
router.register(r'emp', views.EmployeeView, 'employee')
router.register(r'emp_skill', views.EmpSkillMatrixView, 'emp_skill')
router.register(r'job', views.JobView, 'job')
router.register(r'job_skill', views.JobSkillMatrixView, 'job_skill')

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),  
    path('api/', include(router.urls)),
    path('dept/', views.DepartmentList.as_view()),
    path('dept/<int:pk>/', views.DepartmentDetail.as_view()),
    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),

    path('users/', views.UserList.as_view()),
    path('user_modify/', views.UserDetail.as_view()),
    path('vers_users/', views.VersUserList.as_view()),
    path('vers_users/<int:pk>/', views.VersUserDetail.as_view()),
]
