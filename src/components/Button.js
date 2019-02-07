import css from 'styled-jsx/css'

export default ({title, onClick}) => (
  <div className = "root" onClick = {onClick}>
      {title}
      <style jsx>{style}</style>
  </div>
)

const style = css`
  .title {
    color: #fff;
    width: 100%;
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  .root {
    border-radius: 8px;
    color: #fff;
    background-color: #08f;
    text-align: center;
    padding: 0.75rem;
    margin-bottom: 24px;
    margin-top: 40px;
    font-weight: 500;
    transition: 0.25s;
  }
  .root:hover {
    cursor: pointer;
    box-shadow: none;
    background-color: #0074D9;
  }
`
