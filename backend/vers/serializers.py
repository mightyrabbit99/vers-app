from rest_framework import serializers
from . import models
from django.contrib.auth.models import User


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

    class Meta:
        model = User
        fields = ['id', 'username', "password",
                  'vers_user', 'is_superuser', 'is_active']


OWNER_USERNAME = 'owner.username'


class PlantSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    sectors = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    class Meta:
        model = models.Plant
        fields = '__all__'


class SectorSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    subsectors = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

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

    class Meta:
        model = models.Subsector
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)
    employees = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True)

    class Meta:
        model = models.Department
        fields = '__all__'


class EmpSkillMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmpSkillMatrix
        fields = '__all__'


class UserSerializer2(serializers.ModelSerializer):
    vers_user = VersUserSerializer2(many=False)
    is_superuser = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    username = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username',
                  'vers_user', 'is_superuser', 'is_active']


class EmployeeSerializer(serializers.ModelSerializer):
    skills = EmpSkillMatrixSerializer(many=True)
    user = UserSerializer2()
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)

    def get_request_user(self):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return user

    def create(self, validated_data):
        skills_data = validated_data.pop('skills')
        user_data = validated_data.pop('user')
        vers_user_data = user_data.pop('vers_user')
        vers_user = models.VersUser(**vers_user_data)  # user empty for now
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
        emp.save()
        models.EmpSkillMatrix.objects.bulk_create(skills_data)
        return emp

    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills')
        user_data = validated_data.pop('user')

        origin_skills = instance.skills.all()
        for s in origin_skills:
            s.delete()
        for s in skills_data:
            new_emp_skill = models.EmpSkillMatrix(**s)
            new_emp_skill.save()

        if user_data:
            vers_user_data = user_data.pop('vers_user')
            vers_user = instance.user.vers_user
            for (key, value) in vers_user_data.items():
                setattr(vers_user, key, value)
            vers_user.save()

        for (key, value) in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    class Meta:
        model = models.Employee
        fields = '__all__'


class JobSkillMatrixSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.JobSkillMatrix
        fields = '__all__'


class JobSerializer(serializers.ModelSerializer):
    skills_required = JobSkillMatrixSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source=OWNER_USERNAME)

    class Meta:
        model = models.Job
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    jobs = JobSkillMatrixSerializer(many=True, read_only=True)
    employees = EmpSkillMatrixSerializer(many=True, read_only=True)

    class Meta:
        model = models.Skill
        fields = '__all__'
