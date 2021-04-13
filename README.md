# Introduction
## Description
Versatility App for Data Management and Forecast Calculation

## Components
### Frontend
Built using React (nodejs)
### Backend
REST and Websocket Backend  
Built using Django (python)
### Worker and Message Broker
Built using Rabbitmq

# Guide
## Start Backend Server

```
cd ./backend
python manage.py runserver
```

## Start Frontend Development Server
```
cd ./vers-frontend
npm start
```

## Start Celery Worker
```
cd ./backend
celery -A backend worker -l INFO
```

## Compile Frontend
```
cd ./vers-frontend
npm run build
```

## Open Rabbitmq Management Site
goto http://localhost:15672  
default user: guest, password: guest

# Dependencies
## Backend (python)
### Django Server
* Django
* corsheaders
* rest_framework
* captcha
* django_celery_results
* channels

### Data Processing
* openpyxl
* pandas

### Worker
* celery

## Frontend (npm)
### React
* react
* react-dom
* redux
* redux-saga
* clsx

### Typescript
* typescript

### API
* axios

### Components
* @material-ui
* react-big-calendar

### Data Processing
* exceljs
* file-saver

### Misc
* lodash
* moment
