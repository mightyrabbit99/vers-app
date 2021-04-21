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

# Instructions
## Backend (backend)
### Make Migrations (DB Change Instructions)
```
python manage.py makemigrations
```
### Apply Migrations to DB
```
python manage.py migrate --database <db_name>
```
### Start Backend Server

```
python manage.py runserver --settings=<path.to.settings> <ip>:<port>
```

### Start Celery Worker
```
celery -A <name> worker -l INFO
```

### Open Rabbitmq Management Site
goto http://localhost:15672  
default user: guest, password: guest

## Frontend (vers-frontend)
### Start Frontend Development Server
```
npm start
```

### Compile Frontend
```
npm run build
```

# Dependencies
## Backend (python)
### Django Server
* Django
* corsheaders
* rest_framework
* captcha
* django_celery_results
* channels

### Database
* mysqlclient

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
* @material-ui/core
* @material-ui/lab
* react-big-calendar
* react-vitualized
* react-window
* react-virtualized-auto-sizer

### Data Processing
* exceljs
* file-saver

### Misc
* lodash
* moment
