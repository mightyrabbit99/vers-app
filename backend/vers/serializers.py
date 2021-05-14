from typing import Set
from rest_framework import serializers
import datetime

from django.contrib.auth.models import User
from django.core import exceptions
import django.contrib.auth.password_validation as pw_validators
from django.core.validators import EmailValidator
from captcha.fields import CaptchaField

from . import models
from . import logger as lg


class VersUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.VersUser
    fields = ['plant_group', 'sector_group', 'subsector_group',
              'employee_group', 'job_group', 'skill_group', ]


class UserSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True)
  vers_user = VersUserSerializer(many=False, read_only=True)
  is_superuser = serializers.BooleanField(read_only=True)
  is_active = serializers.BooleanField(read_only=True)

  def update(self, instance, validated_data):
    instance.username = validated_data.get('username', instance.username)
    a = validated_data.get('password', instance.password)
    instance.set_password(a)
    instance.save()
    return instance

  def validate(self, data):
    # get the password from the data
    password = data.get('password')
    errors = dict()
    try:
      pw_validators.validate_password(password=password, user=User)

    except exceptions.ValidationError as e:
      errors['password'] = list(e.messages)

    if errors:
      raise serializers.ValidationError(errors)

    return super().validate(data)

  class Meta:
    model = User
    fields = ['id', 'username', "password",
              'vers_user', 'is_superuser', 'is_active']


class UserSerializer2(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True)
  email = serializers.CharField(validators=[EmailValidator])
  vers_user = VersUserSerializer(many=False, read_only=True)
  is_superuser = serializers.BooleanField(read_only=True)
  is_active = serializers.BooleanField(read_only=True)
  captcha = CaptchaField()

  def create(self, validated_data):
    user = User(
        username=validated_data['username'],
        is_superuser=False,
    )
    user.set_password(validated_data['password'])
    vers_user = models.VersUser(user=user)
    user.save()
    vers_user.save()
    return user

  class Meta:
    model = User
    fields = ['username', 'email', 'password',
              'vers_user', 'is_superuser', 'is_active']


OWNER_USERNAME = 'owner.username'


class UserSerializer3(serializers.ModelSerializer):
  username = serializers.CharField(read_only=True)
  vers_user = VersUserSerializer(many=False)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def update(self, instance, validated_data):
    vers_user_data = validated_data.pop('vers_user')
    if hasattr(instance, 'vers_user'):
      for (key, value) in vers_user_data.items():
        setattr(instance.vers_user, key, value)
      instance.vers_user.save()
    else:
      vers_user = models.VersUser(**vers_user_data)
      vers_user.user = instance
      vers_user.save()
    instance = super().update(instance, validated_data)
    lg.log_update(
        data_type=lg.USER,
        user=self.get_request_user(), data=validated_data, origin=instance).save()
    return instance

  class Meta:
    model = User
    fields = ['id', 'username', 'vers_user', 'is_superuser', 'is_active']


class PlantSerializer(serializers.ModelSerializer):
  owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
  sectors = serializers.PrimaryKeyRelatedField(
      many=True, read_only=True)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    res = super().create(validated_data)
    g = lg.log_create(
        data_type=lg.PLANT,
        user=self.get_request_user(), data=validated_data)
    g.save()
    return res

  def update(self, instance, validated_data):
    res = super().update(instance, validated_data)
    g = lg.log_update(
        data_type=lg.PLANT,
        user=self.get_request_user(), data=validated_data, origin=instance)
    g.save()
    return res

  class Meta:
    model = models.Plant
    fields = '__all__'


class ForecastSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Forecast
    fields = ['n', 'val']


