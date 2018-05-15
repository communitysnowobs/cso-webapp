from __future__ import (absolute_import,
                        division,
                        print_function,
                        unicode_literals)

from apps.cso.sources.mtnhub.models import MtnHubObs
from apps.cso.sources.mtnhub.serializers import MtnHubObsSerializer
from apps.cso.sources.mtnhub.search import SOURCE_NAME, search

model = MtnHubObs
serializer = MtnHubObsSerializer