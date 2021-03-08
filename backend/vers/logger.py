from .models import Log

CREATE = Log.TypeChoices.CREATE
UPDATE = Log.TypeChoices.UPDATE
DELETE = Log.TypeChoices.DELETE

PLANT = Log.DataChoices.PLANT
SECTOR = Log.DataChoices.SECTOR
SUBSECTOR = Log.DataChoices.SUBSECTOR
SKILL = Log.DataChoices.SKILL
DEPARTMENT = Log.DataChoices.DEPARTMENT
EMPLOYEE = Log.DataChoices.EMPLOYEE
JOB = Log.DataChoices.JOB
FORECAST = Log.DataChoices.FORECAST


def gen_log_data(data_type, origin):
    return {
        'pk': origin.pk
    }

def log(type, data_type, user, *args, **kwargs):
    lg = Log(type=type,
             data_type=data_type,
             user=user, desc=kwargs)
    return lg

def log_create(data_type, user, data, *args, **kwargs):
    return log(CREATE, data_type=data_type, user=user, *args, **kwargs)

def log_update(data_type, user, data, origin, *args, **kwargs):
    orig = gen_log_data(data_type, origin)
    return log(UPDATE, data_type=data_type, user=user, *args, **orig, **kwargs)

def log_delete(data_type, user, origin, *args, **kwargs):
    orig = gen_log_data(data_type, origin)
    return log(DELETE, data_type=data_type, user=user, *args, **orig, **kwargs)
