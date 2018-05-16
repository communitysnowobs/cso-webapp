from __future__ import (absolute_import,
                        division,
                        print_function,
                        unicode_literals)

from apps.cso.sources import (mtnhub, snowpilot)

SOURCES = {
    mtnhub.SOURCE_NAME: {
        'model': mtnhub.model,
        'serializer': mtnhub.serializer,
        'search': mtnhub.search
    },

    snowpilot.SOURCE_NAME: {
        'model': snowpilot.model,
        'serializer': snowpilot.serializer,
        'search': snowpilot.search
    }
}