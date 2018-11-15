import {Component} from 'react';
import css from 'styled-jsx/css'

class RadioGroup extends Component {
  constructor(props) {
    super(props)
    this.renderChildren = this.renderChildren.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this.state = {
      selected: this.props.initiallySelected
    }
  }

  onItemClick(item) {
    if (item != this.state.selected) {
      this.setState({selected: item})
      this.props.onItemChanged(item)
    }

  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        onClick: this.onItemClick,
        selected: (child.props.title == this.state.selected)
      })
    })
  }

  render() {
    return (
      <div className="root">
        {this.renderChildren()}
        <style jsx>{style}</style>
      </div>
    )
  }
}

const style = css`
  .root {
    border-radius: 0.5rem;
    overflow: hidden;
    border: 2px solid #08f;
    text-align: center;
    height: 36px;
    box-sizing: content-box;
  }
`

export default RadioGroup;
