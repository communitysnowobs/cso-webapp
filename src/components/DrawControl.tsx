import { BaseControl, BaseControlProps } from 'react-map-gl'
import * as React from 'react'
import { AppContext } from "./AppContext"

export interface Props extends BaseControlProps {
    className?: string
}

export default class DrawControl extends BaseControl<Props> {

  constructor(props: Props) {
    super(props)
  }

  _renderButton(type: string, label: string, callback: any) {
    return React.createElement('button', {
      key: type,
      className: `mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_${type}`,
      type: 'button',
      title: label,
      onClick: callback,
    });
  }

  onPolygon = () => {
    const context = React.useContext(AppContext)
    context.fn.setObservations({selected: []})
    //this.controller.onPolygon()
  }

  onTrash = () => {
    const context = React.useContext(AppContext)
    context.fn.setObservations({selected: []})
    //this.controller.onTrash()
  }

  _render() {

    return createElement('div', {
      className: `mapboxgl-ctrl mapboxgl-ctrl-group ` + this.props.className,
    }, [
      this._renderButton('polygon', 'Polygon', this.onPolygon),
      this._renderButton('trash', 'Trash', this.onTrash),
    ]);
  }
}