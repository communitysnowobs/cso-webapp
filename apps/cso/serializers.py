# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

from rest_framework.serializers import (Serializer,
                                        CharField,
                                        IntegerField,
                                        DateTimeField,
                                        ListField,
                                        FloatField)


class ObservationSerializer(Serializer):
    id = CharField()
    source_id = CharField()
    name = CharField()
    reported_at = DateTimeField()
    coords = ListField()
    snow_depth = FloatField()
    source = CharField()


class ObservationListSerializer(Serializer):
    obs_type = CharField()
    date_start = DateTimeField()
    date_end = DateTimeField()
    results = ObservationSerializer(many=True)
    count = IntegerField()
