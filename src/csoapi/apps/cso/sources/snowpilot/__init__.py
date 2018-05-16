from __future__ import (absolute_import,
                        division,
                        print_function,
                        unicode_literals)

from apps.cso.sources.snowpilot.models import SnowPilotObs
from apps.cso.sources.snowpilot.serializers import SnowPilotObsSerializer
from apps.cso.sources.snowpilot.search import SOURCE_NAME, search

model = SnowPilotObs
serializer = SnowPilotObsSerializer