from .models import Log, DataType, TypeChoices
import json

CREATE = TypeChoices.CREATE
UPDATE = TypeChoices.UPDATE
DELETE = TypeChoices.DELETE

PLANT = DataType.PLANT
SECTOR = DataType.SECTOR
SUBSECTOR = DataType.SUBSECTOR
SKILL = DataType.SKILL
EMPLOYEE = DataType.EMPLOYEE
DEPARTMENT = DataType.DEPARTMENT
JOB = DataType.JOB
FORECAST = DataType.FORECAST
CAL_EVENT = DataType.CAL_EVENT
LOG = DataType.LOG


def gen_log_data(origin, data_type=None, namespace=None):
  if type(origin) != dict:
    origin = origin.__dict__

  def wrap_name(x):
    return '%s_%s' % (namespace, x) if namespace else x
  origin = dict(map(lambda x: [wrap_name(x), origin[x]], origin))
  return json.loads(json.dumps(origin, default=str))


def log(type, data_type, user, desc, *args, **kwargs):
  lg = Log(type=type,
           data_type=data_type.value,
           user=user, desc={**desc, **kwargs})
  return lg


def log_create(data_type, user, data, *args, **kwargs):
  data = gen_log_data(data)
  return log(CREATE, data_type=data_type, user=user, desc={'data': data}, *args, **kwargs)


def log_update(data_type, user, data, origin, *args, **kwargs):
  data = gen_log_data(data)
  origin = gen_log_data(origin)
  return log(UPDATE, data_type=data_type, user=user, desc={'original': origin, 'data': data}, *args, **kwargs)


def log_delete(data_type, user, origin, *args, **kwargs):
  origin = gen_log_data(origin)
  return log(DELETE, data_type=data_type, user=user, desc={'original': origin}, *args, **kwargs)
