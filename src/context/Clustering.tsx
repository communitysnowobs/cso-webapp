import * as React from 'react'

export interface Clustering {
    clustered: boolean
}
export const defaultClustering: Clustering = {
    clustered: true,
}

export const ClusteringContext = React.createContext<Clustering>(defaultClustering);