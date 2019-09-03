import * as React from 'react'
import { Observation } from '../types/Observation'
import ReactMapGL from 'react-map-gl';
import * as R from 'ramda'
import { defaultViewport, ViewportContext } from './Viewport'
import { defaultObservations, ObservationsContext } from './Observations'
import { defaultClustering, ClusteringContext } from './Clustering';
import { defaultSelectors, SelectorsContext } from './Selectors';
import { defaultChecks, ChecksContext } from './Checks';
import { defaultLayers, LayersContext } from './Layers'
import { FunctionalContext } from './Functional'
import { MapContext } from './Map';
import { log } from '../utils'

export default class ContextProvider extends React.Component {

    state = {
        map: React.createRef<ReactMapGL>(),
        viewport: {
            ...defaultViewport,
            width: window.innerWidth,
            height: window.innerHeight,
        },
        observations: {
            ...defaultObservations
        },
        clustering: {
            ...defaultClustering
        },
        selectors: {
            ...defaultSelectors
        },
        checks: {
            ...defaultChecks
        },
        layers: {
            ...defaultLayers
        }
    }

    private setPartialState = (path: string[]) => {
        return (newState: object) => {
            this.setState((state, props) => {
                const partial = R.path(path, state)
                return R.assocPath(path, {...partial, ...newState}, state)
            })
        }
    }

    private setViewport = this.setPartialState(['viewport'])
    private setObservations = this.setPartialState(['observations'])
    private setChecks = this.setPartialState(['checks'])
    private setSelectors = this.setPartialState(['selectors'])

    private setClustered = (clustered: boolean) => {
        if (this.state.checks.map && this.state.checks.layers && this.state.checks.observations) {
            this.setPartialState(['clustering'])({clustered})
            R.forEach(R.partial(this.setLayerVisibility, [clustered]), ['clusters', 'cluster_count', 'snow_obs'])
            R.forEach(R.partial(this.setLayerVisibility, [!clustered]), ['snow_obs_unclustered'])
        }
    }

    // map
    private addSource = (id: string, source: object) => {
        let mapObj = this.state.map.current.getMap()
        mapObj.addSource(id, source)
    }

    private addSources = (sources: { [key: string]: object }) => {
        let mapObj = this.state.map.current.getMap()
        R.forEachObjIndexed((v, k) => mapObj.addSource(k, v), sources)
    }

    private addLayer = (id: string, layer: object) => {
        let mapObj = this.state.map.current.getMap()
        mapObj.addLayer({ ...layer, id })
    }

    private addLayers = (layers: { [key: string]: object }) => {
        let mapObj = this.state.map.current.getMap()
        R.forEachObjIndexed((v, k) => mapObj.addLayer({ ...v, id: k }), layers)
    }

    private setLayerVisibility = (visibile: boolean, layer: object) => {
        let mapObj = this.state.map.current.getMap()
        mapObj.setLayoutProperty(layer, 'visibility', visibile ? 'visible' : 'none');
    }

    private parse = (observation: Observation) => ({
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
        if (this.state.selectors.spatial.mode == 'point') {
            const features = event.features.filter(x => x.layer.id.includes('snow_obs'))
            this.setPartialState(["observations"])({ selected: features })
        }
    }

    fn = {
        setViewport: this.setViewport,
        setObservations: this.setObservations,
        setChecks: this.setChecks,
        setSelectors: this.setSelectors,
        setClustered: this.setClustered,
        map: {
            addSource: this.addSource,
            addSources: this.addSources,
            addLayer: this.addLayer,
            addLayers: this.addLayers,
            onClick: this.onClick
        },
        observations: {
            parse: this.parse
        }
    }

    render() {

        const { children } = this.props;
        return (
            <MapContext.Provider value={this.state.map}>
                <ViewportContext.Provider value={this.state.viewport}>
                    <ObservationsContext.Provider value={this.state.observations}>
                        <ClusteringContext.Provider value={this.state.clustering}>
                            <SelectorsContext.Provider value={this.state.selectors}>
                                <ChecksContext.Provider value={this.state.checks}>
                                    <LayersContext.Provider value={this.state.layers}>
                                        <FunctionalContext.Provider value={this.fn}>
                                            {children}
                                        </FunctionalContext.Provider>
                                    </LayersContext.Provider>
                                </ChecksContext.Provider>
                            </SelectorsContext.Provider>
                        </ClusteringContext.Provider>
                    </ObservationsContext.Provider>
                </ViewportContext.Provider>
            </MapContext.Provider>
        )
    }
}