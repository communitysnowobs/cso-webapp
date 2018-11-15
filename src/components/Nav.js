import css from 'styled-jsx/css'

export default ({downloadButton}) => (
  <div className = 'root'>
    <a href = "/" className = 'title'>CSO <span>Data</span></a>
    {downloadButton && <a href = "/download" className = 'download'>Download Data</a>}
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
    justify-content: space-between;
    position: fixed;
  }
  .download {
    margin-right: 0.5rem;
    padding: 0.25rem 0.5rem;
    display: inline-block;
    align-self: center;
    font-size: 1rem;
    border-radius: 4px;
    background-color: rgba(255,255,255,0.25);
    font-weight: 400;
    transition: 0.25s;
    text-decoration: none;
    color: #fff;
  }
  .download:hover {
    background-color: #08f;
    cursor: pointer;
  }
  .title {
    margin-left: 1rem;
    display: inline-block;
    align-self: center;
    text-decoration: none;
    color: #fff;
  }
  span {
    color: #08f;
  }
`
