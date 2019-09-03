import * as React from 'react'

export interface Checks {
    map: boolean,
    layers: boolean,
    observations: boolean
}

export const defaultChecks: Checks = {
    map: false,
    layers: false,
    observations: false
}

export const ChecksContext = React.createContext<Checks>(defaultChecks);