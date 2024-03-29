from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.views import View
from django.views.generic import ListView

from django.http import HttpRequest, HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render, get_object_or_404, redirect

from django.contrib.auth.models import User
import django.middleware.csrf as csrf

from rest_framework import status, viewsets, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser

from . import models, serializers, logger as lg, permissions as my_perms
from .forms import UserCreateForm

def new_user_register(request):
  title = "Create account"
  if request.method == 'POST':
    form = UserCreateForm(request.POST)
    if form.is_valid():
      form.save()
      return redirect('/')
  else:
    form = UserCreateForm()

  context = {'form': form, 'title': title}
  return render(request, 'vers/registration.html', context=context)


class UserDetail(generics.RetrieveUpdateAPIView):
  '''
    User retrieve & update information about himself
  '''
  serializer_class = serializers.UserSerializer
  model = User
  permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

  def get_object(self, queryset=None):
    obj = self.request.user
    return obj


# model view sets to be used in router


def get_objects(view):
  if view == "plant":
    return models.Plant.objects
  elif view == "sector":
    return models.Sector.objects
  elif view == "subsector":
    return models.Subsector.objects
  elif view == "skill":
    return models.Skill.objects
  elif view == "employee":
    return models.Employee.objects
  elif view == "department":
    return models.Department.objects
  elif view == "job":
    return models.Job.objects
  elif view == "forecast":
    return models.ForecastPack.objects
  elif view == "user":
    return models.User.objects


def get_group(view, user):
  if view == "plant":
    return user.vers_user.plant_group
  elif view == "sector":
    return user.vers_user.sector_group
  elif view == "subsector":
    return user.vers_user.subsector_group
  elif view == "skill":
    return user.vers_user.skill_group
  elif view == "employee":
    return user.vers_user.employee_group
  elif view == "department":
    return user.vers_user.department_group
  elif view == "job":
    return user.vers_user.job_group
  elif view == "forecast":
    return user.vers_user.forecast_group
  else:
    return None

NONE = 3
USER = 2
OWNER = 1


def perform_get_queryset(view, user):
  if view == "user":
    if user.is_superuser:
      return models.User.objects.all()
    else:
      return models.User.objects.none()

  if view == "cal":
    if user.is_authenticated:
      return models.CalEvent.objects.all()
    else:
      return models.CalEvent.objects.none()

  objects = get_objects(view)
  if user.is_superuser:
    return objects.all()
  try:
    user.vers_user
  except AttributeError:
    return objects.none()
  if not user.is_authenticated:
    return objects.none()
  grp = get_group(view, user)
  if grp == NONE:
    return objects.none()
  return objects.all()  # .filter(owner=user)


def has_create_permission(view, user):
  if user.is_superuser:
    return True
  try:
    user.vers_user
  except AttributeError:
    return False
  if not user.is_authenticated:
    return False
  grp = get_group(view, user)
  if grp == NONE or grp == USER:
    return False
  return True


def has_update_permission(view, user):
  return has_create_permission(view, user)


def has_delete_permission(view, user):
  return has_create_permission(view, user)


def notify_consumer(typ, data_type, data):
  channel_layer = get_channel_layer()
  event = {
      "type": "update_store",
      "payload": {
          "data_type": data_type,
          "action": typ,
          "content": data
      }
  }
  async_to_sync(channel_layer.group_send)(
      "main", event)


