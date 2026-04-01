#!/bin/sh
# entrypoint.sh

# Collect static files
python manage.py collectstatic --noinput

# Apply migrations (optional, good practice)
python manage.py migrate

# Start Gunicorn
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000
