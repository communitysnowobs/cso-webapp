import * as React from 'react'

export interface Observations {
    all: Array<any>,
    selected: Array<any>
}

export const defaultObservations: Observations = {
    all: [],
    selected: []
}

export const ObservationsContext = React.createContext<Observations>(defaultObservations);