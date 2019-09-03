import * as React from 'react'
import { Observation } from '../types/Observation'
import ReactMapGL from 'react-map-gl';
import { clusterParams } from '../data/map'
import * as R from 'ramda'
import { MapController } from 'react-map-gl';
import DrawController from './DrawController';

export interface Viewport {
    width: number,
    height: number,
    latitude: number,
    longitude: number,
    zoom: number,
}

export interface Observations {
    all: Array<any>,
    selected: Array<any>
}

export interface Checks {
    map: boolean,
    layers: boolean,
    observations: boolean
}

export interface Controls {
    clustering: {
        clustered: boolean,
    },
    selectors: {
        minDate: string | null,
        maxDate: string | null,
        providers: Array<any>
        spatial: {
            regions: Array<any>
            mode: "point" | "polygon" | "circle",
            controller: MapController | null
        }
    }
}

export interface Layers {
    mapbox: Array<any>
    deckgl: Array<any>
}

export interface State {
    map?: React.RefObject<ReactMapGL>
    viewport: {
        width: number,
        height: number,
        latitude: number,
        longitude: number,
        zoom: number,
    },
    observations: {
        all: Array<any>,
        selected: Array<any>
    },
    controls: {
        clustering: {
            clustered: boolean,
        },
        selectors: {
            minDate: string | null,
            maxDate: string | null,
            providers: Array<any>
            spatial: {
                regions: Array<any>
                mode: "point" | "polygon" | "circle",
                controller: MapController | null
            }
        }
    },
    layers: {
        mapbox: Array<any>
        deckgl: Array<any>
    },
    checks: {
        map: boolean,
        layers: boolean,
        observations: boolean
    },
    fn: {
        setViewport: (x: Partial<State["viewport"]>) => void,
        setObservations: (x: Partial<State["observations"]>) => void
        setControls: (x: Partial<State["controls"]>) => void
        setChecks: (x: Partial<State["checks"]>) => void,
        setClustered: (x: boolean) => void,
        map: {
            addSource: (id: string, source: object) => void,
            addSources: (sources: {[key: string]: object}) => void,
            addLayer: (id: string, layer: object) => void,
            addLayers: (layers: {[key: string]: object}) => void,
            setLayerVisibility: (visibile: boolean, layer: object) => void
            onClick: (event: object) => void
        },
        observations: {
            parse: (observation: Observation) => object
        }
    }
  }

const defaultContext: State = {
    viewport: {
        width: 0,
        height: 0,
        latitude: 30,
        longitude: -30,
        zoom: 2
    },
    observations: {
        all: [],
        selected: []
    },
    controls: {
        clustering: {
            clustered: true,
        },
        selectors: {
            minDate: null,
            maxDate: null,
            providers: [],
            spatial: {
                regions: [],
                mode: "point",
                controller: null,
            }
        }
    },
    checks: {
        map: false,
        layers: false,
        observations: false,
    },
    layers: {
        mapbox: [],
        deckgl: []
    },
    fn: {
        setViewport: () => {},
        setObservations: () => {},
        setChecks: () => {},
        setControls: () => {},
        setClustered: () => {},
        map: {
            addSource: () => {},
            addSources: () => {},
            addLayer: () => {},
            addLayers: () => {},
            setLayerVisibility: () => {},
            onClick: () => {}
        },
        observations: {
            parse: () => { return {} }
        }
    }
  }

export const AppContext = React.createContext<State>(defaultContext);

export const ViewportContext = React.createContext<Viewport>({
    width: 0,
    height: 0,
    latitude: 30,
    longitude: -30,
    zoom: 2
})
  
export class AppContextProvider extends React.Component {

    state = {
        ...defaultContext,
        viewport: {
            ...defaultContext.viewport,
            width: window.innerWidth,
            height: window.innerHeight,
        },
        controls: {
            ...defaultContext.controls,
            selectors: {
                ...defaultContext.controls.selectors,
                spatial: {
                    ...defaultContext.controls.selectors.spatial,
                    controller: DrawController()
                }
            }
        },
        map: React.createRef()
    }
  
    render() {
      const { children } = this.props;
      return (
        <AppContext.Provider
          value={{
            ...this.state,
            fn: {
                setViewport: this.setViewport,
                setObservations: this.setObservations,
                setChecks: this.setChecks,
                setControls: this.setControls,
                setClustered: this.setClustered,
                map: {
                    addSource: this.addSource,
                    addSources: this.addSources,
                    addLayer: this.addLayer,
                    addLayers: this.addLayers,
                    setLayerVisibility: this.setLayerVisibility,
                    onClick: this.onClick
                },
                observations: {
                    parse: this.parseObservation
                }

            }
          }}
        >
          {children}
        </AppContext.Provider>
      );
    }

    private setViewport = (newViewport: Partial<State["viewport"]>) => this.setState({viewport: {...this.state.viewport, ...newViewport}})
    private setObservations = (newObservations: Partial<State["observations"]>) => this.setState({observations: {...this.state.observations, ...newObservations}})
    private setChecks = (newChecks: Partial<State["checks"]>) => { console.log(newChecks); this.setState({checks: {...this.state.checks, ...newChecks}}) }
    private setControls = (newControls: Partial<State["controls"]>) => this.setState({controls: {...this.state.controls, ...newControls}})
    private setClustered = (clustered: boolean) => {
        if (this.state.checks.map && this.state.checks.layers && this.state.checks.observations) {
            this.setControls({clustering: {clustered}})    
            R.forEach(R.partial(this.setLayerVisibility, [clustered]), ['clusters', 'cluster_count', 'snow_obs'])
            R.forEach(R.partial(this.setLayerVisibility, [!clustered]), ['snow_obs_unclustered'])
        }
    }

    // map
    private addSource = (id: string, source: object) => {
        let map = this.state.map.current.getMap()
        map.addSource(id,source)
    }

    private addSources = (sources: {[key: string]: object}) => {
        let map = this.state.map.current.getMap()
        R.forEachObjIndexed((v,k) => map.addSource(k,v), sources)
    }

    private addLayer = (id: string, layer: object) => {
        let map = this.state.map.current.getMap()
        map.addLayer({...layer, id})
    }
    
    private addLayers = (layers: {[key: string]: object}) => {
        let map = this.state.map.current.getMap()
        R.forEachObjIndexed((v, k) => map.addLayer({...v, id: k}), layers)
    }
    
    private setLayerVisibility = (visibile: boolean, layer: object) => {
        console.log("set layer vis")
        let map = this.state.map.current.getMap()
        map.setLayoutProperty(layer, 'visibility', visibile ? 'visible' : 'none');
    }

    private parseObservation = (observation: Observation) => ({
        longitude: observation.geometry.coordinates[0],
        latitude: observation.geometry.coordinates[1],
        author: observation.properties.author,
        source: observation.properties.source,
        depth: observation.properties.depth,
        elevation: observation.properties.elevation,
        id: observation.properties.id,
        timestamp: new Date(observation.properties.timestamp).getTime()
    })

    private onClick = (event: object) => {
        if (this.state.controls.selectors.spatial.mode == 'point') {
            const features = event.features.filter(x => x.layer.id.includes('snow_obs'))
            this.setObservations({selected: features})
        }
    }
  }
