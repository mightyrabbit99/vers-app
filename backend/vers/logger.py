from .models import Log
import json

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


def gen_log_data(origin, data_type = None, namespace = None):
    origin = dict(map(lambda x: ['%s_%s' % (namespace, x[0]), x[1]], origin.items()))
    return json.loads(json.dumps(origin, indent=4, sort_keys=True, default=str))


def log(type, data_type, user, desc, *args, **kwargs):
    lg = Log(type=type,
             data_type=data_type,
             user=user, desc={**desc, **kwargs})
    return lg


def log_create(data_type, user, data, *args, **kwargs):
    return log(CREATE, data_type=data_type, user=user, desc={'data': data}, *args, **kwargs)


def log_update(data_type, user, data, origin, *args, **kwargs):
    return log(UPDATE, data_type=data_type, user=user, desc={'original': origin, 'data': data}, *args, **kwargs)


def log_delete(data_type, user, origin, *args, **kwargs):
    return log(DELETE, data_type=data_type, user=user, desc={'original': origin}, *args, **kwargs)
