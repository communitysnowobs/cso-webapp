# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals
from __future__ import division


class Observation(object):

    def __init__(self, id, source_id, name, reported_at, coords, snow_depth, source):
        self.id = id
        self.source_id = source_id
        self.name = name
        self.reported_at = reported_at
        self.coords = coords
        self.snow_depth = snow_depth
        self.source = source


class ObservationList(object):

    def __init__(self, date_start, date_end, obs_type, results, count):
        self.obs_type = obs_type
        self.date_start = date_start
        self.date_end = date_end
        self.results = results
        self.count = count


class BBOX(object):

    def __init__(self, xmin, ymin, xmax, ymax):
        self.xmin = xmin
        self.ymin = ymin
        self.xmax = xmax
        self.ymax = ymax
