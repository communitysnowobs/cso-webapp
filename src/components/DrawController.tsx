import { MapController } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import DeckGL, { GeoJsonLayer, GridLayer, ArcLayer, PolygonLayer, PathLayer } from 'deck.gl';
import * as turf from "@turf/turf"

export default class DrawController extends MapController {

  constructor(props) {
    super();
    this.setController = props.setController
    this.mode = "none"
    this.shape = []
    this.temp = []
    this.discardLast = false
    this.drawLayer = null
    this.polygon = null
    this.events = ['mousemove', 'pointerup', 'click'];
  }

  onPolygon = () => {
    this.mode = "polygon"
  }

  onTrash = () => {
    this.mode = "none"
    this.shape = []
    this.temp = []
    this.polygon = null
    this.onUpdate()
  }

  onUpdate = () => {
    // if (this.shape.length > 1) {
    //   this.bbox = turf.bbox(turf.lineString(this.shape))
    // }
    if (this.shape.length + this.temp.length < 3) {
      this.drawLayer = new PathLayer({
        id: 'path-layer',
        data: [{ contour: [...this.shape, ...this.temp] }],
        widthScale: 1,
        widthMinPixels: 1,
        pickable: true,
        getPath: d => d.contour,
        getDashArray: d => [8, 8],
        getColor: d => [0, 125, 255],
        getWidth: d => 3,
      })
    }
    else {
      this.drawLayer = new PolygonLayer({
        id: 'polygon-layer',
        data: [{ contour: [...this.shape, ...this.temp] }],
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.contour,
        getLineDashArray: [8, 8],
        getElevation: d => 10,
        getFillColor: [0, 125, 255, this.mode == "polygon" ? 50 : 150],
        getLineColor: [0, 125, 255],
        getLineWidth: 3,
      })
    }
    this.setController({ drawLayer: this.drawLayer, polygon: this.polygon, mode: this.mode })
  }

  handleEvent(event) {

    if (this.mode === 'polygon') {
      if (event.type === 'pointerup') {

        const viewport = new WebMercatorViewport(this.getMapState()._viewportProps)
        const [lat, lng] = viewport.unproject([event.center.x, event.center.y])

        if (
          this.shape.length >= 3
          && Math.abs(event.center.x - viewport.project(this.shape[this.shape.length - 1])[0]) < 2
          && Math.abs(event.center.y - viewport.project(this.shape[this.shape.length - 1])[1]) < 2
        ) {
          this.mode = 'completed'
          this.polygon = turf.polygon([[...this.shape, this.shape[0]]])
        }
        else {
          this.shape.push([lat, lng])
        }
        this.temp = []
        this.onUpdate()
      }
      else if (event.type === 'mousemove') {
        const viewport = new WebMercatorViewport(this.getMapState()._viewportProps)
        const [lat, lng] = viewport.unproject([event.center.x, event.center.y])
        this.temp = [[lat, lng]]
        this.onUpdate()
      }
      else {
        return super.handleEvent(event)
      }
    } else {
      return super.handleEvent(event);
    }
  }
}
