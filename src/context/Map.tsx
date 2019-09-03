import * as React from 'react'
import ReactMapGL from 'react-map-gl';

export const defaultMap = null

export const MapContext = React.createContext<React.RefObject<ReactMapGL> | null>(defaultMap);

