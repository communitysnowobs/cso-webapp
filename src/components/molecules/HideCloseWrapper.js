import * as React from 'react';
import { SecondaryButton } from '../atoms/Button';
import { withStyle, styled } from 'styletron-react';

const HideCloseButton = withStyle(SecondaryButton, ({ $theme }) => ({
  display: 'inline-block',
  padding: '0.5rem',
  fontFamily: $theme.typography.font200.fontFamily,
  fontSize: $theme.typography.font200.fontSize,
  boxShadow: '0px 0px 40px #A0A0A0',
}));

const HideClose = styled('div', ({ css = {} }) => ({
  ...css
}));

export default class HideCloseWrapper extends React.Component {
  state = {
    open: false
  };
  render() {
    return (
      <HideClose css={this.props.css}>
        <HideCloseButton
          css={this.props.buttonCss}
          onClick={() => this.setState({ open: !this.state.open })}
        >
          {this.state.open
            ? `Hide ${this.props.name}`
            : `Show ${this.props.name}`}
        </HideCloseButton>
        {this.state.open && this.props.children}
      </HideClose>
    );
  }
}
