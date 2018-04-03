# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

import datetime

from rest_framework import decorators
from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.mtnhub.serializers import ObservationListSerializer
from apps.mtnhub.types import GET_FUNCTIONS


def parse_date(value):
    if not value:
        return None
    return datetime.datetime.fromtimestamp(value/1000.0)


def _do_get_observations(request):
    obs_type = request.query_params.get('type')

    if not obs_type:
        raise ValidationError({
            'error': 'Required argument: type'})

    get_kwargs = {
        'from_date': request.query_params.get('from_date'),
        'north_east_lat': request.query_params.get('north_east_lat'),
        'north_east_lng': request.query_params.get('north_east_lng'),
        'south_west_lat': request.query_params.get('south_west_lat'),
        'south_west_lng': request.query_params.get('south_west_lng')
    }

    getobs = GET_FUNCTIONS.get(obs_type)

    if getobs:
        try:
            return getobs(**get_kwargs)
        except ValueError as ex:
            raise ParseError(ex.message)

    raise ValidationError({
        'error': 'Observation type must be one of: {}'
                 .format(', '.join(GET_FUNCTIONS.keys()))
    })


@decorators.api_view(['GET'])
@decorators.permission_classes((AllowAny,))
def getobs(request):
    result = ObservationListSerializer(_do_get_observations(request))
    return Response(result.data)
