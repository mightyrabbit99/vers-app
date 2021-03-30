from django import forms

from . import models
from django.contrib.auth.password_validation import validate_password
from captcha.fields import CaptchaField


class UserCreateForm(forms.ModelForm):
  email = forms.CharField(widget=forms.EmailInput())
  password = forms.CharField(
      widget=forms.PasswordInput(), validators=[validate_password])
  captcha = CaptchaField()

  def save(self, commit: bool = True):
    instance = super().save(commit=False)
    instance.set_password(self.cleaned_data['password'])
    vers_user = models.VersUser(user=instance)
    if commit:
      instance.save()
      vers_user.save()
    return instance

  class Meta:
    model = models.User
    fields = ['username', 'email', 'password']


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
