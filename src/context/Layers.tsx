import * as React from 'react'

export interface Layers {
    
mapbox: Array<any>
deckgl: Array<any>
}

export const defaultLayers: Layers = {
    mapbox: [],
    deckgl: []
}

export const LayersContext = React.createContext<Layers>(defaultLayers);