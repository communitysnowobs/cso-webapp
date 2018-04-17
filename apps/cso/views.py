# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

import datetime
import json
import io

from django.contrib.gis.geos import GEOSGeometry

from rest_framework import decorators
from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from shapely.geometry import Point, shape

from apps.cso.serializers import ObservationListSerializer
# from apps.cso.types import GET_FUNCTIONS
from apps.cso.sources import SOURCES
from apps.cso.models import BBOX


def parse_date(value):
    if not value:
        return None
    return datetime.datetime.fromtimestamp(value/1000.0)


def _do_get_observations(request):
    params = json.loads(request.body.decode("utf-8"))
    source = params.get('source')
    geom = params.get('geom')

    if not source:
        raise ValidationError({
            'error': 'Required argument: source'})

    if not geom:
        raise ValidationError({
            'error': 'Required argument: geom'})
    # Use a proper GEOS shape and calculate the bbox
    aoi = shape(geom)
    bbox = BBOX(*aoi.bounds)

    get_kwargs = {
        'obs_type': params.get('type'),
        'start_date': params.get('start_date'),
        'end_date': params.get('end_date'),
        'bbox': bbox,
        'aoi': aoi,
        'export': params.get('export', 'JSON'),
        'limit': params.get('limit')
    }

    getobs = SOURCES.get(source).get('search')

    if getobs:
        try:
            return getobs(**get_kwargs)
        except ValueError as ex:
            raise ParseError(ex)


@decorators.api_view(['POST'])
@decorators.permission_classes((AllowAny,))
def getobs(request):
    result = ObservationListSerializer(_do_get_observations(request))
    return Response(result.data)
