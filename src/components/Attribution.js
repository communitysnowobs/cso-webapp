import css from 'styled-jsx/css'

export default () => (
  <div id="attribution" className="mapboxgl-map mapboxgl-ctrl mapboxgl-ctrl-attrib mapboxgl-compact">
   <span>
     {"Snow Data © "}
     <a href="https://about.mountainhub.com/about/" target="_blank">MountainHub</a>
     {" © "}
     <a href="https://snowpilot.org" target="_blank">SnowPilot</a>
     {" | Map Data © "}
     <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> © <a href="http://www.openstreetmap.org/about/" target="_blank">OpenStreetMap</a>
     {" | "}
     <a className="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=mapbox&amp;id=outdoors-v9&amp;access_token=pk.eyJ1IjoibHNldGlhd2FuIiwiYSI6ImNpbjI3M2UzNzBiZzh2OWtrZGlzZ2FhaG8ifQ.tkoR6uJikfFpOq4jfsk02w" target="_blank">{"Improve this map"}</a>
   </span>
   <style jsx>{style}</style>
 </div>
)

const style = css`
  #attribution {
    position: fixed;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, .5);
  }
  span {
    padding-right: 4px;
  }
`
