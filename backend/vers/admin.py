from django.contrib import admin

from . import models
from . import forms

# Register your models here.


class PlantAdmin(admin.ModelAdmin):
  form = forms.PlantForm


class SectorAdmin(admin.ModelAdmin):
  form = forms.SectorForm


class SubsectorAdmin(admin.ModelAdmin):
  form = forms.SubsectorForm


class SkillAdmin(admin.ModelAdmin):
  form = forms.SkillForm


class EmployeeAdmin(admin.ModelAdmin):
  form = forms.EmployeeForm


class EmpSkillMatrixAdmin(admin.ModelAdmin):
  form = forms.EmpSkillMatrixForm


class JobSkillMatrixAdmin(admin.ModelAdmin):
  form = forms.JobSkillMatrixForm


admin.site.register(models.Plant, PlantAdmin)
admin.site.register(models.Sector, SectorAdmin)
admin.site.register(models.Subsector, SubsectorAdmin)
admin.site.register(models.Skill, SkillAdmin)
admin.site.register(models.Employee, EmployeeAdmin)
admin.site.register(models.EmpSkillMatrix, EmpSkillMatrixAdmin)
admin.site.register(models.JobSkillMatrix, JobSkillMatrixAdmin)
