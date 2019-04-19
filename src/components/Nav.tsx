/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { A } from './Common'
import { NextFC } from "next"

interface Props {
  className?: string
}

const Nav: NextFC<Props> = ({className}) => (
  <Title className = {className} href="/">
    Community Snow Observations Data
  </Title>
)

const Title = styled(A)({
  position: "fixed",
  left: "1rem",
  top: "1rem",
  textDecoration: "none",
  color: "#a9a9a9",
  backgroundColor: "#fefefe",
  boxShadow: "#A0A0A0 0px 0px 50px",
  borderRadius: "5px",
  padding: "0.75rem 1rem",
  fontSize: "14px",
  '&:hover,:link,:active,:visited': {
    color: '#a9a9a9'
  }
})

export default Nav
