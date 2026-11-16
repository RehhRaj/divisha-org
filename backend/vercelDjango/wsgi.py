import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vercelDjango.settings")

os.environ["DJANGO_POS_DEMO"] = "1"

application = get_wsgi_application()
