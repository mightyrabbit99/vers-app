from django import forms

from . import models


class PlantForm(forms.ModelForm):
    class Meta:
        model = models.Plant
        fields = '__all__'


class SectorForm(forms.ModelForm):
    class Meta:
        model = models.Sector
        fields = '__all__'


class SubsectorForm(forms.ModelForm):
    class Meta:
        model = models.Subsector
        fields = '__all__'


class SkillForm(forms.ModelForm):
    class Meta:
        model = models.Skill
        fields = '__all__'


class DepartmentForm(forms.ModelForm):
    class Meta:
        model = models.Department
        fields = '__all__'


class EmployeeForm(forms.ModelForm):
    class Meta:
        model = models.Employee
        fields = '__all__'


class JobForm(forms.ModelForm):
    class Meta:
        model = models.Job
        fields = '__all__'


class EmpSkillMatrixForm(forms.ModelForm):
    class Meta:
        model = models.EmpSkillMatrix
        fields = '__all__'


class JobSkillMatrixForm(forms.ModelForm):
    class Meta:
        model = models.JobSkillMatrix
        fields = '__all__'


def gen_specifics(field: forms.Field):
    ans = {'type': ''}
    ans['type'] = field.__class__.__name__
    if isinstance(field, forms.MultipleChoiceField):
        ans['choices'] = field.choices
    return ans


def get_form_specifics(form_class: forms.Form):
    decl = form_class.declared_fields
    base = form_class.base_fields

    ans = {}
    for k in decl:
        ans[k] = gen_specifics(decl[k])
    for k in base:
        ans[k] = gen_specifics(base[k])
    return ans
