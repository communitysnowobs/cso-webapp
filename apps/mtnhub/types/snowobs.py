# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division

import requests
import datetime
import pandas as pd

from apps.mtnhub.models import (Observation, ObservationList, BBOX)


OBSERVATION_TYPE = 'snow_depth'
BASE_URL = 'https://api.mountainhub.com/timeline'
HEADER = {
    'Accept-version': '1'
}


def parse_date(value):
    return datetime.datetime.fromtimestamp(value/1000.0)


def parse_record(item):
    return Observation(id=item.author_id,
                       name=item.author_name,
                       reported_at=parse_date(item.timestamp),
                       coords=[item.lat, item.lng],
                       snow_depth=item.snow_depth)


def parse_records(results):
    observations = []

    for res in results:
        observation = res['observation']
        actor = res['actor']
        obs_data = {}
        if 'full_name' in actor.keys():
            obs_data['author_name'] = actor['full_name']
        elif 'fullName' in actor.keys():
            obs_data['author_name'] = actor['fullName']
        obs_data['author_id'] = actor['_id']
        obs_data['timestamp'] = int(observation['reported_at'])
        obs_data['lat'] = observation['location'][1]
        obs_data['lng'] = observation['location'][0]
        obs_data['obs_type'] = observation['type']
        if len(observation['details']) > 0:
            if observation['details'][0]:
                if 'snowpack_depth' in observation['details'][0].keys():
                    obs_data['snow_depth'] = observation['details'][0]['snowpack_depth']

        observations.append(obs_data)

    df = pd.DataFrame.from_records(observations)
    df.dropna(inplace=True)

    return df


def prepare_bbox(north_east_lat, north_east_lng, south_west_lat, south_west_lng):
    box = BBOX(north_east_lat, north_east_lng, south_west_lat, south_west_lng)
    return {
        'north_east_lat': box.north_east_lat,
        'north_east_lng': box.north_east_lng,
        'south_west_lat': box.south_west_lat,
        'south_west_lng': box.south_west_lng,
    }


def get_records(**kwargs):
    from_date = kwargs.get('from_date')
    north_east_lat = kwargs.get('north_east_lat')
    north_east_lng = kwargs.get('north_east_lng')
    south_west_lat = kwargs.get('south_west_lat')
    south_west_lng = kwargs.get('south_west_lng')

    params = {
        'publisher': 'all',
        'obs_type': 'snow_conditions',
        'limit': 9999
    }

    if north_east_lat and north_east_lng \
            and south_west_lat and south_west_lng:
        params.update(prepare_bbox(north_east_lat, north_east_lng, south_west_lat, south_west_lng))

    if from_date:
        params.update({
            'since': from_date
        })

    response = requests.get(BASE_URL, params=params, headers=HEADER)

    data = response.json()

    if 'results' not in data:
        raise ValueError(data)

    results = data['results']
    count = len(data['results'])

    obsdf = parse_records(results)

    return ObservationList(
        obs_type=OBSERVATION_TYPE,
        date_start=parse_date(data['pagination']['before']),
        date_end=parse_date(data['pagination']['after']),
        results=[parse_record(item) for i, item in obsdf.iterrows()],
        count=count)
