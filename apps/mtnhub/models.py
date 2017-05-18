# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division


class Observation(object):

    def __init__(self, id, name, reported_at, coords, snow_depth):
        self.id = id
        self.name = name
        self.reported_at = reported_at
        self.coords = coords
        self.snow_depth = snow_depth


class ObservationList(object):

    def __init__(self, date_start, date_end, obs_type, results, count):
        self.obs_type = obs_type
        self.date_start = date_start
        self.date_end = date_end
        self.results = results
        self.count = count


class BBOX(object):

    def __init__(self, north_east_lat, north_east_lng, south_west_lat, south_west_lng):
        self.north_east_lat = north_east_lat
        self.north_east_lng = north_east_lng
        self.south_west_lat = south_west_lat
        self.south_west_lng = south_west_lng
