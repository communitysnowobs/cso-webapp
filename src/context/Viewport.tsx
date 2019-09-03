import * as React from 'react'

export interface Viewport {
    width: number,
    height: number,
    latitude: number,
    longitude: number,
    zoom: number,
}
export const defaultViewport: Viewport = {
    width: 2,
    height: 0,
    latitude: 30,
    longitude: -30,
    zoom: 2
}

export const ViewportContext = React.createContext<Viewport>(defaultViewport);