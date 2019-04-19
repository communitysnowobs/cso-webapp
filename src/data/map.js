export const drawStyle = {
  styles: [
    {
      "id": "gl-draw-line",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#15B1C2",
        "line-dasharray": [0.2, 2],
        "line-width": 2
      }
    },
    {
      "id": "gl-draw-polygon-fill",
      "type": "fill",
      "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      "paint": {
      "fill-color": "#15B1C2",
      "fill-outline-color": "#15B1C2",
      "fill-opacity": 0.1
      }
    },
    {
      "id": "gl-draw-polygon-stroke-active",
      "type": "line",
      "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#15B1C2",
        "line-dasharray": [0.2, 2],
        "line-width": 2
      }
    },
    {
      "id": "gl-draw-polygon-and-line-vertex-halo-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 5,
        "circle-color": "#FFF"
      }
    },
    {
      "id": "gl-draw-polygon-and-line-vertex-active",
      "type": "circle",
      "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
      "paint": {
        "circle-radius": 3,
        "circle-color": "#15B1C2",
      }
    },
    {
      "id": "gl-draw-line-static",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#000",
        "line-width": 3
      }
    },
    {
      "id": "gl-draw-polygon-fill-static",
      "type": "fill",
      "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
      "paint": {
        "fill-color": "#000",
        "fill-outline-color": "#000",
        "fill-opacity": 0.1
      }
    },
    {
      "id": "gl-draw-polygon-stroke-static",
      "type": "line",
      "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#000",
        "line-width": 3
      }
    }
  ]
}

export const clusterStyle = {
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#2398ff",
      100,
      "#2398ff",
      750,
      "#2398ff"
    ],
    "circle-radius": [
      "step",
      ["get", "point_count"],
      20,
      100,
      30,
      750,
      40
    ],
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 2,
  }
}

export const snowObsStyle = {
  paint: {
    "circle-color": "#2398ff",
    "circle-radius": 6,
    "circle-stroke-width": 2,
    "circle-stroke-color": "#fff"
  }
}

export const clusterCountStyle = {
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12
  }
}

export const layers = {
  clusters: {
    type: "circle",
    source: "obs_clustered",
    filter: ["has", "point_count"],
    ...clusterStyle
  },
  cluster_count: {
    type: "symbol",
    source: "obs_clustered",
    filter: ["has", "point_count"],
    ...clusterCountStyle
  },
  snow_obs: {
    type: "circle",
    source: "obs_clustered",
    filter: ["!has", "point_count"],
    ...snowObsStyle
  },
  snow_obs_unclustered: {
    type: "circle",
    source: "obs_unclustered",
    layout: { visibility: "none" },
    ...snowObsStyle
  }
}

export const clusterParams = {
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 75
}
