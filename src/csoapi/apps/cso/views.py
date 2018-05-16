# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

import datetime
import json
import io

from django.contrib.gis.geos import GEOSGeometry

import pandas as pd
import geopandas as gpd

from rest_framework import decorators
from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from shapely.geometry import Point, shape

from apps.cso.serializers import ObservationListSerializer
from apps.cso.sources import SOURCES
from apps.cso.models import BBOX, ObservationList


def parse_date(value):
    if not value:
        return None
    return datetime.datetime.fromtimestamp(value/1000.0)


def _do_get_observations(request):
    params = json.loads(request.body.decode("utf-8"))
    source = params.get('source').split(',')
    geom = params.get('geom')
    export = params.get('export')

    if not source:
        raise ValidationError({
            'error': 'Required argument: source'})

    # if not geom:
    #     raise ValidationError({
    #         'error': 'Required argument: geom'})
    # Use a proper GEOS shape and calculate the bbox
    aoi, bbox = None, None
    if geom:
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

    try:
        alldt = []
        allresults = []
        for s in source:
            getobs = SOURCES.get(s).get('search')
            results, stdt, enddt = getobs(**get_kwargs)
            alldt += [stdt, enddt]
            allresults += results

        if export == 'GeoJSON':
            resdct = list(map(lambda x: x.__dict__, allresults))
            df = pd.DataFrame.from_records(resdct)
            df.loc[:, 'reported_at'] = df.apply(lambda x: '{:%Y-%m-%d %H:%M:%S}'.format(x['reported_at']), axis=1)
            geometry = df.apply(lambda x: Point((x['coords'][1], x['coords'][0])), axis=1)
            gdf = gpd.GeoDataFrame(df, geometry=geometry, crs={'init': 'epsg:4326'})

            return gdf
        return ObservationList(
            obs_type='snow_depth',
            date_start=min(alldt),
            date_end=max(alldt),
            results=allresults,
            count=len(allresults))
    except Exception as e:
        print(e)

@decorators.api_view(['POST'])
@decorators.permission_classes((AllowAny,))
def getobs(request):
    obs = _do_get_observations(request)
    if type(obs) == gpd.GeoDataFrame:
        return  Response(json.loads(obs.to_json()))
    result = ObservationListSerializer(obs)
    return Response(result.data)
