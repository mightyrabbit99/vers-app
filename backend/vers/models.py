from django.contrib.auth.models import User
from django.db import models
import enum

user_upload_folder = 'files/'


def up_path(path):
    return user_upload_folder + path

class DataType(models.IntegerChoices):
    PLANT = 0, 'PLANT'
    SECTOR = 1, 'SECTOR'
    SUBSECTOR = 2, 'SUBSECTOR'
    SKILL = 3, 'SKILL'
    DEPARTMENT = 4, 'DEPARTMENT'
    EMPLOYEE = 5, 'EMPLOYEE'
    JOB = 6, 'JOB'
    FORECAST = 7, 'FORECAST'
    CAL_EVENT = 8, 'CAL EVENT'
    LOG = 9, 'LOG'

class PermissionGroupChoices(models.IntegerChoices):
    EDIT = 0, 'OWNER'
    VIEW = 1, 'VIEW'
    NONE = 2, 'NONE'

class VersUser(models.Model):
    user = models.OneToOneField(
        User, related_name='vers_user', on_delete=models.CASCADE)

    # able to create,  delete, edit plant/sector/subsectors
    plant_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)
    sector_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)
    subsector_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)
    department_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)
    # able to create, delete, edit employees. assign skills to employees
    employee_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)

    # able to create, delete, edit jobs. assign skills to jobs
    job_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)

    # able to create, delete, edit skills. assign skills to employee / jobs
    skill_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)

    forecast_group = models.IntegerField(
        choices=PermissionGroupChoices.choices, default=PermissionGroupChoices.NONE)

    class Meta:
        db_table = "vers_users"


class Plant(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(
        User, related_name='plants', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'plants'


class Sector(models.Model):
    name = models.CharField(max_length=50)
    plant = models.ForeignKey(
        Plant, related_name='sectors', on_delete=models.PROTECT)
    owner = models.ForeignKey(
        User, related_name='sectors', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'sectors'


class Subsector(models.Model):
    name = models.CharField(max_length=50)
    sector = models.ForeignKey(
        Sector, related_name='subsectors', on_delete=models.PROTECT)
    cycle_time = models.IntegerField()
    efficiency = models.IntegerField()
    unit = models.CharField(max_length=50, null=True, blank=True)
    owner = models.ForeignKey(
        User, related_name='subsectors', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subsectors'


class Skill(models.Model):
    name = models.CharField(max_length=50, unique=True)
    priority = models.IntegerField()
    percentage_of_sector = models.IntegerField()
    subsector = models.ForeignKey(
        Subsector, related_name='skills', on_delete=models.PROTECT)
    owner = models.ForeignKey(
        User, related_name='skills', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "skills"


class Department(models.Model):
    name = models.CharField(unique=True, max_length=40)
    # related_name = name of self in target model
    owner = models.ForeignKey(
        User, related_name='depts', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'departments'


class Gender(models.TextChoices):
    MALE = "M", "Male"
    FEMALE = "F", "Female"


class Employee(models.Model):
    sesa_id = models.CharField(unique=True, max_length=10)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    subsector = models.ForeignKey(
        Subsector, related_name='employees', on_delete=models.SET_NULL, null=True)
    department = models.ForeignKey(
        Department, related_name='employees', on_delete=models.SET_NULL, null=True)
    report_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)

    birth_date = models.DateField(null=True)
    gender = models.CharField(
        max_length=1, choices=Gender.choices, default=Gender.MALE)
    available = models.BooleanField(default=1)
    hire_date = models.DateField(null=True)
    profile_pic = models.ImageField(
        upload_to=up_path("profile_pic"), null=True)

    user = models.OneToOneField(
        User, related_name="employee", null=True, on_delete=models.SET_NULL)
    owner = models.ForeignKey(
        User, related_name='created_employee', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return "%s %s" % (self.first_name, self.last_name)

    class Meta:
        db_table = 'employees'


class SkillLevelChoices(models.IntegerChoices):
    ONE = 1, 'ONE'
    TWO = 2, 'TWO'
    THREE = 3, 'THREE'
    FOUR = 4, 'FOUR'


class EmpSkillMatrix(models.Model):
    employee = models.ForeignKey(
        Employee, related_name='skills', on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Skill, related_name='employees', on_delete=models.CASCADE)
    level = models.IntegerField(choices=SkillLevelChoices.choices)
    desc = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'employee_skills'


class Job(models.Model):
    title = models.CharField(max_length=50)
    subsector = models.ForeignKey(
        Subsector, related_name="jobs", null=True, on_delete=models.SET_NULL)
    ppl_amt_required = models.IntegerField()
    salary_amount = models.IntegerField(default=0)
    emp_assigned = models.ManyToManyField(
        Employee, blank=True, related_name="jobs")
    from_date = models.DateField()
    to_date = models.DateField()
    owner = models.ForeignKey(
        User, related_name='jobs', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return "%s" % (self.title)

    def need(self):
        return self.skills_required

    class Meta:
        db_table = 'jobs'
        unique_together = (('title', 'from_date', 'to_date'),)


class JobSkillMatrix(models.Model):
    job = models.ForeignKey(
        Job, related_name='skills_required', on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Skill, related_name='jobs', on_delete=models.CASCADE)
    level = models.IntegerField(choices=SkillLevelChoices.choices)
    desc = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'job_skills'

class TypeChoices(models.IntegerChoices):
    CREATE = 0, 'CREATE'
    UPDATE = 1, 'UPDATE'
    DELETE = 2, 'DELETE'

class Log(models.Model):
    type = models.IntegerField(choices=TypeChoices.choices)
    data_type = models.IntegerField(choices=DataType.choices)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField(auto_now=True)
    desc = models.JSONField(null=True)

    class Meta:
        db_table = 'logs'


class ForecastPack(models.Model):
    on = models.DateField(unique=True)
    owner = models.ForeignKey(
        User, related_name='forecasts', on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'forecast_packs'


class Forecast(models.Model):
    pack = models.ForeignKey(
        ForecastPack, related_name="forecasts", on_delete=models.CASCADE)
    n = models.IntegerField()
    val = models.FloatField()

    class Meta:
        db_table = 'forecasts'
        unique_together = (('n', 'pack',),)
        ordering = ('n',)

class CalEvent(models.Model):
    title = models.CharField(max_length=100)
    start = models.DateField()
    end = models.DateField()
    event_type = models.CharField(max_length=100)

    class Meta:
        db_table = 'cal_events'
        ordering = ('start',)
