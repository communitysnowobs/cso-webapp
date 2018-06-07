import css from 'styled-jsx/css'

export default ({message}) => (
  <div className = 'root'>{message}
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    background-color: #DB2929;
    color: white;
    width: 100%;
    padding: 0px;
    border: 0px;
    margin: 0px;
    text-align: center;
    padding:  0.67rem 0;
  }
`
