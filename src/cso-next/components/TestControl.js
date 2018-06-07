import css from 'styled-jsx/css'

export default () => (
  <div><style jsx>{style}</style></div>
)

const style = css`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  background-color: #fff;
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.1);
`
