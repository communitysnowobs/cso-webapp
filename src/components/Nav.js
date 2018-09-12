import css from 'styled-jsx/css'

export default () => (
  <div className = 'root'>
    <div className = 'title'>CSO <span>Data</span></div>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    background-color: rgba(12, 12, 12, 0.75);
    color: #fff;
    width: 100%;
    font-weight: 500;
    height: 48px;
    display: flex;
    font-size: 1.25rem;
  }
  .title {
    padding-left: 1rem;
    display: inline-block;
    align-self: center;
  }
  span {
    color: #08f;
  }
`
