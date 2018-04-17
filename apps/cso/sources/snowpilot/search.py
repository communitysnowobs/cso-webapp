from __future__ import (absolute_import,
                        division,
                        print_function,
                        unicode_literals)

import requests as r
import itertools
import pandas as pd
import datetime

from geopandas import GeoDataFrame
import geopandas as gpd

from lxml import etree
from dask.distributed import Client, as_completed
from shapely.geometry import Point, shape

from apps.cso.models import ObservationList
from apps.cso.sources.snowpilot.models import SnowPilotObs


SOURCE_NAME = 'snowpilot'
BASE_URL = 'http://snowpilot.org/snowpilot-query-feed.xml'

HEADER = {
    'Content-Disposition': 'attachment; filename="query-results.xml"',
    'Content-Type': 'application/xml'
}


def parse_record(item):
    return SnowPilotObs(id=item.id,
                        source_id=item.obs_id,
                        name=' '.join([item.first_name, item.last_name]),
                        reported_at=item.time,
                        coords=[item.lat, item.lon],
                        snow_depth=item.snow_depth,
                        source=SOURCE_NAME)


def get_pitobs(pit):
    pitjson = {
        'snow_depth': '',
        'first_name': '',
        'last_name': '',
        'time': '',
        'lat': '',
        'lon': ''
    }
    pitobs = {
        'Layers': []
    }
    pitobs['Meta'] = dict(pit.attrib.items())

    idx = 0
    for c in pit.getchildren():
        if c.tag == 'Layer':
            pitobs['Layers'].append({
                'Layer_{}'.format(idx): dict(c.attrib.items())
            })
            idx += 1
        else:
            pitobs[c.tag] = dict(c.attrib.items())
    if pitobs['Meta']['heightOfSnowpack']:
        pitjson['snow_depth'] = float(pitobs['Meta']['heightOfSnowpack'])
    if pitobs['User']['first']:
        pitjson['first_name'] = pitobs['User']['first']
    if pitobs['User']['last']:
        pitjson['last_name'] = pitobs['User']['last']
    if pitobs['Meta']['timestamp']:
        pitjson['time'] = datetime.datetime.fromtimestamp(int(pitobs['Meta']['timestamp']) / 1000.0)
    pitjson['depth_unit'] = pitobs['Meta']['depthUnits']
    if (pitobs['Location']['lat'] and pitobs['Location']['longitude']):
        pitjson['lat'] = pitobs['Location']['lat']
        pitjson['lon'] = pitobs['Location']['longitude']
    pitjson['obs_id'] = pitobs['Meta']['nid']
    pitjson['id'] = pitobs['Meta']['nid']
    return pitjson, pitobs


def request_online(page):
    params = {
        'page': page,
        'LOC_NAME': '',
        'OBS_DATE_MIN': '',
        'OBS_DATE_MAX': '',
        'USERNAME': '',
        'AFFIL': '',
        'per_page': '100',
        'submit': 'Get Pits'
    }

    req = r.get(BASE_URL, headers=HEADER, params=params)
    if req.status_code == 200:
        try:
            xmlstr = req.text
            xml = etree.XML(xmlstr.replace('<?xml version="1.0" encoding="UTF-8"?>\n', ''))
            pits = xml.getchildren()
            pitlist = list(map(lambda x: get_pitobs(x)[0], pits))
            return pd.DataFrame.from_records(pitlist)
        except Exception as e:
            print(e)
    else:
        raise Exception(req.status_code)


def _get_online_sp():
    client = Client()  # start local workers as threads
    # TODO: Figure out a way to not hardwire the pages
    futures = client.map(request_online, range(1, 48))
    df = pd.concat(client.gather(futures)).reset_index(drop='index')
    cleaned_df = df[(df['snow_depth'] != '') & (df['lat'] != '') & (df['lon'] != '')].sort_values(
        by='time').reset_index(drop='index')
    cleaned_df.loc[:, 'lon'] = cleaned_df['lon'].apply(lambda x: float(x))
    cleaned_df.loc[:, 'lat'] = cleaned_df['lat'].apply(lambda x: float(x))
    geometry = [Point(xy) for xy in zip(cleaned_df['lon'], cleaned_df['lat'])]
    gdf_sp = GeoDataFrame(cleaned_df, geometry=geometry, crs={'init': 'epsg:4326'})
    return gdf_sp


def search(**kwargs):
    # TODO: Make this more efficient, right now getting everything seems inefficient
    online_sp = _get_online_sp()

    obs_type = kwargs.get('obstype', 'snow_depth')
    start_date = kwargs.get('start_date')
    end_date = kwargs.get('end_date')
    aoi = kwargs.get('aoi')
    limit = kwargs.get('limit')

    aoigdf = GeoDataFrame(pd.DataFrame([{'label': 'aoi'}]),
                          geometry=[aoi], crs={'init': 'epsg:4326'})

    filtgdf = gpd.sjoin(online_sp, aoigdf)

    return ObservationList(
        obs_type=obs_type,
        date_start=filtgdf['time'].min(),
        date_end=filtgdf['time'].max(),
        results=[parse_record(item) for i, item in filtgdf.iterrows()],
        count=len(filtgdf.index))
