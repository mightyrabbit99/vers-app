# Start Backend Server

cd ./backend
python manage.py runserver


# Start Celery Worker

cd ./backend
celery -A backend worker -l INFO


# Compile Frontend

cd ./vers-frontend
npm build


# Message Broker 

## Rabbitmq

### Open Management UI

localhost:15672


