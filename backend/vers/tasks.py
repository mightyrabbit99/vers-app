# Create your tasks here

# celery tasks

from celery import shared_task
from . import models


@shared_task
def add(x, y):
    return x + y
