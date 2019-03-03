/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
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
  <Wrapper>
    <Meta />
    <Nav downloadButton = {false}/>
    <DownloadForm/>
  </Wrapper>
)


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgb(12, 12, 12);
`
