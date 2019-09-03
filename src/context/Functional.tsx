import * as React from 'react'
import { Observation } from '../types/Observation'

import { Viewport } from './Viewport'
import { Observations} from './Observations'
import { Selectors} from './Selectors'
import { Checks } from './Checks'

export interface Functional {
    setViewport: (x: Partial<Viewport>) => void,
    setObservations: (x: Partial<Observations>) => void
    setSelectors: (x: Partial<Selectors>) => void
    setChecks: (x: Partial<Checks>) => void,
    setClustered: (x: boolean) => void,
    map: {
        addSource: (id: string, source: object) => void,
        addSources: (sources: { [key: string]: object }) => void,
        addLayer: (id: string, layer: object) => void,
        addLayers: (layers: { [key: string]: object }) => void,
        onClick: (event: object) => void
    },
    observations: {
        parse: (observation: Observation) => object
    }
}
export const defaultFunctional: Functional = {
    setViewport: () => { },
    setObservations: () => { },
    setChecks: () => { },
    setSelectors: () => { },
    setClustered: () => { },
    map: {
        addSource: () => { },
        addSources: () => { },
        addLayer: () => { },
        addLayers: () => { },
        onClick: () => { }
    },
    observations: {
        parse: () => { return {} }
    }
}

export const FunctionalContext = React.createContext<Functional>(defaultFunctional);