from django.contrib.auth.models import User
from django.db import models

user_upload_folder = 'files/'


def up_path(path):
    return user_upload_folder + path


class VersUser(models.Model):
    PERMISSION_GROUP_CHOICES = [
        (1, 'owner'),
        (2, 'user'),
        (3, 'none'),
    ]
    # TODO
    user = models.OneToOneField(
        User, related_name='vers_user', on_delete=models.CASCADE)

    # able to create,  delete, edit plant/sector/subsectors
    plant_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)
    sector_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)
    subsector_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)
    department_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)
    # able to create, delete, edit employees. assign skills to employees
    employee_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)

    # able to create, delete, edit jobs. assign skills to jobs
    job_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)

    # able to create, delete, edit skills. assign skills to employee / jobs
    skill_group = models.IntegerField(
        choices=PERMISSION_GROUP_CHOICES, default=3)

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
        Department, related_name='employees', on_delete=models.CASCADE, null=True)
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


class EmpSkillMatrix(models.Model):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    LEVEL_CHOICES = [
        (ONE, '1'),
        (TWO, '2'),
        (THREE, '3'),
        (FOUR, '4'),
    ]
    employee = models.ForeignKey(
        Employee, related_name='skills', on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Skill, related_name='employees', on_delete=models.CASCADE)
    level = models.IntegerField(choices=LEVEL_CHOICES)
    desc = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'employee_skills'


class Job(models.Model):
    title = models.CharField(max_length=50)
    subsector = models.ForeignKey(
        Subsector, related_name="jobs", null=True, on_delete=models.SET_NULL)
    ppl_amt_required = models.IntegerField()
    salary_amount = models.IntegerField(default=0)
    emp_assigned = models.ManyToManyField(Employee, blank=True)
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
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    LEVEL_CHOICES = [
        (ONE, '1'),
        (TWO, '2'),
        (THREE, '3'),
        (FOUR, '4'),
    ]
    job = models.ForeignKey(
        Job, related_name='skills_required', on_delete=models.CASCADE)
    skill = models.ForeignKey(
        Skill, related_name='jobs', on_delete=models.CASCADE)
    level = models.IntegerField(choices=LEVEL_CHOICES)
    desc = models.CharField(max_length=300, blank=True)

    class Meta:
        db_table = 'job_skills'


class Log(models.Model):
    class TypeChoices(models.IntegerChoices):
        CREATE = 0, 'CREATE'
        UPDATE = 1, 'UPDATE'
        DELETE = 2, 'DELETE'

    class DataChoices(models.IntegerChoices):
        PLANT = 1, 'PLANT'
        SECTOR = 2, 'SECTOR'
        SUBSECTOR = 3, 'SUBSECTOR'
        SKILL = 4, 'SKILL'
        EMPLOYEE = 5, 'EMPLOYEE'
        JOB = 6, 'JOB'

    type = models.IntegerField(choices=TypeChoices.choices)
    data_type = models.IntegerField(choices=DataChoices.choices)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    timestamp = models.DateTimeField(auto_now=True)
    desc = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'logs'


class Forecast(models.Model):
    on = models.DateField()
    n = models.IntegerField()
    val = models.FloatField()

    class Meta:
        db_table = 'forecasts'