class ForecastPackSerializer(serializers.ModelSerializer):
  on = serializers.DateField()
  sector = serializers.PrimaryKeyRelatedField(
      queryset=models.Sector.objects.all())
  forecasts = ForecastSerializer(many=True)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    g = lg.log_create(
        data_type=lg.FORECAST,
        user=self.get_request_user(), data=validated_data)
    forecasts_data = validated_data.pop("forecasts")
    new_fc = models.ForecastPack(**validated_data)
    new_fc.save()

    processed_n: Set = set()
    for s in forecasts_data:
      if s['n'] in processed_n:
        continue
      processed_n.add(s['n'])
      new_f = models.Forecast(pack=new_fc, **s)
      new_f.save()

    g.save()
    return new_fc

  def update(self, instance, validated_data):
    g = lg.log_update(
        data_type=lg.FORECAST,
        user=self.get_request_user(), data=validated_data, origin=instance)
    forecasts_data = validated_data.pop("forecasts")
    origin_forecasts = instance.forecasts.all()
    n_map = {}
    for s in origin_forecasts:
      n_map[s.n] = s

    processed_n: Set = set()
    for s in forecasts_data:
      if s['n'] in processed_n:
        continue
      processed_n.add(s['n'])
      if s['n'] in n_map:
        orig = n_map[s['n']]
        orig.val = s['val']
        orig.save()
        n_map.pop(s['n'])
      else:
        new_f = models.Forecast(pack=instance, **s)
        new_f.save()

    for n in n_map:
      n_map[n].delete()

    g.save()
    res = super().update(instance, validated_data)
    return res

  class Meta:
    model = models.ForecastPack
    fields = '__all__'


class SectorSerializer(serializers.ModelSerializer):
  owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
  subsectors = serializers.PrimaryKeyRelatedField(
      many=True, read_only=True)
  forecasts = ForecastPackSerializer(many=True, read_only=True)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    res = super().create(validated_data)
    g = lg.log_create(
        data_type=lg.SECTOR,
        user=self.get_request_user(), data=validated_data)
    g.save()
    return res

  def update(self, instance, validated_data):
    res = super().update(instance, validated_data)
    g = lg.log_update(
        data_type=lg.SECTOR,
        user=self.get_request_user(), data=validated_data, origin=instance)
    g.save()
    return res

  class Meta:
    model = models.Sector
    fields = '__all__'


class SubsectorSerializer(serializers.ModelSerializer):
  owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
  skills = serializers.PrimaryKeyRelatedField(
      many=True, queryset=models.Skill.objects.all())
  jobs = serializers.PrimaryKeyRelatedField(
      many=True, read_only=True)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    res = super().create(validated_data)
    g = lg.log_create(
        data_type=lg.SUBSECTOR,
        user=self.get_request_user(), data=validated_data)
    g.save()
    return res

  def update(self, instance, validated_data):
    res = super().update(instance, validated_data)
    g = lg.log_update(
        data_type=lg.SUBSECTOR,
        user=self.get_request_user(), data=validated_data, origin=instance)
    g.save()
    return res

  class Meta:
    model = models.Subsector
    fields = '__all__'


class EmpSkillMatrixSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EmpSkillMatrix
    fields = ['skill', 'level', 'desc']


def sesa_id_val(value):
  if len(value) < 4:
    raise serializers.ValidationError(
        'This field must have at least 4 letters.')
  if value[:4].upper() != 'SESA':
    raise serializers.ValidationError(
        'This field must start with \'SESA\'')


class EmployeeProfilePicSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EmployeeProfilePic
    fields = '__all__'


class EmployeeFileSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EmployeeFile
    fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
  skills = EmpSkillMatrixSerializer(many=True, required=False)
  owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
  sesa_id = serializers.CharField(validators=[sesa_id_val])
  files = EmployeeFileSerializer(many=True, read_only=True)
  profile_pic = serializers.ReadOnlyField(source='profile_pic.pic')

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    g = lg.log_create(
        data_type=lg.EMPLOYEE,
        user=self.get_request_user(), data=validated_data)
    validated_data['sesa_id'] = validated_data['sesa_id'].upper()

    if 'skills' in validated_data:
      skills_data = validated_data.pop('skills')
    else:
      skills_data = []

    emp = models.Employee(**validated_data)
    emp.save()

    # save skills
    for s in skills_data:
      new_emp_skill = models.EmpSkillMatrix(employee=emp, **s)
      new_emp_skill.save()

    g.save()
    return emp

  def update(self, instance, validated_data):
    # log
    g = lg.log_update(
        data_type=lg.EMPLOYEE,
        user=self.get_request_user(), data=validated_data, origin=instance)

    validated_data['sesa_id'] = validated_data['sesa_id'].upper()

    if 'skills' in validated_data:
      skills_data = validated_data.pop('skills')
      origin_skills = instance.skills.all()
      for s in origin_skills:
        s.delete()
      for s in skills_data:
        new_emp_skill = models.EmpSkillMatrix(
            employee=instance, **s)
        new_emp_skill.save()

    for (key, value) in validated_data.items():
      setattr(instance, key, value)
    instance.save()

    g.save()
    return instance

  class Meta:
    model = models.Employee
    fields = '__all__'


class EmployeeFileSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.EmployeeFile
    fields = '__all__'


class JobSkillMatrixSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.JobSkillMatrix
    fields = ['skill', 'level', 'desc']


class JobSerializer(serializers.ModelSerializer):
  skills_required = JobSkillMatrixSerializer(many=True)
  owner = serializers.ReadOnlyField(source=OWNER_USERNAME)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    g = lg.log_create(
        data_type=lg.JOB,
        user=self.get_request_user(), data=validated_data)
    skills_data = validated_data.pop('skills_required')
    emp_assigned_data = validated_data.pop('emp_assigned')
    job = models.Job(**validated_data)
    job.save()

    emps = models.Employee.objects.filter(pk__in=emp_assigned_data)
    job.emp_assigned.set(emps)

    for s in skills_data:
      job_skill = models.JobSkillMatrix(job=job, **s)
      job_skill.save()

    g.save()
    return job

  def update(self, instance, validated_data):
    g = lg.log_update(
        data_type=lg.JOB,
        user=self.get_request_user(), data=validated_data, origin=instance)
    skills_data = validated_data.pop('skills_required')
    emp_assigned_data = validated_data.pop('emp_assigned')

    emps = models.Employee.objects.filter(pk__in=emp_assigned_data)
    instance.emp_assigned.set(emps)

    origin_skills = instance.skills_required.all()
    for s in origin_skills:
      s.delete()
    for s in skills_data:
      new_job_skill = models.JobSkillMatrix(
          job=instance, **s)
      new_job_skill.save()

    for (key, value) in validated_data.items():
      setattr(instance, key, value)
    instance.save()
    g.save()
    return instance

  class Meta:
    model = models.Job
    fields = '__all__'


class EmpSkillMatrixSerializer2(serializers.ModelSerializer):
  class Meta:
    model = models.EmpSkillMatrix
    fields = ['employee', 'level', 'desc']


class SkillSerializer(serializers.ModelSerializer):
  jobs = JobSkillMatrixSerializer(many=True, read_only=True)
  employees = EmpSkillMatrixSerializer2(many=True, read_only=True)

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def create(self, validated_data):
    res = super().create(validated_data)
    g = lg.log_create(
        data_type=lg.SKILL,
        user=self.get_request_user(), data=validated_data)
    g.save()
    return res

  def update(self, instance, validated_data):
    res = super().update(instance, validated_data)
    g = lg.log_update(
        data_type=lg.SKILL,
        user=self.get_request_user(), data=validated_data, origin=instance)
    g.save()
    return res

  class Meta:
    model = models.Skill
    fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
  class Meta:
    model = models.Log
    fields = '__all__'


class CalEventSerializer(serializers.ModelSerializer):
  start = serializers.DateField()
  end = serializers.DateField()

  def get_request_user(self):
    user = None
    request = self.context.get("request")
    if request and hasattr(request, "user"):
      user = request.user
    return user

  def validate(self, attrs):
    start: datetime.date = attrs.get('start')
    end: datetime.date = attrs.get('end')
    if start > end:
      errors = {'start': 'cannot be after end',
                'end': 'cannot be before start'}
      raise serializers.ValidationError(errors)

    return super().validate(attrs)

  def create(self, validated_data):
    res = super().create(validated_data)
    g = lg.log_create(
        data_type=lg.CAL_EVENT,
        user=self.get_request_user(), data=validated_data)
    g.save()
    return res

  def update(self, instance, validated_data):
    res = super().update(instance, validated_data)
    g = lg.log_update(
        data_type=lg.CAL_EVENT,
        user=self.get_request_user(), data=validated_data, origin=instance)
    g.save()
    return res

  class Meta:
    model = models.CalEvent
    fields = '__all__'