class PlantView(viewsets.ModelViewSet):
  txt = "plant"
  serializer_class = serializers.PlantSerializer

  def notify(self, typ, res):
    notify_consumer(typ, lg.PLANT, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.PLANT,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class SectorView(viewsets.ModelViewSet):
  txt = "sector"
  serializer_class = serializers.SectorSerializer
  permission_classes = [my_perms.VersPermission1]

  def notify(self, typ, res):
    notify_consumer(typ, lg.SECTOR, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.SECTOR,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class SubsectorView(viewsets.ModelViewSet):
  txt = "subsector"
  serializer_class = serializers.SubsectorSerializer
  permission_classes = [my_perms.VersPermission1]

  def notify(self, typ, res):
    notify_consumer(typ, lg.SUBSECTOR, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.SUBSECTOR,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class SkillView(viewsets.ModelViewSet):
  txt = "skill"
  serializer_class = serializers.SkillSerializer
  permission_classes = [my_perms.VersPermission1]

  def notify(self, typ, res):
    notify_consumer(typ, lg.SKILL, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.SKILL,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class EmployeeView(viewsets.ModelViewSet):
  txt = "employee"
  #parser_classes = [utils.MultiPartJsonParser]
  serializer_class = serializers.EmployeeSerializer
  permission_classes = [my_perms.VersPermission1,]

  def notify(self, typ, res):
    notify_consumer(typ, lg.EMPLOYEE, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.EMPLOYEE,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class EmployeeFileView(viewsets.ModelViewSet):
  txt = 'employee_file'
  parser_classes = [MultiPartParser]
  serializer_class = serializers.EmployeeFileSerializer
  permission_classes = [my_perms.VersPermission1]

  def notify(self, typ, res):
    notify_consumer(typ, lg.EMP_FILE, res)

  def get_queryset(self):
    return models.EmployeeFile.objects.all()

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      headers = self.get_success_headers(serializer.data)
      self.notify(lg.CREATE, serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)


class EmployeeProfilePicView(viewsets.ModelViewSet):
  parser_classes = [MultiPartParser]
  serializer_class = serializers.EmployeeProfilePicSerializer
  permission_class = [my_perms.VersPermission1]

  def get_queryset(self):
    return models.EmployeeProfilePic.objects.all()


class JobView(viewsets.ModelViewSet):
  txt = "job"
  serializer_class = serializers.JobSerializer
  permission_classes = [my_perms.VersPermission1]

  def notify(self, typ, res):
    notify_consumer(typ, lg.JOB, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.JOB,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class LogList(generics.ListAPIView):
  txt = "log"
  queryset = models.Log.objects.all()
  serializer_class = serializers.LogSerializer


class ForecastView(viewsets.ModelViewSet):
  txt = "forecast"
  serializer_class = serializers.ForecastPackSerializer

  def notify(self, typ, res):
    notify_consumer(typ, lg.FORECAST, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_create(self, serializer):
    if self.request.user.is_authenticated:
      serializer.save(owner=self.request.user)
    else:
      serializer.save()

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def destroy(self, request, *args, **kwargs):
    if has_delete_permission(self.txt, self.request.user):
      return super().destroy(request, *args, **kwargs)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.FORECAST,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class CalEventView(viewsets.ModelViewSet):
  txt = 'cal'
  serializer_class = serializers.CalEventSerializer

  def notify(self, typ, res):
    notify_consumer(typ, lg.CAL_EVENT, res)

  def get_queryset(self):
    return models.CalEvent.objects.all()
  
  def create(self, request, *args, **kwargs):
    if has_create_permission(self.txt, self.request.user):
      serializer = self.get_serializer(
          data=request.data, many=isinstance(request.data, list))
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      self.notify(lg.CREATE, serializer.data)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.UPDATE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.CAL_EVENT,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


class UserView(viewsets.ModelViewSet):
  txt = 'user'
  serializer_class = serializers.UserSerializer3
  model = User

  def notify(self, typ, res):
    notify_consumer(typ, lg.USER, res)

  def get_queryset(self):
    return perform_get_queryset(self.txt, self.request.user)

  def update(self, request, *args, **kwargs):
    if has_update_permission(self.txt, self.request.user):
      res = super().update(request, *args, **kwargs)
      self.notify(lg.DELETE, res.data)
      return res
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)

  def create(self, request):
    return Response(status=status.HTTP_404_NOT_FOUND)

  def perform_destroy(self, instance):
    lg.log_delete(
        data_type=lg.USER,
        user=self.request.user, origin=instance).save()
    self.notify(lg.DELETE, self.serializer_class(instance).data)
    return super().perform_destroy(instance)


# main page


class IndexView(View):
  def get(self, request, *args, **kwargs):
    print(request.build_absolute_uri())
    return render(request, 'vers/index.html', { "url": "http://%s/" % request.get_host() })

  def post(self, request, *args, **kwargs):
    return render(request, 'vers/index.html', { "url": "http://%s/" % request.get_host() })


class DeleteAllLogView(APIView):
  def delete(self, request: HttpRequest, *args, **kwargs):
    if request.user.is_authenticated:
      models.Log.objects.all().delete()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)


class DeleteAllCalEventView(APIView):
  def delete(self, request: HttpRequest, *args, **kwargs):
    if request.user.is_authenticated:
      models.CalEvent.objects.all().delete()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_403_FORBIDDEN)


def main_list(_model, _template_name, _paginate_by=100):
  class MainList(ListView):
    model = _model
    template_name = _template_name
    paginate_by = _paginate_by

  def get_queryset(self: MainList):  # overrides return list of employee
    order_by_field = self.request.GET.get('order_by') or '-no'
    return self.model.objects.order_by(order_by_field)

  MainList.get_queryset = get_queryset

  return MainList.as_view()


def profile_view(_model, _template_name, _form_class, _success_rev):
  class ProfileView(View):
    model = _model
    template_name = _template_name
    form_class = _form_class

    def get_form_rendered(self, request, form=form_class()):
      return render(request, self.template_name, {'form': form, 'csrf_token': csrf.get_token(request)})

    def get(self, request: HttpRequest, *args, **kwargs):
      no = request.GET.get('no', False)
      if no:
        obj = self.model.objects.get(no=no)
        form = self.form_class(instance=obj)
        return self.get_form_rendered(request, form)
      else:
        return self.get_form_rendered(request)

    def post(self, request: HttpRequest, *args, **kwargs):
      # :: for request.FILES to work: <table enctype="multipart/form-data" method="post">
      m_form_instance = self.form_class(request.POST, request.FILES)
      form = m_form_instance.data
      if form['no']:
        instance = get_object_or_404(self.model, no=form['no'])
        m_form_instance = self.form_class(
            request.POST, request.FILES, instance=instance)

      if m_form_instance.is_valid():  # :: is_valid() adds error messages if not valid
        m_form_instance.save()
        return HttpResponseRedirect(reverse(_success_rev))

      return self.get_form_rendered(request, m_form_instance)

  return ProfileView.as_view()


def profile_delete_view(_model, _form_class):
  class ProfileDeleteView(View):
    model = _model
    form_class = _form_class

    def get(self, request: HttpRequest, *args, **kwargs):
      no = request.GET.get('no', False)
      instance = get_object_or_404(self.model, no=no)
      instance.delete()
      return HttpResponseRedirect(reverse('skill_list'))

  return ProfileDeleteView.as_view()
