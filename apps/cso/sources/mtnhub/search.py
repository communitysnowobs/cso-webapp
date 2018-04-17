from __future__ import (absolute_import,
                        division,
                        print_function,
                        unicode_literals)
import datetime

import pandas as pd
import requests

from apps.cso.sources.mtnhub.models import MtnHubObs
from apps.cso.models import BBOX, ObservationList

SOURCE_NAME = 'mtnhub'

BASE_URL = 'https://api.mountainhub.com/timeline'
HEADER = {
    'Accept-version': '1'
}


def parse_date(value):
    return datetime.datetime.fromtimestamp(value/1000.0)


def parse_record(item):
    return MtnHubObs(id=item.id,
                     source_id=item.obs_id,
                     name=item.author_name,
                     reported_at=parse_date(item.timestamp),
                     coords=[item.lat, item.lng],
                     snow_depth=item.snow_depth,
                     source=SOURCE_NAME)


def parse_records(results):
    observations = []

    for idx, res in enumerate(results):
        observation = res['observation']
        actor = res['actor']
        obs_data = {}
        if 'full_name' in actor.keys():
            obs_data['author_name'] = actor['full_name']
        elif 'fullName' in actor.keys():
            obs_data['author_name'] = actor['fullName']
        obs_data['id'] = observation['_id']
        obs_data['obs_id'] = observation['_id']
        obs_data['timestamp'] = int(observation['reported_at'])
        obs_data['lat'] = observation['location'][1]
        obs_data['lng'] = observation['location'][0]
        obs_data['obs_type'] = observation['type']
        if len(observation['details']) > 0:
            if observation['details'][0]:
                if 'snowpack_depth' in observation['details'][0].keys():
                    obs_data['snow_depth'] = observation['details'][0]['snowpack_depth']

        observations.append(obs_data)

    df = pd.DataFrame.from_records(observations).dropna()

    return df[df['snow_depth'] != 'undefined']


def prepare_bbox(box):
    return {
        'north_east_lat': box.ymax,
        'north_east_lng': box.xmax,
        'south_west_lat': box.ymin,
        'south_west_lng': box.xmin,
    }


def search(**kwargs):
    obs_type = kwargs.get('obstype', 'snow_depth')
    start_date = kwargs.get('start_date')
    end_date = kwargs.get('end_date')
    bbox = kwargs.get('bbox')
    limit = kwargs.get('limit')

    print(vars(bbox))

    params = {
        'publisher': 'all',
        'obs_type': 'snow_conditions',
        'limit': 1000
    }

    if limit:
        params.update({
            'limit': limit
        })

    if bbox:
        params.update(prepare_bbox(bbox))

    if start_date:
        params.update({
            'since': start_date
        })

    if end_date:
        params.update({
            'before': end_date
        })

    response = requests.get(BASE_URL, params=params, headers=HEADER)
    data = response.json()

    if 'results' not in data:
        raise ValueError(data)

    results = data['results']
    count = len(data['results'])

    obsdf = parse_records(results)

    return ObservationList(
        obs_type=obs_type,
        date_start=parse_date(data['pagination']['before']),
        date_end=parse_date(data['pagination']['after']),
        results=[parse_record(item) for i, item in obsdf.iterrows()],
        count=count)
