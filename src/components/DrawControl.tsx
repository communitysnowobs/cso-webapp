import { BaseControl, BaseControlProps } from 'react-map-gl'
import { createElement } from 'react'

export interface Props extends BaseControlProps {
    onPolygon: any,
    onTrash: any,
    className?: string
}

export default class DrawControl extends BaseControl<Props> {

  constructor(props: Props) {
    super(props)
  }

  _renderButton(type: string, label: string, callback: any) {
    return createElement('button', {
      key: type,
      className: `mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_${type}`,
      type: 'button',
      title: label,
      onClick: callback,
    });
  }

  _render() {
    return createElement('div', {
      className: `mapboxgl-ctrl mapboxgl-ctrl-group ` + this.props.className,
    }, [
      this._renderButton('polygon', 'Polygon', this.props.onPolygon),
      this._renderButton('trash', 'Trash', this.props.onTrash),
    ]);
  }
}
