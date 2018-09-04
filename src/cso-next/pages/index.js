import dynamic from 'next/dynamic'
import css from 'styled-jsx/css'

import Nav from '../components/Nav.js'
import Meta from '../components/Meta.js'

const Map = dynamic(import('../components/Map.js'), {
  ssr: false
})

export default () => (
  <div className = "root">
    <Meta />
    <Nav />
    <Map/>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    width: 100%;
    height: 100%;
  }
`
