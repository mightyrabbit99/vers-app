# Create your tasks here

# celery tasks

from celery import shared_task
import functools
import pandas as pd
from . import models


def gen_plant_df():
  df = pd.DataFrame(columns=['Name'])
  for x in models.Plant.objects.all():
    df = df.append({
        'Name': x.name
    }, ignore_index=True)
  return df


def gen_sector_df():
  df = pd.DataFrame(columns=['Name', 'Plant'])
  for x in models.Sector.objects.all():
    df = df.append({
        'Name': x.name,
        'Plant': x.plant.name,
    }, ignore_index=True)
  return df


def gen_subsector_df():
  df = pd.DataFrame(columns=['Name',
                             'Sector', 'Unit', 'Cycle Time', 'Efficiency'])
  for x in models.Subsector.objects.all():
    df = df.append({
        'Name': x.name,
        'Sector': x.sector.name,
        'Unit': x.unit,
        'Cycle Time': x.cycle_time,
        'Efficiency': x.efficiency
    }, ignore_index=True)
  return df


def gen_skill_df():
  df = pd.DataFrame(
      columns=['Name', 'Subsector', 'Priority', 'Percentage of Subsector'])
  for x in models.Skill.objects.all():
    df = df.append({
        'Name': x.name,
        'Subsector': x.subsector.name,
        'Priority': x.priority,
        'Percentage of Sector': x.percentage_of_subsector,
    }, ignore_index=True)
  return df


def gen_emp_df():
  skill_lst = models.Skill.objects.all()
  df = pd.DataFrame(columns=['Sesa Id', 'First Name',
                             'Last Name', 'Home Location', *map(lambda x: x.name, skill_lst)])

  def f(p, q):
    p[q.skill.pk] = q.level
    return p

  def get_skill_m(x):
    x_s = functools.reduce(f, x.skills.all(), {})

    def get_level(s):
      return x_s[s.pk] if s.pk in x_s else 0

    def ff(p, q):
      p[q.name] = get_level(q)
      return p
    return functools.reduce(ff, skill_lst, {})

  for x in models.Employee.objects.all():
    df = df.append({
        'Sesa Id': x.sesa_id,
        'First Name': x.first_name,
        'Last Name': x.last_name,
        'Home Location': x.subsector.name,
        **get_skill_m(x)
    }, ignore_index=True)
  return df


def gen_forecast_df():
  def g(p: set, q):
    p.add(q.n)
    return p
  all_n = functools.reduce(g, models.Forecast.objects.all(), set())
  all_n = [*all_n]
  all_n.sort()

  df = pd.DataFrame(columns=['on', *all_n])

  def f(p, q):
    p[q.n] = q.val
    return p

  def get_forecast_m(x):
    x_s = functools.reduce(f, x.forecasts.all(), {})

    def get_val(n):
      return x_s[n] if n in x_s else 0

    def ff(p, q):
      p[q] = get_val(q)
      return p
    return functools.reduce(ff, all_n, {})

  for x in models.ForecastPack.objects.all():
    df = df.append({
        'on': x.on,
        **get_forecast_m(x)
    }, ignore_index=True)
  return df


@shared_task
def add(x, y):
  print("Haha")
  return x + y


@shared_task
def write_excel():
  writer = pd.ExcelWriter('datas.xlsx')
  df1 = gen_plant_df()
  df3 = gen_sector_df()
  df4 = gen_subsector_df()
  df5 = gen_skill_df()
  df6 = gen_emp_df()
  df7 = gen_forecast_df()

  df1.to_excel(writer, sheet_name='Plants')
  df3.to_excel(writer, sheet_name='Sectors')
  df4.to_excel(writer, sheet_name='Subsectors')
  df5.to_excel(writer, sheet_name='Skills')
  df6.to_excel(writer, sheet_name='Employees', index=False)
  df7.to_excel(writer, sheet_name='Forecasts', index=False)

  writer.save()


# init run
write_excel()
