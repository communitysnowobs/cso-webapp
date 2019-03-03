/** @jsx jsx */
import { jsx, css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'

export default () => (
  <div className="mapboxgl-map mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-compact">
   <Attribution>
     {"Snow Data © "}
     <a href="https://about.mountainhub.com/about/" target="_blank">MountainHub</a>
     {" © "}
     <a href="https://snowpilot.org" target="_blank">SnowPilot</a>
     {" © "}
     <a href="https://www.regobs.no" target="_blank">regObs</a>
     {" | Map Data © "}
     <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/about/" target="_blank">OpenStreetMap</a>
     {" | "}
     <a className="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=mapbox&amp;id=outdoors-v9&amp;access_token=pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w" target="_blank">{"Improve this map"}</a>
   </Attribution>
 </div>
)

const Attribution = styled.span`
  padding: 0 0.25rem;
`
