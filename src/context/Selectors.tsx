import * as React from 'react'
import { MapController } from 'react-map-gl';

export interface Selectors {
    minDate: string | null,
    maxDate: string | null,
    providers: Array<any>
    spatial: {
        regions: Array<any>
        mode: "point" | "polygon" | "circle",
        controller: MapController | null
    }
}
export const defaultSelectors: Selectors = {
    minDate: null,
    maxDate: null,
    providers: [],
    spatial: {
        regions: [],
        mode: "point",
        controller: null,
    }

}

export const SelectorsContext = React.createContext<Selectors>(defaultSelectors);