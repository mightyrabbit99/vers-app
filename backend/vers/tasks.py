# Create your tasks here

# celery tasks

from celery import shared_task
import functools
import pandas as pd
from . import models


def gen_plant_df():
    df = pd.DataFrame(columns=['no', 'plant'])
    for x in models.Plant.objects.all():
        df.append([x.pk, x.name])
    return df


def gen_department_df():
    df = pd.DataFrame(columns=['no', 'department'])
    for x in models.Department.objects.all():
        df.append([x.pk, x.name])
    return df


def gen_sector_df():
    df = pd.DataFrame(columns=['no', 'sector', 'plant'])
    for x in models.Sector.objects.all():
        p = models.Plant.objects.get(pk=x.plant)
        df.append([x.pk, x.name, p.name])
    return df


def gen_subsector_df():
    df = pd.DataFrame(columns=['no', 'subsector',
                               'sector', 'unit', 'cycle_time', 'efficiency'])
    for x in models.Subsector.objects.all():
        p = models.Sector.objects.get(pk=x.sector)
        df.append([x.pk, x.name, p.name, x.unit, x.cycle_time, x.efficiency])
    return df


def gen_skill_df():
    df = pd.DataFrame(
        columns=['no', 'skill', 'subsector', 'priority', 'percentage of sector'])
    for x in models.Skill.objects.all():
        p = models.Subsector.objects.get(pk=x.subsector)
        df.append([x.pk, x.name, p.name, x.priority, x.percentage_of_sector])
    return df


def gen_emp_df():
    skill_lst = models.Skill.objects.all()
    df = pd.DataFrame(columns=['no', 'sesa id', 'first name',
                               'last name', 'home location', *map(lambda x: x.name, skill_lst)])

    def f(p, q):
        p[q.skill] = q.level
        return p

    for x in models.Employee.objects.all():
        x_s = functools.reduce(f, x.skills, {})

        def s_lvl_f(x):
            nonlocal x_s
            if x.pk in x_s:
                return x_s[x.pk]
            else:
                return 0
        df.append([x.pk, x.sesa_id, x.first_name, x.last_name,
                   x.subsector, *map(s_lvl_f, skill_lst)])
    return df


@shared_task
def add(x, y):
    return x + y

@shared_task
def write_excel():
    writer = pd.ExcelWriter('pandas_multiple.xlsx')
    df1 = gen_plant_df()
    df2 = gen_department_df()
    df3 = gen_sector_df()
    df4 = gen_subsector_df()

    df1.to_excel(writer, sheet_name='Sheet1')
    df2.to_excel(writer, sheet_name='Sheet2')
    df3.to_excel(writer, sheet_name='Sheet3')
    df4.to_excel(writer, sheet_name='Sheet4')

    writer.save()
