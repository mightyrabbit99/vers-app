start server

in ./backend
python manage.py runserver


start worker

in ./backend
celery -A backend worker -l INFO


compile frontend

in ./vers-frontend
npm build


