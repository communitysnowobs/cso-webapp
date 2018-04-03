# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

from django.conf.urls import url

from apps.mtnhub import views

urlpatterns = [
    url(r'^getobs$', views.getobs, name='mtnhub_api'),
]
