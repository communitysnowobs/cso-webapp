import css from 'styled-jsx/css'

export default () => (
  <div className = 'root'>
  <img className = 'logo' src="https://i1.wp.com/nasacso.s3-us-west-2.amazonaws.com/wp-content/uploads/2017/02/27215912/Logo_websiteSimple1.jpg?zoom=2&fit=1024%2C721"/>
  <div className = 'titleContainer'>{"Community Snow Observations"}</div>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    background-color: #15B1C2;
    color: white;
    width: 100%;
    font-weight: 700;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.3);
    height: 60px;
    display: flex;
    padding-left: 1rem;
  }
  .logo {
    display: inline-block;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.3);
    height: 70px;
  }
  .titleContainer {
    padding-left: 1rem;
    display: inline-block;
    align-self: center;
  }
`
