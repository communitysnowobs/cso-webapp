import css from 'styled-jsx/css'
import dynamic from 'next/dynamic'
import Dropdown from '../components/Dropdown'
import Button from '../components/Button'
import Input from '../components/Input'
import DownloadForm from '../components/DownloadForm'

import Meta from '../components/Meta.js'
import Nav from '../components/Nav.js'
import ReactMap from '../components/ReactMap.js'

const options = [
  { value: 'mountainhub', label: 'MountainHub' },
  { value: 'snowpilot', label: 'SnowPilot' },
  { value: 'snowtrak', label: "SnowTrak"}
]

export default () => (
  <div className = "root">
    <Meta />
    <Nav />
    <DownloadForm/>
    <style jsx>{style}</style>
  </div>
)

const style = css`
  .root {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgb(12, 12, 12);
  }
  .center-block {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
  }
  .map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -100;
  }
  .map {
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .left, .right {
    width: 50%;
    display: inline-block;
    box-sizing: border-box;
  }
  .left {
    padding-right: 1rem;
  }
  .right {
    padding-left: 1rem;
  }
`
