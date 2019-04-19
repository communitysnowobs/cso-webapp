/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { A } from './Common'
import { NextFC } from "next";

const linkStyle ={
  color: "#000",
  textDecoration: "underline",
  '&:hover,:link,:active,:visited': {
    color: '#000'
  }
}

interface Props {
  className? : string
}

const Attribution: NextFC<Props> = ({className}) => (
  <div className={ "mapboxgl-map mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-compact " + className }>
   <span css={{padding: "0 0.25rem"}}>
     {"Snow Data © "}
     <A css={linkStyle} href="https://about.mountainhub.com/about/" target="_blank">MountainHub</A>
     {" © "}
     <A css={linkStyle} href="https://snowpilot.org" target="_blank">SnowPilot</A>
     {" © "}
     <A css={linkStyle} href="https://www.regobs.no" target="_blank">regObs</A>
     {" | Map Data © "}
     <A css={linkStyle} href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</A>
     {" © "}
     <A css={linkStyle} href="http://www.openstreetmap.org/about/" target="_blank">OpenStreetMap</A>
     {" | "}
     <A css={linkStyle} className="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=mapbox&amp;id=outdoors-v9&amp;access_token=pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w" target="_blank">{"Improve this map"}</A>
   </span>
 </div>
)

export default Attribution
