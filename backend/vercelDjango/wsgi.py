"""
WSGI config for vercelDjango project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

# import os

# from django.core.wsgi import get_wsgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vercelDjango.settings")

# application = get_wsgi_application()


# import os
# import sys

# # YEH IMPORT ZAROORI HAI: Django ke core module se application fetch karne ke liye
# from django.core.wsgi import get_wsgi_application

# # ... yahan aapki paths setup hongi jaise PythonAnywhere default deta hai ...
# # sys.path.append('/home/gtbtax/divisha-org/backend')
# # os.environ['DJANGO_SETTINGS_MODULE'] = 'vercelDjango.settings'

# # PythonAnywhere ke liye variables set karein
# os.environ['DJANGO_DEBUG'] = '0'  
# os.environ['DJANGO_SECRET_KEY'] = 'Aapka-Ek-Bahut-Strong-Production-Secret-Key'
# os.environ['DJANGO_ALLOWED_HOSTS'] = 'gtbtax.pythonanywhere.com'

# # Ab yeh execute ho jayega bina kisi error ke!
# application = get_wsgi_application()


import os
import sys

sys.path.insert(0, "/home/gtbtax/divisha-org/backend")

os.environ["DJANGO_SETTINGS_MODULE"] = "vercelDjango.settings"
os.environ["DJANGO_DEBUG"] = "0"
os.environ["DJANGO_SECRET_KEY"] = "REPLACE_WITH_YOUR_PRIVATE_PRODUCTION_KEY"
os.environ["DJANGO_ALLOWED_HOSTS"] = "gtbtax.pythonanywhere.com"

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()