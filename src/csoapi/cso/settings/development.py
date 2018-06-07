# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division


from cso.settings.base import *  # noqa

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'SOMESCRETKEYHERE'

INSTALLED_APPS = (
    'corsheaders',
    'django.contrib.contenttypes',
    'django.contrib.auth'
)

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware'
]

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
CORS_ORIGIN_ALLOW_ALL = True


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.contrib.gis.db.backends.postgis',
#         'NAME': 'dbname',
#         'USER': 'username',
#         'PASSWORD': 'password',
#         'HOST': '127.0.0.1',
#         'PORT': '5432',
#         'OPTIONS': {
#             'options': '-c search_path=admin,cso'
#         }
#     }
# }
