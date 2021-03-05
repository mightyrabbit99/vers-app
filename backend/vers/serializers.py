from typing import Set
from rest_framework import serializers
from . import models
from django.contrib.auth.models import User
from django.core import exceptions
import django.contrib.auth.password_validation as validators


class VersUserSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = models.VersUser
        fields = '__all__'


class VersUserSerializer2(serializers.ModelSerializer):
    class Meta:
        model = models.VersUser
        fields = ['plant_group', 'sector_group', 'subsector_group',
                  'employee_group', 'job_group', 'skill_group', 'department_group']


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    vers_user = VersUserSerializer2(many=False, read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

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
            validators.validate_password(password=password, user=User)

        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(data)

    class Meta:
        model = User
        fields = ['id', 'username', "password",
                  'vers_user', 'is_superuser', 'is_active']


OWNER_USERNAME = 'owner.username'


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
        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.PLANT,
                        user=self.get_request_user())
        lg.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.PLANT,
                        user=self.get_request_user())
        lg.save()
        return super().update(instance, validated_data)

    class Meta:
        model = models.Plant
        fields = '__all__'


class SectorSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    subsectors = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.SECTOR,
                        user=self.get_request_user())
        lg.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.SECTOR,
                        user=self.get_request_user())
        lg.save()
        return super().update(instance, validated_data)

    class Meta:
        model = models.Sector
        fields = '__all__'


class SubsectorSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    skills = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Skill.objects.all())
    employees = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)
    jobs = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.SUBSECTOR,
                        user=self.get_request_user())
        lg.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.SUBSECTOR,
                        user=self.get_request_user())
        lg.save()
        return super().update(instance, validated_data)

    class Meta:
        model = models.Subsector
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    employees = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.DEPARTMENT,
                        user=self.get_request_user())
        lg.save()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.DEPARTMENT,
                        user=self.get_request_user())
        lg.save()
        return super().update(instance, validated_data)

    class Meta:
        model = models.Department
        fields = '__all__'


class EmpSkillMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmpSkillMatrix
        fields = ['skill', 'level', 'desc']


class UserSerializer2(serializers.ModelSerializer):
    vers_user = VersUserSerializer2(many=False)
    is_superuser = serializers.BooleanField()
    is_active = serializers.BooleanField(read_only=True)
    username = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username',
                  'vers_user', 'is_superuser', 'is_active']


def sesa_id_val(value):
    if len(value) < 4:
        raise serializers.ValidationError(
            'This field must have at least 4 letters.')
    if value[:4].upper() != 'SESA':
        raise serializers.ValidationError(
            'This field must start with \'SESA\'')


class EmployeeSerializer(serializers.ModelSerializer):
    skills = EmpSkillMatrixSerializer(many=True)
    user = UserSerializer2()
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    sesa_id = serializers.CharField(validators=[sesa_id_val])

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        validated_data['sesa_id'] = validated_data['sesa_id'].upper()
        skills_data = validated_data.pop('skills')
        user_data = validated_data.pop('user')
        user_data.pop('vers_user')
        user_data.pop('is_superuser')

        # creating users
        vers_user = models.VersUser()  # user empty for now
        user = User(
            username=validated_data['sesa_id'],
            is_superuser=False,
            vers_user=vers_user,
            **user_data
        )
        vers_user.user = user
        user.set_password(validated_data['sesa_id'])
        emp = models.Employee(user=user, **validated_data)
        user.save()  # must save user first
        vers_user.save()

        # save employee
        emp.save()

        # save skills
        for s in skills_data:
            new_emp_skill = models.EmpSkillMatrix(employee=emp, **s)
            new_emp_skill.save()

        # log
        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.EMPLOYEE,
                        user=self.get_request_user())
        lg.save()
        return emp

    def update(self, instance, validated_data):
        validated_data['sesa_id'] = validated_data['sesa_id'].upper()
        skills_data = validated_data.pop('skills')
        user_data = validated_data.pop('user')

        origin_skills = instance.skills.all()
        for s in origin_skills:
            s.delete()
        for s in skills_data:
            new_emp_skill = models.EmpSkillMatrix(
                employee=instance, **s)
            new_emp_skill.save()

        if user_data:
            vers_user_data = user_data.pop('vers_user')
            vers_user = instance.user.vers_user
            for (key, value) in vers_user_data.items():
                setattr(vers_user, key, value)
            vers_user.save()

            user = self.get_request_user()
            if user and user.is_superuser:
                superuser = user_data.pop('is_superuser')
                instance.user.is_superuser = superuser
                instance.user.save()

        for (key, value) in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.EMPLOYEE,
                        user=self.get_request_user())
        lg.save()
        return instance

    class Meta:
        model = models.Employee
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
        skills_data = validated_data.pop('skills_required')
        job = models.Job(**validated_data)
        job.save()
        for s in skills_data:
            job_skill = models.JobSkillMatrix(job=job, **s)
            job_skill.save()

        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.JOB,
                        user=self.get_request_user())
        lg.save()
        return job

    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills_required')
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
        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.JOB,
                        user=self.get_request_user())
        lg.save()
        return instance

    class Meta:
        model = models.Job
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    jobs = JobSkillMatrixSerializer(many=True, read_only=True)
    employees = EmpSkillMatrixSerializer(many=True, read_only=True)

    class Meta:
        model = models.Skill
        fields = '__all__'


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Log
        fields = '__all__'


class ForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Forecast
        fields = ['n', 'val']


class ForecastPackSerializer(serializers.ModelSerializer):
    on = serializers.DateTimeField()
    forecasts = ForecastSerializer(many=True)

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        forecasts_data = validated_data.pop("forecasts")
        new_fc = models.ForecastPack(**validated_data)
        new_fc.save()

        processed_n: Set = set()
        for s in forecasts_data:
            if s.n in processed_n: continue
            processed_n.add(s.n)
            new_f = models.Forecast(pack=new_fc, **s)
            new_f.save()

        lg = models.Log(type=models.Log.TypeChoices.CREATE,
                        data_type=models.Log.DataChoices.FORECAST,
                        user=self.get_request_user())
        lg.save()
        return new_fc

    def update(self, instance, validated_data):
        forecasts_data = validated_data.pop("forecasts")
        origin_forecasts = instance.forecasts.all()
        n_map = {}
        for s in origin_forecasts:
            n_map[s.n] = s

        processed_n: Set = set()
        for s in forecasts_data:
            if s.n in processed_n: continue
            processed_n.add(s.n)
            if s.n in n_map:
                orig = n_map[s.n]
                orig.val = s.val
                orig.save()
                n_map.pop(s.n)    
            else:
                new_f = models.Forecast(pack=instance, **s)
                new_f.save()

        for n in n_map:
            n_map[n].delete()

        lg = models.Log(type=models.Log.TypeChoices.UPDATE,
                        data_type=models.Log.DataChoices.FORECAST,
                        user=self.get_request_user())
        lg.save()
        return super().update(instance, validated_data)

    class Meta:
        model = models.ForecastPack
        fields = '__all__'
