export interface Observation {
  longitude: number,
  latitude: number
  author: string
  source: string
  depth: number,
  elevation: number
  timestamp: number,
  id: string
}

export type ObservationKey = keyof Observation
